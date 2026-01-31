
import React, { useState } from 'react';
import { ViewState } from '../types';

interface DashboardProps {
    onNavigate: (view: ViewState, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [showAlertConfig, setShowAlertConfig] = useState(false);
    const [isAlertDismissed, setIsAlertDismissed] = useState(false); // Estado para controlar visibilidade do alerta
    const [alertSettings, setAlertSettings] = useState({
        deadlines: true,
        opportunities: false,
        projectStatus: true
    });

    const toggleAlert = (key: keyof typeof alertSettings) => {
        setAlertSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDismissAlert = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAlertDismissed(true);
    };

    return (
        <div className="min-h-screen bg-[#121212] pb-24 md:pb-0">
            {/* Desktop Sidebar Navigation */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#0a192f] border-r border-white/10 z-50">
                <div 
                    className="p-6 border-b border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => onNavigate(ViewState.ORBIT)}
                    title="Voltar para Órbita"
                >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">bolt</span>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-white">Usina Cultural</span>
                </div>
                
                <div className="flex-1 py-6 px-4 space-y-2">
                    <SidebarItem icon="home" label="Home" active onClick={() => onNavigate(ViewState.DASHBOARD)} />
                    <SidebarItem icon="description" label="Editais" onClick={() => onNavigate(ViewState.MODULE_EDITAL)} />
                    <SidebarItem icon="dashboard_customize" label="Meus Projetos" onClick={() => onNavigate(ViewState.MODULE_PROJECTS)} />
                    <SidebarItem icon="payments" label="Orçamento" onClick={() => onNavigate(ViewState.MODULE_BUDGET)} />
                    {/* Atualizado para MODULE_TEAM */}
                    <SidebarItem icon="groups" label="Gestão Equipe" onClick={() => onNavigate(ViewState.MODULE_TEAM)} />
                    <SidebarItem icon="perm_media" label="Portfólio" onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)} />
                    <div className="my-4 h-px bg-white/5"></div>
                    <SidebarItem icon="support_agent" label="Ajuda & SAC" onClick={() => onNavigate(ViewState.SUPPORT)} />
                     {/* Admin Link (Demo) */}
                     <SidebarItem icon="admin_panel_settings" label="Painel Admin" onClick={() => onNavigate(ViewState.ADMIN_DASHBOARD)} />
                </div>

                <div className="p-4 border-t border-white/10 space-y-2">
                     <button onClick={() => onNavigate(ViewState.PLANS)} className="flex items-center gap-3 text-primary hover:text-white transition-colors w-full px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20">
                        <span className="material-symbols-outlined">workspace_premium</span>
                        <span className="text-sm font-bold">Fazer Upgrade</span>
                    </button>
                    <button onClick={() => onNavigate(ViewState.LANDING)} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full px-4 py-2 rounded-lg hover:bg-white/5">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="md:pl-64 transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#0a192f]/90 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center p-4 justify-between max-w-7xl mx-auto">
                        {/* Mobile Logo Only */}
                        <div 
                            className="md:hidden flex items-center gap-3 cursor-pointer"
                            onClick={() => onNavigate(ViewState.ORBIT)}
                        >
                            <div 
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk1t8ypYL8CxWIldjxcSuzk9OyjIsta-GLZgO_XgBT-wzRlsO0JonpAk2JeMjOmCj3FHO1l886fE7dK3Lp6IM4bIrxqxsnJaq55fIAnlDx9A5c-dkCHsMXQOkGCxEBa7SPaHjtyXBK8dfSjMAn7l-_2Uv6y326ms8iC7o7PzKN1rknp3ohgE5v7hn94igcy4mp8viJlQPElp1VVpz1IR2qFDlnuCEFfRl_fVf9_ViK7wfgd06QyIdvdcMaQIwFjDrVqG1kIhcb1zk")' }}
                            />
                            <div className="flex flex-col">
                                <h1 className="text-white text-sm font-bold leading-tight">Usina Cultural</h1>
                                <span className="text-primary text-[10px] font-bold uppercase tracking-widest">Command Center</span>
                            </div>
                        </div>

                        {/* Desktop Breadcrumb/Title */}
                        <div className="hidden md:flex flex-col">
                            <h1 className="text-white text-lg font-bold">Visão Geral</h1>
                            <p className="text-white/50 text-xs">Bem-vindo de volta, Produtor.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 bg-[#1c1c1e] px-3 py-1.5 rounded-full border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs text-white/70">Sistema Online</span>
                            </div>
                            <button className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors relative">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-[#0a192f]"></span>
                            </button>
                             {/* Desktop Profile Avatar */}
                             <div 
                                onClick={() => onNavigate(ViewState.MODULE_PROFILE)}
                                title="Acessar Perfil"
                                className="hidden md:block bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk1t8ypYL8CxWIldjxcSuzk9OyjIsta-GLZgO_XgBT-wzRlsO0JonpAk2JeMjOmCj3FHO1l886fE7dK3Lp6IM4bIrxqxsnJaq55fIAnlDx9A5c-dkCHsMXQOkGCxEBa7SPaHjtyXBK8dfSjMAn7l-_2Uv6y326ms8iC7o7PzKN1rknp3ohgE5v7hn94igcy4mp8viJlQPElp1VVpz1IR2qFDlnuCEFfRl_fVf9_ViK7wfgd06QyIdvdcMaQIwFjDrVqG1kIhcb1zk")' }}
                            />
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6 md:gap-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            
                            {/* System Notification Banner (Lembrete de Prazo) */}
                            {/* Renderiza apenas se estiver habilitado nas configs E não tiver sido fechado */}
                            {(!isAlertDismissed || !alertSettings.deadlines) && (
                                <div className={`relative flex flex-col gap-3 rounded-xl border p-6 border-l-4 transition-all ${alertSettings.deadlines ? 'border-primary/30 bg-primary/10 border-l-primary' : 'border-white/10 bg-[#1c1c1e] border-l-white/30 hidden'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <span className={`material-symbols-outlined text-2xl ${alertSettings.deadlines ? 'text-primary' : 'text-white/50'}`}>
                                                {alertSettings.deadlines ? 'event_available' : 'notifications_paused'}
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <p className={`text-base font-bold leading-tight ${alertSettings.deadlines ? 'text-white' : 'text-white/70'}`}>
                                                    {alertSettings.deadlines ? 'Lembrete de Prazo' : 'Notificações de Prazo Pausadas'}
                                                </p>
                                                <p className="text-white/70 text-sm font-normal leading-relaxed max-w-lg">
                                                    {alertSettings.deadlines 
                                                        ? <>O <span className="text-primary font-semibold">Edital Lei Paulo Gustavo</span> encerra em 2 dias. Recomendamos revisar a documentação do projeto.</>
                                                        : "Ative o monitoramento para receber avisos sobre vencimento de editais."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Botões de Ação do Card */}
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => setShowAlertConfig(true)}
                                                className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                                                title="Configurar Alertas"
                                            >
                                                <span className="material-symbols-outlined text-xl">tune</span>
                                            </button>
                                            {alertSettings.deadlines && (
                                                <button 
                                                    onClick={handleDismissAlert}
                                                    className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                                                    title="Fechar Lembrete"
                                                >
                                                    <span className="material-symbols-outlined text-xl">close</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {alertSettings.deadlines && (
                                        <div className="mt-2 flex flex-col md:flex-row justify-between items-end gap-4">
                                            {/* Granular Control & Context Links */}
                                            <div className="text-[10px] text-white/40 space-y-1 w-full md:w-auto">
                                                <label className="flex items-center gap-2 cursor-pointer hover:text-white/70 transition-colors">
                                                    <input type="checkbox" className="rounded border-white/20 bg-transparent text-primary focus:ring-0 w-3 h-3" />
                                                    Não receber mais este tipo de notificação
                                                </label>
                                                <p>Para silenciar todos, acesse as <span className="underline cursor-pointer hover:text-primary" onClick={() => setShowAlertConfig(true)}>Configurações do Sistema</span>.</p>
                                                <div className="pt-1 border-t border-white/5 mt-1 flex flex-wrap gap-2">
                                                    <span>Gerenciar:</span>
                                                    <span className="text-primary cursor-pointer hover:underline">Inteligência Pessoal do Gemini</span>
                                                    <span className="text-white/20">|</span>
                                                    <span className="text-primary cursor-pointer hover:underline">Apps Conectados (Google Tasks)</span>
                                                </div>
                                            </div>

                                            <button onClick={() => onNavigate(ViewState.MODULE_EDITAL)} className="w-full md:w-auto px-6 h-10 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 shrink-0">
                                                Revisar Projeto
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* Modules Grid */}
                            <div className={`${isAlertDismissed ? 'animate-fade-in' : ''}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white text-lg font-bold tracking-tight">Módulos Principais</h3>
                                    <span 
                                        className="text-primary text-xs font-medium cursor-pointer hover:underline" 
                                        onClick={() => onNavigate(ViewState.ALL_TOOLS)}
                                    >
                                        Ver todas as ferramentas
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <ModuleButton 
                                        icon="add_circle" 
                                        label="Novo Projeto" 
                                        colorClass="text-black bg-primary" 
                                        onClick={() => onNavigate(ViewState.MODULE_PROJECTS, { create: true })} 
                                    />
                                    <ModuleButton 
                                        icon="troubleshoot" 
                                        label="Analisador" 
                                        colorClass="text-blue-500 bg-blue-500/20" 
                                        onClick={() => onNavigate(ViewState.MODULE_EDITAL)} 
                                    />
                                    <ModuleButton 
                                        icon="payments" 
                                        label="Orçamento" 
                                        colorClass="text-purple-500 bg-purple-500/20" 
                                        onClick={() => onNavigate(ViewState.MODULE_BUDGET)} 
                                    />
                                    <ModuleButton 
                                        icon="folder_special" 
                                        label="Portfólio" 
                                        colorClass="text-emerald-500 bg-emerald-500/20" 
                                        onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)} 
                                    />
                                </div>
                            </div>
                            
                            {/* Placeholder for Next Steps (Visible only when alert is dismissed) */}
                            {isAlertDismissed && (
                                <div className="animate-fade-in">
                                    <h3 className="text-white text-lg font-bold tracking-tight mb-4">Próximos Passos (Festival Urbrasil)</h3>
                                    <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                                        <StepItem label="Finalizar Planilha Orçamentária" status="pending" />
                                        <StepItem label="Anexar Cartas de Anuência" status="pending" />
                                        <StepItem label="Revisão Final de Texto" status="done" />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Side Stats Column */}
                        <div className="flex flex-col gap-6">
                            {/* Profile Stats */}
                            <div className="bg-[#1c1c1e] border border-white/5 rounded-xl p-6 shadow-xl h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                                        <div>
                                            <span className="text-white font-bold text-lg block">Produtor Sênior</span>
                                            <span className="text-white/40 text-xs">Nível 12</span>
                                        </div>
                                    </div>
                                    <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded font-bold uppercase cursor-pointer" onClick={() => onNavigate(ViewState.PLANS)}>Pro</span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <p className="text-white/60">Modo Carreira Progress</p>
                                        <p className="text-primary font-bold">850/1000 XP</p>
                                    </div>
                                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(242,127,13,0.5)]" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="text-xs text-white/40 italic">Complete mais 2 análises de edital para subir de nível.</p>
                                    
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <h4 className="text-xs font-bold uppercase text-white/50 mb-3">Atividades Recentes</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white" onClick={() => onNavigate(ViewState.MODULE_EDITAL)}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                Análise: Edital Natura
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white" onClick={() => onNavigate(ViewState.MODULE_BUDGET)}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                Orçamento: Turnê 2024
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-white/80 cursor-pointer hover:text-white" onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Portfólio: Cores da Dança
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Config Modal */}
            {showAlertConfig && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAlertConfig(false)} />
                    <div className="relative w-full max-w-sm bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">notifications_active</span>
                                Configurar Alertas
                            </h3>
                            <button onClick={() => setShowAlertConfig(false)} className="text-white/50 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6 mb-8">
                            <AlertToggle 
                                label="Monitoramento de Prazos" 
                                description="Receba lembretes automáticos sobre datas de encerramento."
                                active={alertSettings.deadlines} 
                                onToggle={() => toggleAlert('deadlines')} 
                            />
                            <AlertToggle 
                                label="Novas Oportunidades" 
                                description="Sugestões de editais baseadas no perfil do seu projeto."
                                active={alertSettings.opportunities} 
                                onToggle={() => toggleAlert('opportunities')} 
                            />
                             <AlertToggle 
                                label="Status do Projeto" 
                                description="Notificações sobre mudanças e análises de documentos."
                                active={alertSettings.projectStatus} 
                                onToggle={() => toggleAlert('projectStatus')} 
                            />
                        </div>

                        <button 
                            onClick={() => setShowAlertConfig(false)}
                            className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
                        >
                            Salvar Preferências
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a192f]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-6 z-50">
                <NavItem icon="home" label="Home" active onClick={() => onNavigate(ViewState.DASHBOARD)} />
                <NavItem icon="support_agent" label="Ajuda" onClick={() => onNavigate(ViewState.SUPPORT)} />
                <div className="relative -top-5">
                    <button 
                        onClick={() => onNavigate(ViewState.MODULE_PROJECTS, { create: true })}
                        className="size-14 bg-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-4 border-[#121212] active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined font-bold text-3xl">add</span>
                    </button>
                </div>
                <NavItem icon="dashboard_customize" label="Projetos" onClick={() => onNavigate(ViewState.MODULE_PROJECTS)} />
                <NavItem icon="person" label="Perfil" onClick={() => onNavigate(ViewState.MODULE_PROFILE)} />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{icon: string, label: string, active?: boolean, onClick?: () => void}> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-primary' : 'text-white/50'} active:text-primary transition-colors`}>
        <span className={`material-symbols-outlined ${active ? 'fill-current' : ''}`}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const SidebarItem: React.FC<{icon: string, label: string, active?: boolean, onClick?: () => void}> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
    >
        <span className={`material-symbols-outlined ${active ? 'fill-current' : ''}`}>{icon}</span>
        <span className="text-sm">{label}</span>
    </button>
);

const ModuleButton: React.FC<{icon: string, label: string, colorClass: string, onClick: () => void}> = ({ icon, label, colorClass, onClick }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-[#1c1c1e] border border-white/5 hover:border-primary/50 transition-all active:scale-95 group h-full"
    >
        <div className={`size-14 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <span className="text-white text-sm font-bold text-center">{label}</span>
    </button>
);

const AlertToggle: React.FC<{label: string, description: string, active: boolean, onToggle: () => void}> = ({ label, description, active, onToggle }) => (
    <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
            <p className="text-sm font-bold text-white mb-0.5">{label}</p>
            <p className="text-[11px] text-white/50 leading-tight">{description}</p>
        </div>
        <button 
            onClick={onToggle} 
            className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors relative focus:outline-none ${active ? 'bg-primary' : 'bg-white/10'}`}
        >
            <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </div>
);

const StepItem: React.FC<{label: string, status: 'pending' | 'done'}> = ({ label, status }) => (
    <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${status === 'done' ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
            {status === 'done' && <span className="material-symbols-outlined text-black text-xs font-bold">check</span>}
        </div>
        <span className={`text-sm ${status === 'done' ? 'text-white/50 line-through' : 'text-white'}`}>{label}</span>
    </div>
);

export default Dashboard;
