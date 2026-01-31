import React, { useState } from 'react';
import { BudgetProject, BudgetItem, BudgetCategory, ViewState } from '../types';
import { ExitConfirmationModal } from './ExitConfirmationModal';

// Declaração global para biblioteca externa
declare var html2pdf: any;

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
    activeProjectId?: string | null;
    isEmbedded?: boolean;
}

const DEFAULT_CATEGORIES = [
    "1 - Pessoal - Profissionais da Área da Cultura",
    "2 - Pessoal - Demais Prestadores de Serviços",
    "3 - Equipamentos, Material e Estrutura",
    "4 - Logística",
    "5 - Divulgação, Mídia e Comunicação",
    "6 - Ações de Acessibilidade",
    "7 - Custos Administrativos",
    "8 - Taxas e Seguros"
];

const MOCK_MASTER_PROJECTS = [
    { id: 'master-1', name: 'Festival Urbrasil 2024' },
    { id: 'master-2', name: 'Curta Metragem: O Silêncio' },
    { id: 'master-3', name: 'Exposição Coletiva SP' }
];

const BudgetManager: React.FC<Props> = ({ onBack, onNavigate, activeProjectId, isEmbedded }) => {
    // --- ESTADO ---
    const [viewMode, setViewMode] = useState<'LIST' | 'EDITOR'>('LIST');
    const [projects, setProjects] = useState<BudgetProject[]>([
        {
            id: '1',
            projectId: 'master-1',
            name: 'Projeto Circulação - Lei Paulo Gustavo',
            lastEdited: '10/10/2023',
            status: 'Em Elaboração',
            categories: generateEmptyCategories()
        }
    ]);
    const [currentProject, setCurrentProject] = useState<BudgetProject | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // --- FUNÇÕES DE APOIO ---
    function generateEmptyCategories(): BudgetCategory[] {
        return DEFAULT_CATEGORIES.map((name, index) => ({
            id: index + 1,
            name: name,
            items: []
        }));
    }

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const calculateItemTotal = (item: BudgetItem) => item.quantity * (item.unitFrequency || 1) * item.unitValue;
    const calculateCategoryTotal = (category: BudgetCategory) => category.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
    const calculateProjectTotal = (project: BudgetProject) => project.categories.reduce((acc, cat) => acc + calculateCategoryTotal(cat), 0);

    // --- MANIPULADORES DE EVENTOS ---
    const handleCreateNew = () => {
        const newProject: BudgetProject = {
            id: Date.now().toString(),
            projectId: activeProjectId || null,
            name: activeProjectId ? 'Novo Orçamento Vinculado' : 'Novo Orçamento de Modelo',
            lastEdited: new Date().toLocaleDateString('pt-BR'),
            status: 'Em Elaboração',
            categories: generateEmptyCategories()
        };
        setProjects([...projects, newProject]);
        setCurrentProject(newProject);
        setViewMode('EDITOR');
    };

    const handleUpdateItem = (categoryId: number, itemId: string, field: keyof BudgetItem, value: any) => {
        if (!currentProject) return;
        const updatedCategories = currentProject.categories.map(cat => {
            if (cat.id === categoryId) {
                const updatedItems = cat.items.map(item => item.id === itemId ? { ...item, [field]: value } : item);
                return { ...cat, items: updatedItems };
            }
            return cat;
        });
        setCurrentProject({ ...currentProject, categories: updatedCategories });
        setHasUnsavedChanges(true);
    };

    const handleSaveClick = () => setShowSaveModal(true);
    const confirmSave = (action: 'CONTINUE' | 'EXIT') => {
        if (!currentProject) return;
        const updatedList = projects.map(p => p.id === currentProject.id ? { ...currentProject, lastEdited: new Date().toLocaleDateString('pt-BR') } : p);
        setProjects(updatedList);
        setShowSaveModal(false);
        setHasUnsavedChanges(false);
        if (action === 'EXIT') setViewMode('LIST');
    };

    const handleSafeExit = (navAction: () => void) => {
        if (hasUnsavedChanges) {
            setPendingNavigation(() => navAction);
            setShowExitModal(true);
        } else {
            navAction();
        }
    };

    // --- RENDERIZAÇÃO ---
    const containerClasses = isEmbedded
        ? "h-full bg-white text-slate-800 p-4 rounded-xl overflow-hidden flex flex-col"
        : "min-h-screen bg-[#101922] text-white p-6 md:p-12";

    // VISÃO DE LISTA
    if (viewMode === 'LIST') {
        return (
            <div className={containerClasses}>
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Gestor Financeiro</h1>
                    <button onClick={handleCreateNew} className="bg-purple-600 px-4 py-2 rounded-lg font-bold">Novo Orçamento</button>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.filter(p => !activeProjectId || p.projectId === activeProjectId).map(project => (
                        <div key={project.id} onClick={() => { setCurrentProject(project); setViewMode('EDITOR'); }} className="bg-[#1c1c1e] p-6 rounded-2xl cursor-pointer border border-white/5 hover:border-purple-500">
                            <h3 className="text-xl font-bold">{project.name}</h3>
                            <p className="text-2xl font-bold mt-4 text-purple-400">{formatCurrency(calculateProjectTotal(project))}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // VISÃO DO EDITOR (Unificada)
    return (
        <div className={containerClasses}>
            <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#101922] py-4 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => handleSafeExit(() => setViewMode('LIST'))} className="material-symbols-outlined">arrow_back</button>
                    <h2 className="text-xl font-bold">{currentProject?.name}</h2>
                </div>
                <div className="flex gap-4">
                    <span className="text-xl font-bold text-green-400">{formatCurrency(calculateProjectTotal(currentProject!))}</span>
                    <button onClick={handleSaveClick} className="bg-green-600 px-4 py-2 rounded-lg font-bold">Salvar</button>
                </div>
            </header>

            <div className="space-y-6">
                {currentProject?.categories.map(category => (
                    <div key={category.id} className="bg-white/5 rounded-xl p-4">
                        <h3 className="text-purple-300 font-bold mb-4">{category.name}</h3>
                        {/* Mapeamento dos itens aqui... */}
                    </div>
                ))}
            </div>

            {showSaveModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
                    <div className="bg-[#1c1c1e] p-8 rounded-2xl max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Salvar Alterações?</h3>
                        <button onClick={() => confirmSave('EXIT')} className="w-full bg-purple-600 py-3 rounded-xl mb-3">Salvar e Sair</button>
                        <button onClick={() => setShowSaveModal(false)} className="w-full text-white/50">Cancelar</button>
                    </div>
                </div>
            )}

            <ExitConfirmationModal
                isOpen={showExitModal}
                onConfirm={() => { setShowExitModal(false); setHasUnsavedChanges(false); pendingNavigation?.(); }}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
};

export default BudgetManager;