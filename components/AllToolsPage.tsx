
import React from 'react';
import { ViewState } from '../types';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

const AllToolsPage: React.FC<Props> = ({ onBack, onNavigate }) => {
    
    const tools = [
        {
            title: "Gestor de Projetos",
            description: "Crie, estruture e gerencie seus projetos culturais com Canvas e templates para leis de incentivo.",
            icon: "account_tree",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            view: ViewState.MODULE_PROJECTS
        },
        {
            title: "Analisador de Editais",
            description: "Inteligência Artificial que lê PDFs de editais e extrai prazos, requisitos e critérios de avaliação.",
            icon: "troubleshoot",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            view: ViewState.MODULE_EDITAL
        },
        {
            title: "Gestor Financeiro",
            description: "Controle orçamentário completo. Crie planilhas, gerencie rubricas e acompanhe o fluxo de caixa.",
            icon: "payments",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            view: ViewState.MODULE_BUDGET
        },
        {
            title: "Gerador de Portfólio",
            description: "Ferramenta visual para criar portfólios artísticos profissionais com exportação em link ou PDF.",
            icon: "perm_media",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            view: ViewState.MODULE_PORTFOLIO
        },
        {
            title: "Modo Carreira & Equipe",
            description: "Gamificação da sua trajetória e sala de missão colaborativa para gestão de tarefas de equipe.",
            icon: "sports_esports",
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20",
            view: ViewState.MODULE_CAREER
        },
        {
            title: "Acervo Digital",
            description: "Centralize documentos, pesquisas e referências dos seus projetos em um só lugar.",
            icon: "folder_open",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            view: ViewState.MODULE_PROJECTS // Redireciona para projetos por enquanto
        },
        {
            title: "Central de Suporte",
            description: "Base de conhecimento, tickets de suporte e agendamento de mentorias com especialistas.",
            icon: "support_agent",
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            view: ViewState.SUPPORT
        },
        {
            title: "Meu Perfil",
            description: "Gerencie sua assinatura, dados pessoais e configurações de conta.",
            icon: "person",
            color: "text-slate-300",
            bg: "bg-slate-500/10",
            border: "border-slate-500/20",
            view: ViewState.MODULE_PROFILE
        }
    ];

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
            <header className="bg-[#1c1c1e] border-b border-white/10 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">grid_view</span>
                            Todas as Ferramentas
                        </h1>
                        <p className="text-xs text-white/50">Suíte completa de produção cultural</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <button 
                            key={index}
                            onClick={() => onNavigate(tool.view)}
                            className={`flex flex-col text-left p-6 rounded-2xl border ${tool.border} ${tool.bg} hover:bg-white/5 transition-all group active:scale-95`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color} bg-black/20 mb-4 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-3xl">{tool.icon}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                            <p className="text-sm text-white/60 leading-relaxed">{tool.description}</p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                                Acessar <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AllToolsPage;
