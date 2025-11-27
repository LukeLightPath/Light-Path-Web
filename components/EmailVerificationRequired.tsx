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
        <div className="min-h-screen bg-[#fdfcfc] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <header className="py-8 text-center">
                    <h1 className="text-3xl font-bold font-heading text-stone-900 tracking-tight">
                        LightPath AI Agency Performance Suite
                    </h1>
                </header>
                <div className="bg-white rounded-lg shadow-card border border-stone-200 p-6 sm:p-8 text-center">
                    <h2 className="text-2xl font-bold font-heading text-stone-900 mb-4">
                        Verify your email to continue
                    </h2>
                    <p className="text-stone-600 mb-2">
                        We have sent a verification link to your inbox. Please click the link to activate your account and access your LightPath tools.
                    </p>
                    <p className="text-stone-500 mb-6" style={{ fontSize: '13px' }}>
                        If you don’t see the email in the next few minutes, please check your junk or spam folder.
                    </p>
                    
                    {message && (
                        <p aria-live="polite" className={`text-sm mb-4 ${messageType === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    <div className="space-y-4">
                        <button 
                            onClick={handleResend}
                            disabled={isSending}
                            className="w-full py-3 px-4 bg-stone-900 text-white font-medium rounded-md hover:bg-stone-800 transition-colors shadow-sm disabled:bg-stone-400 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Sending...' : 'Resend verification email'}
                        </button>
                        <button 
                            onClick={logout}
                            className="w-full py-3 px-4 bg-stone-100 text-stone-700 font-medium rounded-md hover:bg-stone-200 transition-colors"
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