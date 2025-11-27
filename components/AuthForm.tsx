import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { BackIcon } from './icons';

interface AuthFormProps {
    onBackToWebsite?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onBackToWebsite }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // New state for terms and conditions
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const { signupWithEmail, loginWithEmail } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
      setVerificationMessage('Your email has been verified. You can now log in.');
    }
  }, []);

  const clearMessages = () => {
    setError(null);
    setResetMessage(null);
    setTermsError(null);
  };

  const handleTabSwitch = (login: boolean) => {
    setIsLogin(login);
    setTermsAccepted(false); 
    clearMessages();
  };

  const handlePasswordReset = async () => {
    clearMessages();
    if (!email) {
      setResetMessage({ text: 'Please enter your email address first.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage({ text: 'Password reset link sent. Check your inbox and junk folder.', type: 'success' });
    } catch (err) {
      let message = 'Something went wrong. Please try again in a moment.';
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
            message = 'No account found with that email.';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            break;
        }
      }
      setResetMessage({ text: message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isLogin && !termsAccepted) {
        setTermsError("You must accept the terms and conditions to continue.");
        return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, firstName);
      }
    } catch (err) {
        if (err instanceof FirebaseError) {
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
            }
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative bg-[#fdfcfc] transition-colors duration-300">
      {/* Top Navigation */}
      <div className="absolute top-6 left-6 z-20">
         {onBackToWebsite && (
             <button onClick={onBackToWebsite} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                 <BackIcon className="w-4 h-4" />
                 Back to Home
             </button>
         )}
      </div>

      <div className="w-full max-w-md relative z-10">
        <header className="py-12 text-center">
            <h1 className="text-3xl font-bold font-heading text-stone-900 tracking-tight">
                LightPath AI
            </h1>
            <p className="mt-2 text-lg text-stone-500 font-light">
                AI growth agency tools suite
            </p>
        </header>
        
        {/* Auth Card */}
        <div className="bg-white border border-stone-200 rounded-lg shadow-card p-8 relative overflow-hidden">
            
            {verificationMessage && (
              <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-100 text-sm text-center text-green-700" role="alert">
                {verificationMessage}
              </div>
            )}

            <div className="flex p-1 bg-stone-100 rounded-md mb-8">
                <button onClick={() => handleTabSwitch(true)} className={`flex-1 py-2 text-sm font-medium rounded transition-all duration-200 ${isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Log In</button>
                <button onClick={() => handleTabSwitch(false)} className={`flex-1 py-2 text-sm font-medium rounded transition-all duration-200 ${!isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>Create Account</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">First name</label>
                    <input type="text" id="firstName" value={firstName} onChange={e => { setFirstName(e.target.value); clearMessages(); }} required className="w-full px-4 py-3 bg-white border border-stone-300 rounded-md text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-0 transition-all" placeholder="Enter your first name" />
                  </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email address</label>
                    <input type="email" id="email" value={email} onChange={e => { setEmail(e.target.value); clearMessages(); }} required className="w-full px-4 py-3 bg-white border border-stone-300 rounded-md text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-0 transition-all" placeholder="name@agency.com" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Password</label>
                    <input type="password" id="password" value={password} onChange={e => { setPassword(e.target.value); clearMessages(); }} required minLength={6} className="w-full px-4 py-3 bg-white border border-stone-300 rounded-md text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-0 transition-all" placeholder="••••••••" />
                </div>
                
                {!isLogin && (
                  <div className="mt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={(e) => {
                            setTermsAccepted(e.target.checked);
                            if (e.target.checked) setTermsError(null);
                          }}
                          className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-stone-600">
                          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-stone-900 hover:underline transition-colors">Terms and Conditions</a>
                        </label>
                      </div>
                    </div>
                    {termsError && <p className="text-red-600 text-xs mt-2 ml-1">{termsError}</p>}
                  </div>
                )}

                {resetMessage && (
                  <p className={`text-sm text-center p-3 rounded-md ${resetMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {resetMessage.text}
                  </p>
                )}
                {error && <p className="text-red-700 bg-red-50 p-3 rounded-md text-sm text-center">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-md shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (isLogin ? 'Log In' : 'Create Account')}
                </button>

                {isLogin && (
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            disabled={isLoading}
                            className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}
            </form>
        </div>
      </div>
      <div className="relative z-10 text-center pt-8 flex gap-4 items-center justify-center text-xs text-stone-400">
        <a href="https://lightpath.agency/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 transition-colors">
            Privacy Policy
        </a>
        <span className="text-stone-300">•</span>
        <a href="https://lightpath.agency/terms" target="_blank" rel="noopener noreferrer" className="hover:text-stone-600 transition-colors">
            Terms & Conditions
        </a>
      </div>
    </div>
  );
};

export default AuthForm;