import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  getAdditionalUserInfo,
  getRedirectResult,
  updateProfile,
  deleteUser,
  sendEmailVerification,
  applyActionCode
} from 'firebase/auth';
import { auth } from './firebase';
import { sendUserToKlaviyo } from './klaviyo';

type VerificationState = 'idle' | 'verifying' | 'success' | 'error';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signupWithEmail: (email: string, pass: string, firstName: string) => Promise<User>;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  handleEmailVerification: (oobCode: string) => Promise<void>;
  resetVerificationState: () => void;
  verificationState: VerificationState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');


  useEffect(() => {
    // First, check for a redirect result. This handles the user returning from Google Sign-In.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // A user has successfully signed in via redirect.
          const additionalInfo = getAdditionalUserInfo(result);
          if (additionalInfo?.isNewUser && result.user.email) {
            const firstName = result.user.displayName?.split(' ')[0];
            sendUserToKlaviyo(result.user.email, firstName);
          }
        }
      })
      .catch((error) => {
        // Handle errors from the redirect sign-in.
        console.error("Error processing Google sign-in redirect:", error);
      });
      
    // Set up the listener for auth state changes. This will update the user state
    // whether they signed in via redirect, email/password, or are already logged in.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signupWithEmail = async (email: string, password: string, firstName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: firstName });
    await sendEmailVerification(userCredential.user);
    
    // Manually reload the user to ensure the displayName is available.
    // This triggers onAuthStateChanged with the updated user object.
    await userCredential.user.reload();

    if (userCredential.user.email) {
      await sendUserToKlaviyo(userCredential.user.email, firstName);
    }
    return userCredential.user;
  };
  
  const loginWithEmail = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    // The page will redirect, so this function won't return a user directly.
    // The result is handled by getRedirectResult in the useEffect hook.
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in.");
    }
  
    try {
      await deleteUser(user);
    } catch (error: any) {
      console.error("Error deleting Firebase user", error);
      // Re-throw the error so the UI can handle it, e.g., show a re-authentication message.
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in to resend verification email.");
    }
    await sendEmailVerification(user);
  };

  const handleEmailVerification = useCallback(async (oobCode: string) => {
    if (verificationState !== 'idle') return;
    setVerificationState('verifying');
    try {
      await applyActionCode(auth, oobCode);
      setVerificationState('success');
    } catch (error) {
      console.error("Email verification failed", error);
      alert("Your verification link is invalid or has expired. Please log in to get a new one sent.");
      setVerificationState('idle');
    }
  }, [verificationState]);

  const resetVerificationState = () => {
    setVerificationState('idle');
  }

  const value = {
    user,
    loading,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    deleteAccount,
    resendVerificationEmail,
    handleEmailVerification,
    resetVerificationState,
    verificationState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};