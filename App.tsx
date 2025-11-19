
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import AuthForm from './components/AuthForm';
import ToolsBundle from './components/ToolsBundle';
import EmailVerificationRequired from './components/EmailVerificationRequired';
import EmailVerifiedSuccess from './components/EmailVerifiedSuccess';
import Website from './components/Website';

const App: React.FC = () => {
  const { 
    user, 
    loading, 
    logout, 
    handleEmailVerification, 
    verificationState, 
    resetVerificationState 
  } = useAuth();

  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
        // If validating email, show app view immediately
        setShowApp(true);
        handleEmailVerification(oobCode);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleEmailVerification]);

  // If user is logged in, show the app by default
  useEffect(() => {
      if (user) {
          setShowApp(true);
      }
  }, [user]);

  if (loading || verificationState === 'verifying') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-obsidian flex justify-center items-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-500 dark:text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // 1. Verification Success Screen
  if (verificationState === 'success' || window.location.pathname === '/email-verified') {
    return <EmailVerifiedSuccess onReturnToLogin={resetVerificationState} />;
  }
  
  // 2. Logged In User -> Tools or Verification Required
  if (user) {
    return user.emailVerified 
      ? <ToolsBundle user={user} onLogout={logout} /> 
      : <EmailVerificationRequired />;
  }

  // 3. Public Website View
  if (!showApp) {
      return <Website onLoginClick={() => setShowApp(true)} />;
  }

  // 4. Auth Form (Login/Signup)
  return <AuthForm onBackToWebsite={() => setShowApp(false)} />;
};

export default App;
