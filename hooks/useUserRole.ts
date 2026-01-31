import { useAuth, UserRole } from './useAuth';

export const useUserRole = () => {
    const { userProfile, loading } = useAuth();

    const hasRole = (allowedRoles: UserRole[]): boolean => {
        if (!userProfile) return false;
        return allowedRoles.includes(userProfile.role);
    };

    const isAdmin = (): boolean => {
        return userProfile?.role === 'admin';
    };

    const isPaidUser = (): boolean => {
        return userProfile?.role === 'paid_user' && userProfile?.subscription_status === 'active';
    };

    const isFreeUser = (): boolean => {
        return userProfile?.role === 'free_user';
    };

    const hasActiveSubscription = (): boolean => {
        return userProfile?.subscription_status === 'active';
    };

    return {
        userProfile,
        loading,
        hasRole,
        isAdmin,
        isPaidUser,
        isFreeUser,
        hasActiveSubscription
    };
};
