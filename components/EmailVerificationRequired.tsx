import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const EmailVerificationRequired: React.FC = () => {
    const { user, resendVerificationEmail, logout } = useAuth();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleResend = async () => {
        setIsSending(true);
        setMessage(null);
        try {
            await resendVerificationEmail();
            setMessage(`A new verification link has been sent to ${user?.email}.`);
            setMessageType('success');
        } catch (error) {
            console.error(error);
            setMessage('Failed to send verification email. Please try again in a few minutes.');
            setMessageType('error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <header className="py-8 text-center">
                    <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-slate-50 tracking-tight">
                        LightPath AI Agency Performance Suite
                    </h1>
                </header>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                    <h2 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-4">
                        Verify your email to continue
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                        We have sent a verification link to your inbox. Please click the link to activate your account and access your LightPath tools.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mb-6" style={{ fontSize: '13px', color: '#666' }}>
                        If you don’t see the email in the next few minutes, please check your junk or spam folder.
                    </p>
                    
                    {message && (
                        <p aria-live="polite" className={`text-sm mb-4 ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <div className="space-y-4">
                        <button 
                            onClick={handleResend}
                            disabled={isSending}
                            className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg disabled:bg-primary-400 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Sending...' : 'Resend verification email'}
                        </button>
                        <button 
                            onClick={logout}
                            className="w-full py-3 px-4 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationRequired;