import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

// User roles type
export type UserRole = 'free_user' | 'paid_user' | 'admin';
export type SubscriptionStatus = 'active' | 'inactive' | 'canceled';
export type SubscriptionPlan = 'pro' | 'elite' | 'founder' | null;

export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
    role: UserRole;
    subscription_status: SubscriptionStatus;
    subscription_plan: SubscriptionPlan;
    created_at: string;
    last_login: string;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from Supabase
    const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data as UserProfile;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };

    // Create user profile in Supabase
    const createUserProfile = async (user: User, displayName?: string): Promise<UserProfile | null> => {
        try {
            const newProfile = {
                id: user.id,
                email: user.email || '',
                display_name: displayName || user.user_metadata?.full_name || 'Usuário',
                role: 'free_user' as UserRole,
                subscription_status: 'inactive' as SubscriptionStatus,
                subscription_plan: null,
                last_login: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('user_profiles')
                .insert([newProfile])
                .select()
                .single();

            if (error) throw error;
            return data as UserProfile;
        } catch (error) {
            console.error('Error creating user profile:', error);
            return null;
        }
    };

    // Update last login
    const updateLastLogin = async (userId: string) => {
        try {
            await supabase
                .from('user_profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('id', userId);
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    };

    // Sign in with email/password
    const signInWithEmail = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        if (data.user) {
            await updateLastLogin(data.user.id);
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
    };

    // Sign up with email/password
    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: displayName
                }
            }
        });

        if (error) throw error;

        // Profile will be created by database trigger
        // But we can also create it here as fallback
        if (data.user) {
            await createUserProfile(data.user, displayName);
        }
    };

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        setUser(null);
        setSession(null);
        setUserProfile(null);
    };

    // Reset password
    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) throw error;
    };

    // Listen to auth state changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchUserProfile(session.user.id).then(profile => {
                    setUserProfile(profile);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                let profile = await fetchUserProfile(session.user.id);

                // Create profile if it doesn't exist
                if (!profile) {
                    profile = await createUserProfile(session.user);
                }

                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        session,
        userProfile,
        loading,
        signInWithEmail,
        signInWithGoogle,
        signUpWithEmail,
        signOut,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
