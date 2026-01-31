import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    requireActiveSubscription?: boolean;
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    requireActiveSubscription = false,
    redirectTo = '/login'
}) => {
    const { userProfile, loading, hasRole, hasActiveSubscription } = useUserRole();

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-primary-purple text-6xl animate-spin">
                        progress_activity
                    </span>
                    <p className="text-slate-400 mt-4">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!userProfile) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check role permission
    if (!hasRole(allowedRoles)) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                    <span className="material-symbols-outlined text-status-error text-6xl mb-4">
                        block
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
                    <p className="text-slate-400 mb-6">
                        Você não tem permissão para acessar esta área.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-primary-purple hover:bg-primary-purple-dark px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    // Check subscription requirement
    if (requireActiveSubscription && !hasActiveSubscription()) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
                    <span className="material-symbols-outlined text-accent-orange text-6xl mb-4">
                        workspace_premium
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">Recurso Premium</h2>
                    <p className="text-slate-400 mb-6">
                        Esta funcionalidade está disponível apenas para assinantes Pro e Elite.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                        >
                            Voltar
                        </button>
                        <button
                            onClick={() => window.location.href = '/pricing'}
                            className="flex-1 bg-accent-orange hover:bg-accent-orange-dark px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                        >
                            Ver Planos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // All checks passed
    return <>{children}</>;
};

export default ProtectedRoute;
