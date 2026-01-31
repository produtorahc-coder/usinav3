
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';

interface Props {
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

interface MenuItem {
    label: string;
    view: ViewState;
    icon: string;
    badge?: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const MENU_STRUCTURE: MenuSection[] = [
    {
        title: 'Dashboard & Analytics',
        items: [
            { label: 'Visão Geral', view: ViewState.ADMIN_DASHBOARD, icon: 'dashboard' },
            { label: 'Analytics', view: ViewState.ADMIN_ANALYTICS, icon: 'analytics' },
            { label: 'Financeiro', view: ViewState.ADMIN_FINANCE, icon: 'attach_money', badge: 'R$ 12k' },
        ]
    },
    {
        title: 'Gestão de Conteúdo',
        items: [
            { label: 'Modelos', view: ViewState.ADMIN_TEMPLATES, icon: 'file_copy' },
            { label: 'Editais Destaque', view: ViewState.ADMIN_FEATURED_CALLS, icon: 'campaign' },
            { label: 'Biblioteca', view: ViewState.ADMIN_LIBRARY, icon: 'library_books' },
            { label: 'Banco de Questões', view: ViewState.ADMIN_QUIZ, icon: 'quiz' },
            { label: 'Moderação', view: ViewState.ADMIN_MODERATION, icon: 'gavel', badge: '3' },
        ]
    },
    {
        title: 'Usuários & Planos',
        items: [
            { label: 'Todos os Usuários', view: ViewState.ADMIN_USERS, icon: 'group' },
            { label: 'Assinaturas', view: ViewState.ADMIN_SUBSCRIPTIONS, icon: 'loyalty' },
            { label: 'Fundadores', view: ViewState.ADMIN_FOUNDERS, icon: 'military_tech' },
            { label: 'Cupons', view: ViewState.ADMIN_COUPONS, icon: 'local_offer' },
        ]
    },
    {
        title: 'Sistema & Logs',
        items: [
            { label: 'Configurações IA', view: ViewState.ADMIN_AI_SETTINGS, icon: 'psychology' },
            { label: 'Logs', view: ViewState.ADMIN_LOGS, icon: 'terminal' },
            { label: 'Integrações', view: ViewState.ADMIN_CLOUD, icon: 'cloud_sync' },
            { label: 'Backup', view: ViewState.ADMIN_BACKUP, icon: 'backup' },
            { label: 'E-mail (SMTP)', view: ViewState.ADMIN_EMAIL, icon: 'mail' },
        ]
    },
    {
        title: 'Configurações',
        items: [
            { label: 'Geral', view: ViewState.ADMIN_SETTINGS_GENERAL, icon: 'settings' },
            { label: 'Planos e Preços', view: ViewState.ADMIN_PLANS_CONFIG, icon: 'price_change' },
            { label: 'Termos e Legal', view: ViewState.ADMIN_LEGAL, icon: 'policy' },
            { label: 'SAC Settings', view: ViewState.ADMIN_SUPPORT_SETTINGS, icon: 'support_agent' },
            { label: 'SEO', view: ViewState.ADMIN_SEO, icon: 'public' },
            { label: 'Notificações', view: ViewState.ADMIN_NOTIFICATIONS, icon: 'notifications_active' },
        ]
    },
    {
        title: 'Ferramentas',
        items: [
            { label: 'Broadcast', view: ViewState.ADMIN_BROADCAST, icon: 'podcasts' },
            { label: 'Upload em Massa', view: ViewState.ADMIN_BULK_UPLOAD, icon: 'upload_file' },
            { label: 'Manutenção', view: ViewState.ADMIN_MAINTENANCE, icon: 'build' },
        ]
    }
];

const AdminSidebar: React.FC<Props> = ({ currentView, onNavigate, mobileOpen, onMobileClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Check
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 1024);
            if (width < 1280 && width >= 1024) {
                setIsCollapsed(true);
            } else if (width >= 1280) {
                setIsCollapsed(false);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavigation = (view: ViewState) => {
        onNavigate(view);
        if (isMobile) onMobileClose();
    };

    const sidebarClasses = `
        fixed top-0 left-0 h-full bg-[#1A365D] text-white z-50 transition-all duration-300 ease-in-out border-r border-white/10 shadow-2xl
        ${isMobile ? (mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72') : (isCollapsed ? 'w-20' : 'w-72')}
    `;

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobile && mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onMobileClose}
                />
            )}

            <aside className={sidebarClasses}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-[#152C4E]">
                    <div className={`flex items-center gap-3 overflow-hidden transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <div className="w-8 h-8 bg-[#DD6B20] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight whitespace-nowrap">Admin Panel</span>
                    </div>

                    {isCollapsed && (
                        <div className="w-full flex justify-center">
                            <div className="w-8 h-8 bg-[#DD6B20] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
                            </div>
                        </div>
                    )}

                    {!isMobile && !isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-white/50 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">first_page</span>
                        </button>
                    )}
                    {!isMobile && isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="absolute -right-3 top-6 bg-[#DD6B20] rounded-full p-1 shadow-lg text-white"
                        >
                            <span className="material-symbols-outlined text-xs">last_page</span>
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto h-[calc(100%-8rem)] custom-scrollbar py-4">
                    {MENU_STRUCTURE.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            {!isCollapsed && (
                                <h3 className="px-6 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                                    {section.title}
                                </h3>
                            )}
                            {isCollapsed && (
                                <div className="h-px w-8 mx-auto bg-white/10 mb-2"></div>
                            )}

                            <ul>
                                {section.items.map((item) => {
                                    const isActive = currentView === item.view;
                                    return (
                                        <li key={item.view}>
                                            <button
                                                onClick={() => handleNavigation(item.view)}
                                                className={`
                                                    w-full flex items-center gap-3 px-6 py-3 transition-all relative group
                                                    ${isActive
                                                        ? 'bg-[#DD6B20] text-white border-l-4 border-white'
                                                        : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                                                    }
                                                `}
                                                title={isCollapsed ? item.label : ''}
                                            >
                                                <span className={`material-symbols-outlined ${isCollapsed ? 'text-2xl' : 'text-xl'}`}>
                                                    {item.icon}
                                                </span>

                                                <span className={`text-sm font-medium transition-all ${isCollapsed ? 'hidden' : 'block'}`}>
                                                    {item.label}
                                                </span>

                                                {/* Badge */}
                                                {item.badge && (
                                                    <span className={`
                                                        ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                                        ${isActive ? 'bg-white text-[#DD6B20]' : 'bg-[#DD6B20] text-white'}
                                                        ${isCollapsed ? 'absolute top-2 right-2' : ''}
                                                    `}>
                                                        {item.badge}
                                                    </span>
                                                )}

                                                {/* Tooltip for Collapsed */}
                                                {isCollapsed && (
                                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-[#1c1c1e] text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                                                        {item.label}
                                                    </div>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer (Profile/Logout) */}
                <div className="absolute bottom-0 w-full p-4 bg-[#152C4E] border-t border-white/10">
                    <button
                        onClick={() => handleNavigation(ViewState.LANDING)}
                        className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">logout</span>
                        </div>
                        {!isCollapsed && (
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-bold truncate">Sair do Admin</p>
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
