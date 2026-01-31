import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ViewState } from '../types';

interface ForgotPasswordProps {
    onNavigate?: (view: ViewState) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        if (onNavigate) {
            onNavigate(ViewState.LOGIN);
        } else {
            window.location.href = '/';
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-status-success/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-status-success text-3xl">
                            mark_email_read
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Email Enviado!</h2>
                    <p className="text-slate-400 mb-6">
                        Enviamos um link de recuperação para <strong className="text-white">{email}</strong>.
                        Verifique sua caixa de entrada e spam.
                    </p>
                    <button
                        onClick={handleBackToLogin}
                        className="inline-block bg-primary-purple hover:bg-primary-purple-dark px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                    >
                        Voltar para Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-orange to-accent-orange-dark rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl">
                            factory
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
                    <p className="text-slate-400">
                        Digite seu email para receber o link de recuperação
                    </p>
                </div>

                {/* Card */}
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-purple"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {error && (
                            <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-3 text-sm text-status-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-purple to-primary-purple-dark hover:from-primary-purple-dark hover:to-primary-purple text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto bg-transparent border-none cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar para Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
