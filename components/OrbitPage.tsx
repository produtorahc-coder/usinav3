
import React, { useState } from 'react';
import { ViewState } from '../types';
import { useAuth } from '../hooks/useAuth';

interface OrbitPageProps {
    onNavigate: (view: ViewState, params?: any) => void;
    userSegment?: string; // Novo: Recebe o segmento do contexto
    userRole?: string;    // Novo: Recebe o cargo do contexto
    userEmail?: string;   // Novo: Email para validação Master
}

// Mock Data for Global Search Simulation
const MOCK_INDEX = [
    // Projetos e Conteúdo
    { type: 'PROJECT', id: 'master-1', title: 'Festival Urbrasil 2024', category: 'Master', view: ViewState.MODULE_PROJECTS },
    { type: 'PROJECT', id: 'sub-1', title: 'Oficinas de Graffiti', category: 'Subprojeto', view: ViewState.MODULE_PROJECTS },
    { type: 'PROJECT', id: 'sub-2', title: 'Shows Principais', category: 'Subprojeto', view: ViewState.MODULE_PROJECTS },
    { type: 'EDITAL', id: 'edit-1', title: 'Edital Natura Musical 2024', category: 'Edital', view: ViewState.MODULE_EDITAL },
    { type: 'EDITAL', id: 'edit-2', title: 'Lei Paulo Gustavo - Audiovisual', category: 'Edital', view: ViewState.MODULE_EDITAL },
    { type: 'FILE', id: 'file-1', title: 'Livro: Cores da Dança', category: 'Acervo', view: ViewState.MODULE_PROJECTS },
    { type: 'PORTFOLIO', id: 'port-1', title: 'Portfólio Artístico 2024', category: 'Portfólio', view: ViewState.MODULE_PORTFOLIO },

    // Navegação e Ferramentas (Menus)
    { type: 'MENU', id: 'nav-dash', title: 'Dashboard Geral', category: 'Navegação', view: ViewState.DASHBOARD },
    { type: 'MENU', id: 'nav-team', title: 'Gestão de Equipe', category: 'Ferramenta', view: ViewState.MODULE_TEAM },
    { type: 'MENU', id: 'nav-budget', title: 'Gestor Financeiro (Planilhas)', category: 'Ferramenta', view: ViewState.MODULE_BUDGET },
    { type: 'MENU', id: 'nav-edital', title: 'Analisador de Editais IA', category: 'Ferramenta', view: ViewState.MODULE_EDITAL },
    { type: 'MENU', id: 'nav-career', title: 'Modo Carreira (Gamificação)', category: 'Educação', view: ViewState.MODULE_CAREER },
    { type: 'MENU', id: 'nav-profile', title: 'Meu Perfil & Assinatura', category: 'Configuração', view: ViewState.MODULE_PROFILE },

    // Suporte e Ajuda (SAC)
    { type: 'SAC', id: 'sac-1', title: 'Como fazer um orçamento?', category: 'Base de Conhecimento', view: ViewState.SUPPORT },
    { type: 'SAC', id: 'sac-2', title: 'Erro ao subir PDF', category: 'Suporte Técnico', view: ViewState.SUPPORT },
    { type: 'SAC', id: 'sac-3', title: 'Agendar Mentoria', category: 'Serviços', view: ViewState.SUPPORT },

    // Acervo Inteligente (Editais Digitalizados via OCR)
    { type: 'DIGITAL_EDICT', id: 'ed-001', title: 'Edital de Fomento ao Teatro 2024', category: 'Acervo Digital', view: ViewState.MODULE_EDITAL, keywords: 'teatro fomento produção' },
    { type: 'DIGITAL_EDICT', id: 'ed-003', title: 'Regulamento ProAC ICMS', category: 'Acervo Digital', view: ViewState.MODULE_EDITAL, keywords: 'imposto renuncia fiscal icms' },
];


const OrbitPage: React.FC<OrbitPageProps> = ({ onNavigate, userSegment, userRole, userEmail }) => {
    const { signOut } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    // Estados para funcionalidades de cabeçalho
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMasterMenu, setShowMasterMenu] = useState(false);

    // Estado para o Broadcast
    const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.length > 1) {
            const filtered = MOCK_INDEX.filter(item => {
                const inTitle = item.title.toLowerCase().includes(query);
                const inCategory = item.category.toLowerCase().includes(query);
                const inKeywords = item.keywords ? item.keywords.toLowerCase().includes(query) : false;

                return inTitle || inCategory || inKeywords;
            });
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (item: any) => {
        if (item.type === 'DIGITAL_EDICT') {
            alert(`Abrindo Edital Digitalizado: ${item.title}\n\nA IA já extraiu o conteúdo para você.`);
            onNavigate(item.view);
        } else if (item.type === 'PROJECT') {
            onNavigate(item.view, { projectId: item.id });
        } else {
            onNavigate(item.view);
        }
    };

    const handleMasterClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (userEmail === 'produtorahc@gmail.com') {
            setShowMasterMenu(!showMasterMenu);
        } else {
            alert("Acesso Negado. Esta área é restrita para contas Master.");
        }
    };

    const handleBroadcast = () => {
        const message = window.prompt("📢 PAINEL MASTER (F-Laure)\n\nDigite uma mensagem para disparar para toda a equipe e usuários da plataforma:");
        if (message && message.trim().length > 0) {
            setBroadcastMessage(message);
            alert("Mensagem enviada com sucesso para todos os terminais ativos!");
        }
        setShowMasterMenu(false);
    };

    const handleArchiveManagement = () => {
        onNavigate(ViewState.ADMIN_EDICTS);
        setShowMasterMenu(false);
    };

    const handleAdminPanel = () => {
        onNavigate(ViewState.ADMIN_DASHBOARD);
        setShowMasterMenu(false);
    };

    const handleLogout = async () => {
        const confirm = window.confirm("Deseja realmente sair do sistema?");
        if (confirm) {
            await signOut();
            onNavigate(ViewState.LANDING);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col relative overflow-hidden" onClick={() => { if (showProfileMenu) setShowProfileMenu(false); if (showMasterMenu) setShowMasterMenu(false); }}>

            {/* Space Background Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1A365D]/30 via-[#050505] to-[#050505]"></div>
                <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
                <div className="absolute w-[3px] h-[3px] bg-white rounded-full top-1/3 right-1/4 animate-pulse delay-700"></div>
                <div className="absolute w-[1px] h-[1px] bg-white rounded-full bottom-1/4 left-1/2 animate-pulse delay-300"></div>
                <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-10 right-10 opacity-50"></div>
                <div className="absolute w-[1px] h-[1px] bg-white rounded-full bottom-10 left-10 opacity-50"></div>
            </div>

            {/* Top Bar (Minimal) */}
            <header className="relative z-20 flex justify-end p-6">
                <div className="flex items-center gap-6">
                    {/* Botão Dashboard (Novo) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onNavigate(ViewState.DASHBOARD); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/10"
                        title="Ir para Dashboard"
                    >
                        <span className="material-symbols-outlined text-sm">dashboard</span>
                        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Dashboard</span>
                    </button>

                    {/* Botão de Ajuda (?) - Redirecionamento para SAC */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onNavigate(ViewState.SUPPORT); }}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        title="SAC Inteligente: Dúvidas e Suporte"
                    >
                        <span className="material-symbols-outlined font-bold">question_mark</span>
                    </button>

                    {/* Ícone da Coroa (👑) - Lógica de Estado Master & Menu */}
                    <div className="relative">
                        <button
                            onClick={handleMasterClick}
                            className={`transition-all duration-300 transform hover:scale-110 flex items-center justify-center w-10 h-10 ${userEmail === 'produtorahc@gmail.com'
                                ? 'opacity-100 cursor-pointer drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]'
                                : 'opacity-20 cursor-default grayscale'
                                }`}
                            title={userEmail === 'produtorahc@gmail.com' ? "Painel Master" : "Acesso Restrito"}
                        >
                            <span className="text-xl">👑</span>
                        </button>

                        {/* Submenu Master */}
                        {showMasterMenu && (
                            <div className="absolute top-12 right-0 w-56 bg-[#1c1c1e] border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.2)] py-2 animate-fade-in z-50">
                                <div className="px-4 py-2 border-b border-white/5 mb-1">
                                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Painel Master</p>
                                </div>
                                <button
                                    onClick={handleBroadcast}
                                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-red-500">campaign</span>
                                    Broadcast (Púlpito)
                                </button>
                                <button
                                    onClick={handleArchiveManagement}
                                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-blue-400">inventory_2</span>
                                    Gestão de Acervo (OCR)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Botão de Perfil (Avatar) - Menu Dropdown */}
                    <div className="relative flex items-center gap-3">
                        {/* NOVO: Exibição da Etiqueta de Segmento */}
                        {userSegment && (
                            <div className="text-right hidden md:block animate-fade-in">
                                <p className="text-sm font-bold text-white leading-tight">{userSegment}</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-wide">{userRole || 'Produtor'}</p>
                            </div>
                        )}

                        <div
                            className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20 cursor-pointer hover:border-primary transition-all shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk1t8ypYL8CxWIldjxcSuzk9OyjIsta-GLZgO_XgBT-wzRlsO0JonpAk2JeMjOmCj3FHO1l886fE7dK3Lp6IM4bIrxqxsnJaq55fIAnlDx9A5c-dkCHsMXQOkGCxEBa7SPaHjtyXBK8dfSjMAn7l-_2Uv6y326ms8iC7o7PzKN1rknp3ohgE5v7hn94igcy4mp8viJlQPElp1VVpz1IR2qFDlnuCEFfRl_fVf9_ViK7wfgd06QyIdvdcMaQIwFjDrVqG1kIhcb1zk")' }}
                        ></div>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute top-14 right-0 w-48 bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl py-2 animate-fade-in z-50">
                                <div className="px-4 py-2 mb-1 border-b border-white/5 md:hidden">
                                    <p className="text-sm font-bold text-white">{userSegment || 'Visitante'}</p>
                                    <p className="text-[10px] text-white/50 uppercase">{userRole || 'Perfil'}</p>
                                </div>
                                <button
                                    onClick={() => onNavigate(ViewState.MODULE_PROFILE)}
                                    className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Meu Perfil
                                </button>
                                <button
                                    onClick={() => onNavigate(ViewState.DASHBOARD)}
                                    className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">dashboard</span>
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)}
                                    className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">perm_media</span>
                                    Meus Portfólios
                                </button>
                                <div className="h-px bg-white/10 my-1 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Central Orbit Interface */}
            <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 -mt-20">

                {/* 📢 O PÚLPITO DO CEO (Broadcast Alert) - Aparece só se houver mensagem */}
                {broadcastMessage && (
                    <div className="w-full max-w-4xl mx-auto mb-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-4 shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse flex items-center gap-4 border border-white/20 relative z-50">
                        <div className="bg-white/20 p-2 rounded-full">
                            <span className="material-symbols-outlined text-3xl text-white">campaign</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-1 flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                                Comunicado Oficial F-Laure
                            </h3>
                            <p className="text-white font-display font-bold text-lg md:text-xl leading-tight text-shadow-sm">
                                {broadcastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setBroadcastMessage(null)}
                            className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors"
                            title="Fechar Comunicado"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}

                {/* Logo Area - Navegação Root */}
                <div
                    className="mb-12 text-center cursor-pointer group"
                    onClick={() => onNavigate(ViewState.ORBIT)}
                    title="Recarregar Órbita"
                >
                    <div className="w-20 h-20 bg-primary/20 backdrop-blur-lg rounded-3xl mx-auto flex items-center justify-center border border-primary/50 shadow-[0_0_50px_rgba(242,127,13,0.2)] mb-4 group-hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-5xl text-primary">bolt</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 group-hover:to-white transition-all">
                        Usina Cultural
                    </h1>
                    <p className="text-white/30 text-sm mt-2 font-mono">Sistema Operacional de Produção v3.0</p>
                </div>

                {/* Universal Search */}
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Busque por Projetos, Menus, Ajuda ou Conteúdo de Editais..."
                            className="w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 pl-14 text-lg text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all shadow-2xl"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 text-white/50">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                    </div>

                    {/* Live Results Dropdown */}
                    {results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in max-h-80 overflow-y-auto z-50">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleResultClick(result)}
                                    className="p-4 border-b border-white/5 hover:bg-white/10 cursor-pointer flex items-center gap-4 transition-colors group/item"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${result.type === 'PROJECT' ? 'bg-yellow-500/20 text-yellow-500' :
                                        result.type === 'EDITAL' ? 'bg-blue-500/20 text-blue-500' :
                                            result.type === 'FILE' ? 'bg-purple-500/20 text-purple-500' :
                                                result.type === 'MENU' ? (result.id === 'nav-career' ? 'sports_esports' : 'widgets') :
                                                    result.type === 'SAC' ? 'support_agent' :
                                                        result.type === 'DIGITAL_EDICT' ? 'bg-indigo-500/20 text-indigo-400' :
                                                            'perm_media'}
                                    `}>
                                        <span className="material-symbols-outlined">
                                            {result.type === 'PROJECT' ? 'account_tree' :
                                                result.type === 'EDITAL' ? 'plagiarism' :
                                                    result.type === 'FILE' ? 'book' :
                                                        result.type === 'MENU' ? (result.id === 'nav-career' ? 'sports_esports' : 'widgets') :
                                                            result.type === 'SAC' ? 'support_agent' :
                                                                result.type === 'DIGITAL_EDICT' ? 'find_in_page' :
                                                                    'perm_media'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white group-hover/item:text-primary transition-colors">{result.title}</h4>
                                            {result.type === 'DIGITAL_EDICT' && (
                                                <span className="text-[9px] bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase font-bold tracking-wider">
                                                    OCR
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">{result.category}</span>
                                            {result.type === 'PROJECT' && <span className="text-[10px] text-white/30">ID: {result.id}</span>}
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-white/30 -rotate-45 group-hover/item:rotate-0 transition-transform">arrow_forward</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Orbital Shortcuts - 6 Icons Grid */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto w-full px-4">
                    {/* 1. Novo Projeto */}
                    <OrbitIcon
                        icon="add_circle"
                        label="Novo Projeto"
                        onClick={() => onNavigate(ViewState.MODULE_PROJECTS, { create: true })}
                        delay="0"
                    />

                    {/* 2. Portfólio (Gerador) */}
                    <OrbitIcon
                        icon="perm_media"
                        label="Portfólio"
                        onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)}
                        delay="100"
                    />

                    {/* 3. Planilhas (Financeiro) */}
                    <OrbitIcon
                        icon="table_chart"
                        label="Planilhas"
                        onClick={() => onNavigate(ViewState.MODULE_BUDGET)}
                        delay="200"
                    />

                    {/* 4. Editais (Auditor) */}
                    <OrbitIcon
                        icon="plagiarism"
                        label="Editais"
                        onClick={() => onNavigate(ViewState.MODULE_EDITAL)}
                        delay="300"
                    />

                    {/* 5. Acervo (Memória) */}
                    <OrbitIcon
                        icon="folder_open"
                        label="Acervo"
                        onClick={() => onNavigate(ViewState.MODULE_PROJECTS)}
                        delay="400"
                    />

                    {/* 6. Equipe (Colaboração) - AGORA APONTA PARA MODULE_TEAM */}
                    <OrbitIcon
                        icon="groups"
                        label="Equipe"
                        onClick={() => onNavigate(ViewState.MODULE_TEAM)}
                        delay="500"
                    />
                </div>
            </main>

            <div className="absolute bottom-6 w-full text-center">
                <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">F-Laure Produções • Master Access Granted</p>
            </div>
        </div>
    );
};

const OrbitIcon: React.FC<{ icon: string, label: string, onClick: () => void, delay: string }> = ({ icon, label, onClick, delay }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-3 group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-16 h-16 rounded-full bg-[#1c1c1e] border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="material-symbols-outlined text-2xl text-white/70 group-hover:text-white transition-colors">{icon}</span>
        </div>
        <span className="text-xs font-bold text-white/50 group-hover:text-white uppercase tracking-wider transition-colors">{label}</span>
    </button>
);

export default OrbitPage;
