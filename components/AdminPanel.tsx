
import React, { useState } from 'react';
import { ViewState } from '../types';
import AdminSidebar from './AdminSidebar';
import AdminNotifications from './AdminNotifications';

interface Props {
    currentView: ViewState;
    onNavigate: (view: ViewState, params?: any) => void;
    userEmail?: string;
}

// Placeholder Component for Dashboard Cards
const StatCard: React.FC<{ title: string, value: string, icon: string, trend?: string }> = ({ title, value, icon, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            {trend && <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1"><span className="material-symbols-outlined text-xs">trending_up</span> {trend}</p>}
        </div>
        <div className="p-3 bg-blue-50 text-[#1A365D] rounded-lg">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    </div>
);

const AdminPanel: React.FC<Props> = ({ currentView, onNavigate, userEmail }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Determines the title based on the view
    const getPageTitle = (view: ViewState) => {
        const parts = view.replace('ADMIN_', '').split('_');
        return parts.map(p => p.charAt(0) + p.slice(1).toLowerCase()).join(' ');
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] font-sans flex">
            {/* Sidebar Component */}
            <AdminSidebar
                currentView={currentView}
                onNavigate={onNavigate}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 lg:ml-20 xl:ml-72`}>

                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between lg:hidden sticky top-0 z-30">
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-[#1A365D]">Usina Admin</span>
                    <div className="w-8"></div> {/* Spacer */}
                </header>

                {/* Desktop Header / Breadcrumbs */}
                <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 px-8 items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{getPageTitle(currentView)}</h1>
                            <p className="text-xs text-gray-400">Usina Cultural • Administração</p>
                        </div>
                        {/* Back to User Mode Button */}
                        <button
                            onClick={() => onNavigate(ViewState.ORBIT)}
                            className="ml-4 px-4 py-2 bg-gradient-to-r from-primary-purple to-primary-purple-dark hover:from-primary-purple-dark hover:to-primary-purple text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                            title="Voltar para o Modo Usuário"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Modo Usuário
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-700">Admin Master</p>
                                <p className="text-xs text-gray-400">{userEmail || 'admin@usina.com'}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">

                    {/* Default Dashboard View */}
                    {currentView === ViewState.ADMIN_DASHBOARD && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Usuários Ativos" value="1,240" icon="group" trend="+12% essa semana" />
                                <StatCard title="Novos Projetos" value="85" icon="folder_open" trend="+5 hoje" />
                                <StatCard title="Receita Mensal" value="R$ 42.500" icon="payments" trend="+8% vs mês anterior" />
                                <StatCard title="Tickets Abertos" value="12" icon="confirmation_number" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                                    <h3 className="font-bold text-gray-800 mb-4">Atividade Recente</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-800 font-medium">Novo usuário cadastrado: <strong>João Silva</strong></p>
                                                    <p className="text-xs text-gray-400">Há 20 minutos</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                                    <h3 className="font-bold text-gray-800 mb-4">Status do Sistema</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                            <span className="text-sm font-bold text-green-700 flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> API Gemini</span>
                                            <span className="text-xs font-bold text-green-600">Online</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                            <span className="text-sm font-bold text-green-700 flex items-center gap-2"><span className="material-symbols-outlined text-sm">database</span> Banco de Dados</span>
                                            <span className="text-xs font-bold text-green-600">Online</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <span className="text-sm font-bold text-yellow-700 flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span> SMTP Server</span>
                                            <span className="text-xs font-bold text-yellow-600">Latência Alta</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Manager */}
                    {currentView === ViewState.ADMIN_NOTIFICATIONS && (
                        <AdminNotifications />
                    )}

                    {/* Placeholder for other views */}
                    {currentView !== ViewState.ADMIN_DASHBOARD && currentView !== ViewState.ADMIN_NOTIFICATIONS && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-gray-400">construction</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Módulo em Desenvolvimento</h2>
                            <p className="text-gray-500 max-w-md">
                                A interface para <strong>{getPageTitle(currentView)}</strong> está sendo construída.
                                Utilize o menu lateral para navegar para o Dashboard.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
