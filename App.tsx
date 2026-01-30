
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import OrbitPage from './components/OrbitPage';
import Dashboard from './components/Dashboard';
import EditalAnalyzer from './components/EditalAnalyzer';
import BudgetManager from './components/BudgetManager';
import CareerMode from './components/CareerMode';
import TeamManager from './components/TeamManager';
import AdminEdictsManager from './components/AdminEdictsManager';
import AdminPanel from './components/AdminPanel';
import PortfolioGenerator from './components/PortfolioGenerator';
import PlansPage from './components/PlansPage';
import ProjectManager from './components/ProjectManager';
import ProfileView from './components/ProfileView';
import SupportCenter from './components/SupportCenter';
import AllToolsPage from './components/AllToolsPage';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import { ViewState } from './types';
import { RealTimeProvider, useRealTime } from './components/RealTimeContext';
import { AuthProvider, useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
    const [targetProjectId, setTargetProjectId] = useState<string | null>(null);
    const [initialCreate, setInitialCreate] = useState(false);
    const { on, off } = useRealTime();
    const { user, loading, userProfile: authUserProfile } = useAuth(); // Auth Guard Source of Truth
    const [toast, setToast] = useState<{ title: string, message: string } | null>(null);

    // Mock Context Data
    const MOCK_USER_EMAIL = "produtorahc@gmail.com"; // Simulação de Login

    // Mock User State (Simulating Database) - Keep for compatibility with existing components
    // but try to sync with authUserProfile where possible
    const [userProfile, setUserProfile] = useState<{
        roles: string[];
        segments: string[];
        isConfigured: boolean;
        email?: string;
        display_name?: string;
        role?: string;
    }>({ roles: [], segments: [], isConfigured: false });

    // Sync auth profile with local state
    useEffect(() => {
        if (authUserProfile) {
            setUserProfile(prev => ({
                ...prev,
                email: authUserProfile.email,
                display_name: authUserProfile.display_name,
                role: authUserProfile.role,
                // Assume configured if we have a valid profile from Supabase for now, 
                // or keep it false if you want forced onboarding. 
                // For now, let's assume if they have a profile they are 'configured' enough to access Orbit
                isConfigured: true
            }));
        }
    }, [authUserProfile]);

    // --- AUTH GUARD ---
    useEffect(() => {
        if (!loading) {
            if (!user) {
                const publicViews = [ViewState.LOGIN, ViewState.LANDING, ViewState.FORGOT_PASSWORD];
                if (!publicViews.includes(currentView)) {
                    setCurrentView(ViewState.LOGIN);
                }
            } else if (currentView === ViewState.LOGIN) {
                // If logged in and on login page, redirect to Orbit
                setCurrentView(ViewState.ORBIT);
            }
        }
    }, [user, loading, currentView]);

    // Global Listener for Deadline Alerts
    useEffect(() => {
        const handleAlert = (data: any) => {
            setToast({ title: data.title, message: data.message });
            setTimeout(() => setToast(null), 5000);
        };

        on('alerta-prazo', handleAlert);
        return () => off('alerta-prazo', handleAlert);
    }, [on, off]);

    const navigate = (view: ViewState, params?: any) => {
        // Intercept Logic: If trying to access app (Orbit/Dashboard) without config, force Onboarding
        // We check authUserProfile or local userProfile
        const isConfigured = authUserProfile ? true : userProfile.isConfigured;

        if (
            (view === ViewState.ORBIT || view === ViewState.DASHBOARD) &&
            !isConfigured &&
            user // Only force onboarding if user is logged in
        ) {
            setCurrentView(ViewState.ONBOARDING);
            return;
        }

        if (params?.projectId) {
            setTargetProjectId(params.projectId);
        } else {
            if (view !== ViewState.MODULE_BUDGET && view !== ViewState.MODULE_PROJECTS) {
                setTargetProjectId(null);
            }
        }

        if (params?.create) {
            setInitialCreate(true);
        } else {
            setInitialCreate(false);
        }

        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const handlePlanSelection = (planName: string) => {
        const confirm = window.confirm(`Você selecionou o plano ${planName}.\n\nDeseja confirmar a assinatura e desbloquear os recursos?`);

        if (confirm) {
            alert(`Parabéns! Você agora é um assinante ${planName}.\nBem-vindo à elite da produção cultural.`);
            if (!userProfile.isConfigured && !authUserProfile) {
                navigate(ViewState.ONBOARDING);
            } else {
                navigate(ViewState.ORBIT);
            }
        }
    };

    const handleOnboardingComplete = (data: { roles: string[], segments: string[] }) => {
        // 1. Atualiza o estado global (Simulando persistência local pós-API)
        setUserProfile(prev => ({
            ...prev,
            roles: data.roles,
            segments: data.segments,
            isConfigured: true,
            email: user?.email // Ensure email is captured
        }));

        // 2. Lógica de Roteamento Baseada no Usuário
        // Se for o Master, vai direto para o Admin Dashboard conforme solicitado.
        if (user?.email === 'produtorahc@gmail.com' || MOCK_USER_EMAIL === 'produtorahc@gmail.com') {
            navigate(ViewState.ADMIN_DASHBOARD);
        } else {
            // Usuários normais vão para a Órbita
            navigate(ViewState.ORBIT);
        }
    };

    const isAdminView = (view: ViewState) => {
        return view.startsWith('ADMIN_') && view !== ViewState.ADMIN_EDICTS;
    };

    const renderView = () => {
        // Auth Guard for Content Rendering (double check)
        if (!user && !loading && ![ViewState.LANDING, ViewState.LOGIN, ViewState.FORGOT_PASSWORD].includes(currentView)) {
            return <Login />; // No onSuccess needed, useEffect handles redirect
        }

        if (isAdminView(currentView)) {
            return <AdminPanel currentView={currentView} onNavigate={navigate} userEmail={authUserProfile?.email || user?.email} />;
        }

        switch (currentView) {
            case ViewState.LANDING:
                return <LandingPage onNavigate={navigate} />;
            case ViewState.LOGIN:
                return <Login />; // No onSuccess needed, useEffect handles redirect
            case ViewState.FORGOT_PASSWORD:
                return <ForgotPassword onNavigate={navigate} />;
            case ViewState.ONBOARDING:
                return <Onboarding onComplete={handleOnboardingComplete} />;
            case ViewState.ORBIT:
                // Pass user profile formatted for display
                return <OrbitPage
                    onNavigate={navigate}
                    userSegment={authUserProfile?.display_name || userProfile?.display_name || 'Usuário'}
                    userRole={authUserProfile?.role || userProfile?.role || 'free_user'}
                    userEmail={authUserProfile?.email || userProfile?.email}
                />;
            case ViewState.DASHBOARD:
                return <Dashboard onNavigate={navigate} />;
            case ViewState.MODULE_EDITAL:
                return <EditalAnalyzer onBack={() => navigate(ViewState.ORBIT)} onNavigate={navigate} />;
            case ViewState.MODULE_BUDGET:
                return (
                    <BudgetManager
                        onBack={() => navigate(ViewState.ORBIT)}
                        onNavigate={navigate}
                        activeProjectId={targetProjectId}
                    />
                );
            case ViewState.MODULE_CAREER:
                return <CareerMode onBack={() => navigate(ViewState.ORBIT)} onNavigate={navigate} />;
            case ViewState.MODULE_TEAM:
                return <TeamManager onBack={() => navigate(ViewState.ORBIT)} onNavigate={navigate} />;
            case ViewState.ADMIN_EDICTS:
                return <AdminEdictsManager onBack={() => navigate(ViewState.ORBIT)} onNavigate={navigate} />;
            case ViewState.MODULE_PORTFOLIO:
                return <PortfolioGenerator onBack={() => navigate(ViewState.ORBIT)} onNavigate={navigate} />;
            case ViewState.MODULE_PROJECTS:
                return (
                    <ProjectManager
                        onBack={() => navigate(ViewState.ORBIT)}
                        onNavigate={navigate}
                        initialProjectId={targetProjectId}
                        initialCreate={initialCreate}
                    />
                );
            case ViewState.MODULE_PROFILE:
                return <ProfileView
                    onBack={() => navigate(ViewState.DASHBOARD)}
                    onLogout={() => navigate(ViewState.LANDING)}
                    userProfile={{
                        roles: userProfile.roles,
                        segments: userProfile.segments,
                        isConfigured: true
                    }}
                />;
            case ViewState.SUPPORT:
                return <SupportCenter onBack={() => navigate(ViewState.DASHBOARD)} onNavigate={navigate} />;
            case ViewState.PLANS:
                return <PlansPage onBack={() => navigate(ViewState.ORBIT)} onSelectPlan={handlePlanSelection} />;
            case ViewState.ALL_TOOLS:
                return <AllToolsPage onBack={() => navigate(ViewState.DASHBOARD)} onNavigate={navigate} />;
            default:
                return <OrbitPage
                    onNavigate={navigate}
                    userSegment={authUserProfile?.display_name || userProfile?.display_name || 'Usuário'}
                    userRole={authUserProfile?.role || userProfile?.role || 'free_user'}
                    userEmail={authUserProfile?.email || userProfile?.email}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans antialiased selection:bg-primary selection:text-white relative">
            {renderView()}

            {toast && (
                <div className="fixed top-4 right-4 z-[100] bg-[#1c1c1e] border-l-4 border-red-500 text-white p-4 rounded shadow-2xl animate-fade-in max-w-sm">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-500 animate-pulse">warning</span>
                        <div>
                            <h4 className="font-bold text-sm">{toast.title}</h4>
                            <p className="text-xs text-white/80 mt-1">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="text-white/30 hover:text-white ml-2">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <RealTimeProvider>
                <AppContent />
            </RealTimeProvider>
        </AuthProvider>
    );
};

export default App;
