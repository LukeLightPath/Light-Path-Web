import React, { useEffect } from 'react';

interface EmailVerifiedSuccessProps {
    onReturnToLogin: () => void;
}

const EmailVerifiedSuccess: React.FC<EmailVerifiedSuccessProps> = ({ onReturnToLogin }) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/";
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleReturnToLogin = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4" style={{ backgroundColor: '#F5F8FF' }}>
            <div className="w-full max-w-md">
                <header className="py-8 text-center">
                    <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-slate-50 tracking-tight">
                        LightPath AI Agency Performance Suite
                    </h1>
                </header>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-label="Success icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-4">
                        Your email has been verified
                    </h2>
                    <p aria-live="polite" className="text-slate-600 dark:text-slate-400 mb-6">
                        You can now log in and access your LightPath Tools Bundle.
                    </p>
                    
                    <button 
                        onClick={handleReturnToLogin}
                        className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                        style={{ backgroundColor: '#2A4EF4' }}
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerifiedSuccess;