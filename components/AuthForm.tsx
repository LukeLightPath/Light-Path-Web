
import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { ThemeToggle } from './ThemeToggle';
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative bg-slate-50 dark:bg-obsidian transition-colors duration-300">
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 z-20">
         {onBackToWebsite && (
             <button onClick={onBackToWebsite} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                 <BackIcon className="w-4 h-4" />
                 Back to Home
             </button>
         )}
      </div>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <header className="py-12 text-center">
            <h1 className="text-4xl md:text-6xl font-black font-heading text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 tracking-tight drop-shadow-sm">
                LightPath AI
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Agency Performance Suite
            </p>
        </header>
        
        {/* Auth Card */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.2)] p-8 relative overflow-hidden transition-colors duration-300">
             {/* Decorative glowing line top */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 dark:via-cyan-500 to-transparent opacity-50"></div>

            {verificationMessage && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-center text-green-600 dark:text-green-400" role="alert">
                {verificationMessage}
              </div>
            )}

            <div className="flex p-1 bg-slate-100 dark:bg-black/20 rounded-xl mb-8">
                <button onClick={() => handleTabSwitch(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${isLogin ? 'bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>Log In</button>
                <button onClick={() => handleTabSwitch(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${!isLogin ? 'bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>Create Account</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">First name</label>
                    <input type="text" id="firstName" value={firstName} onChange={e => { setFirstName(e.target.value); clearMessages(); }} required className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-500/50 transition-all" placeholder="Enter your first name" />
                  </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email address</label>
                    <input type="email" id="email" value={email} onChange={e => { setEmail(e.target.value); clearMessages(); }} required className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-500/50 transition-all" placeholder="name@agency.com" />
                </div>
                <div>
                    <label htmlFor="password"className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                    <input type="password" id="password" value={password} onChange={e => { setPassword(e.target.value); clearMessages(); }} required minLength={6} className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-500/50 transition-all" placeholder="••••••••" />
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
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-black/20 text-blue-600 dark:text-cyan-600 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-0"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-slate-600 dark:text-slate-400">
                          I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 hover:underline transition-colors">Terms and Conditions</a>
                        </label>
                      </div>
                    </div>
                    {termsError && <p className="text-red-500 dark:text-red-400 text-xs mt-2 ml-1">{termsError}</p>}
                  </div>
                )}

                {resetMessage && (
                  <p className={`text-sm text-center p-3 rounded-lg ${resetMessage.type === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                    {resetMessage.text}
                  </p>
                )}
                {error && <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg text-sm text-center">{error}</p>}

                <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
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
                            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}
            </form>
        </div>
      </div>
      <div className="relative z-10 text-center pt-8 flex gap-4 items-center justify-center text-xs text-slate-500 dark:text-slate-500">
        <a href="https://lightpath.agency/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            Privacy Policy
        </a>
        <span className="text-slate-400 dark:text-slate-700">•</span>
        <a href="https://lightpath.agency/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
            Terms & Conditions
        </a>
      </div>
    </div>
  );
};

export default AuthForm;
