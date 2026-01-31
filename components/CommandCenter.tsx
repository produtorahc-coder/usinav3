import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import ModuleCard, { ModuleConfig } from './ModuleCard';
import BottomNavigation from './BottomNavigation';
import UrgentAlert from './UrgentAlert';
import { ViewState } from '../types';

interface CommandCenterProps {
    onNavigate: (view: ViewState, params?: any) => void;
    userName: string;
    userLevel: number;
    currentXP: number;
    maxXP: number;
    userAvatar?: string;
    urgentAlert?: {
        title: string;
        message: string;
        ctaText: string;
        onCtaClick: () => void;
    };
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
    onNavigate,
    userName,
    userLevel,
    currentXP,
    maxXP,
    userAvatar,
    urgentAlert
}) => {
    const [activeNav, setActiveNav] = useState('home');

    // Módulos principais
    const modules: ModuleConfig[] = [
        {
            id: 'portfolio',
            icon: 'folder_special',
            label: 'Portfólio',
            color: 'blue',
            onClick: () => onNavigate(ViewState.MODULE_PORTFOLIO)
        },
        {
            id: 'analyzer',
            icon: 'search',
            label: 'Analisador',
            color: 'purple',
            onClick: () => onNavigate(ViewState.MODULE_EDITAL)
        },
        {
            id: 'projects',
            icon: 'view_in_ar',
            label: 'Estruturador de Projetos',
            subtitle: 'Canvas / Mundos',
            color: 'orange',
            onClick: () => onNavigate(ViewState.MODULE_PROJECTS)
        },
        {
            id: 'budget',
            icon: 'payments',
            label: 'Planilha Orçamentária',
            color: 'teal',
            onClick: () => onNavigate(ViewState.MODULE_BUDGET)
        },
        {
            id: 'archive',
            icon: 'inventory_2',
            label: 'Gestor de Acervo',
            color: 'yellow',
            onClick: () => onNavigate(ViewState.ADMIN_EDICTS)
        },
        {
            id: 'career',
            icon: 'trending_up',
            label: 'Modo Carreira',
            color: 'orange',
            onClick: () => onNavigate(ViewState.CAREER_MODE)
        },
        {
            id: 'ai-review',
            icon: 'psychology',
            label: 'Revisão IA',
            color: 'orange',
            highlight: true,
            onClick: () => onNavigate(ViewState.AI_REVIEW)
        }
    ];

    const navItems = [
        {
            id: 'home',
            icon: 'home',
            label: 'Início',
            onClick: () => setActiveNav('home')
        },
        {
            id: 'editais',
            icon: 'description',
            label: 'Editais',
            onClick: () => {
                setActiveNav('editais');
                onNavigate(ViewState.ADMIN_EDICTS);
            }
        },
        {
            id: 'projects',
            icon: 'view_in_ar',
            label: 'Projetos',
            onClick: () => {
                setActiveNav('projects');
                onNavigate(ViewState.MODULE_PROJECTS);
            }
        },
        {
            id: 'profile',
            icon: 'person',
            label: 'Perfil',
            onClick: () => {
                setActiveNav('profile');
                onNavigate(ViewState.PROFILE);
            }
        }
    ];

    const handleFabClick = () => {
        onNavigate(ViewState.MODULE_PROJECTS, { create: true });
    };

    return (
        <div className="min-h-screen bg-bg-primary pb-24">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-orange to-accent-orange-dark rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">
                            factory
                        </span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white">Usina Cultural</h1>
                        <p className="text-xs text-accent-orange font-semibold">COMMAND CENTER</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-400">
                            notifications
                        </span>
                    </button>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-slate-400">
                            settings
                        </span>
                    </button>
                </div>
            </header>

            {/* Urgent Alert */}
            {urgentAlert && (
                <div className="m-4">
                    <UrgentAlert {...urgentAlert} />
                </div>
            )}

            {/* Greeting */}
            <div className="px-4 mb-6 mt-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                    Olá, {userName.split(' ')[0]}!
                </h2>
                <p className="text-slate-400">Pronto para o próximo edital?</p>
            </div>

            {/* Career Progress */}
            <div className="mx-4 mb-6 bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-orange">
                            military_tech
                        </span>
                        <h3 className="font-bold text-white">
                            {userLevel >= 10 ? 'Produtor Sênior' :
                                userLevel >= 5 ? 'Produtor Pleno' :
                                    'Produtor Júnior'}
                        </h3>
                    </div>
                    <span className="text-xs bg-accent-orange px-2 py-1 rounded font-semibold text-white">
                        PRO
                    </span>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Modo Carreira Progress</span>
                        <span className="text-accent-orange font-bold">
                            {currentXP}/{maxXP} XP
                        </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent-orange to-accent-yellow transition-all duration-500"
                            style={{ width: `${(currentXP / maxXP) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Faltam {maxXP - currentXP} XP para o nível Produtor Master
                    </p>
                </div>
            </div>

            {/* Modules Grid */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Módulos Principais</h3>
                    <button className="text-sm text-primary-purple hover:text-primary-purple-light transition-colors">
                        Ver todos
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {modules.map(module => (
                        <ModuleCard key={module.id} module={module} />
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation
                items={navItems}
                activeId={activeNav}
                onFabClick={handleFabClick}
                fabIcon="add"
            />
        </div>
    );
};

export default CommandCenter;
