
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectNode, FundingType, ProjectBlock, ViewState, CanvasData } from '../types';
import BudgetManager from './BudgetManager';
import { ExitConfirmationModal } from './ExitConfirmationModal';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
    initialProjectId?: string | null;
    initialCreate?: boolean;
}

// --- TEMPLATE MESTRE: OS 4 PILARES DA USINA CULTURAL ---
const MASTER_TEMPLATE: ProjectBlock[] = [
    // 1. PILARES ESTRATÉGICOS
    { id: 'sec-1', type: 'SECTION_HEADER', title: '1. Pilares Estratégicos (A Cabeça)', content: '', section: 'STRATEGY' },
    { id: 'b-intro', type: 'TEXT', title: 'Introdução', content: '', isRequired: true, section: 'STRATEGY', metadata: { placeholder: 'Definição clara do que é o projeto.' } },
    { id: 'b-sinopse', type: 'TEXT', title: 'Sinopse', content: '', isRequired: true, section: 'STRATEGY', metadata: { placeholder: 'Resumo executivo para leitura rápida (máx 5 linhas).' } },
    { id: 'b-justif', type: 'TEXT', title: 'Justificativa', content: '', isRequired: true, section: 'STRATEGY', metadata: { placeholder: 'Por que este projeto DEVE existir? Foco no mérito cultural.' } },
    { id: 'b-obj-geral', type: 'TEXT', title: 'Objetivo Geral', content: '', isRequired: true, section: 'STRATEGY', metadata: { placeholder: 'O objetivo macro do projeto.' } },
    { id: 'b-obj-esp', type: 'TEXT', title: 'Objetivos Específicos', content: '', isRequired: false, section: 'STRATEGY', metadata: { placeholder: 'Metas operacionais quantificáveis.' } },

    // 2. EXECUÇÃO E METODOLOGIA
    { id: 'sec-2', type: 'SECTION_HEADER', title: '2. Execução e Metodologia (O Corpo)', content: '', section: 'EXECUTION' },
    { id: 'b-metod', type: 'TEXT', title: 'Metodologia de Execução', content: '', isRequired: true, section: 'EXECUTION', metadata: { placeholder: 'Como o projeto será realizado? Descreva as etapas.' } },
    { id: 'b-crono', type: 'TABLE', title: 'Cronograma de Ações', content: '', isRequired: true, section: 'EXECUTION', metadata: { placeholder: 'Pré-produção, Produção e Pós-produção.' } },
    { id: 'b-equipe', type: 'TEXT', title: 'Ficha Técnica / Equipe', content: '', isRequired: true, section: 'EXECUTION', metadata: { placeholder: 'Principais nomes e funções (Direção, Produção, Artistas).' } },
    { id: 'b-publico', type: 'TEXT', title: 'Público-Alvo', content: '', isRequired: true, section: 'EXECUTION', metadata: { placeholder: 'Perfil demográfico e comportamental.' } },

    // 3. RESPONSABILIDADE E IMPACTO
    { id: 'sec-3', type: 'SECTION_HEADER', title: '3. Responsabilidade e Impacto (Diferencial)', content: '', section: 'IMPACT' },
    { id: 'b-acess', type: 'TEXT', title: 'Plano de Acessibilidade', content: '', isRequired: true, section: 'IMPACT', metadata: { placeholder: 'Acessibilidade física (rampas, libras) e de conteúdo.' } },
    { id: 'b-impacto', type: 'TEXT', title: 'Impacto Social e Ambiental', content: '', isRequired: true, section: 'IMPACT', metadata: { placeholder: 'Legado para a comunidade e contrapartida social.' } },
    { id: 'b-sustent', type: 'TEXT', title: 'Sustentabilidade e Resíduos', content: '', isRequired: false, section: 'IMPACT', metadata: { placeholder: 'Plano de gestão de resíduos e impacto ambiental.' } },

    // 4. VIABILIDADE E COMPLIANCE
    { id: 'sec-4', type: 'SECTION_HEADER', title: '4. Viabilidade e Compliance (Segurança)', content: '', section: 'VIABILITY' },
    { id: 'b-orcamento', type: 'TABLE', title: 'Resumo Orçamentário', content: '', isRequired: true, section: 'VIABILITY', metadata: { placeholder: 'Valores globais por rubrica.' } },
    { id: 'b-midia', type: 'TEXT', title: 'Plano de Mídia', content: '', isRequired: true, section: 'VIABILITY', metadata: { placeholder: 'Estratégia de divulgação, redes sociais e imprensa.' } },
    { id: 'b-juridico', type: 'TEXT', title: 'Compliance e Jurídico', content: '', isRequired: false, section: 'VIABILITY', metadata: { placeholder: 'Gestão de direitos autorais e contratos.' } },
    { id: 'b-risco', type: 'TEXT', title: 'Gestão de Risco', content: '', isRequired: false, section: 'VIABILITY', metadata: { placeholder: 'Matriz de riscos e planos de contingência.' } },
];

const INITIAL_CANVAS: CanvasData = {
    keyPartners: '',
    keyActivities: '',
    keyResources: '',
    valueProposition: '',
    customerRelationships: '',
    channels: '',
    customerSegments: '',
    costStructure: '',
    revenueStreams: ''
};

const ProjectManager: React.FC<Props> = ({ onBack, onNavigate, initialProjectId, initialCreate }) => {
    // --- ESTADO ---
    const [viewMode, setViewMode] = useState<'GRID' | 'PROJECT_WORKSPACE' | 'PREVIEW'>('GRID');
    const [workspaceTab, setWorkspaceTab] = useState<'SETUP' | 'CANVAS' | 'EDITOR' | 'BUDGET'>('CANVAS');
    const [savingState, setSavingState] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
    // Estado simples para controlar alterações não salvas (simulado, reseta ao salvar)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Exit Modal State
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

    const [projects, setProjects] = useState<ProjectNode[]>([
        {
            id: 'master-1',
            parentId: null,
            name: 'Festival Urbrasil 2024',
            fundingModes: ['INCENTIVE', 'PRIVATE'],
            progress: 65,
            lastModified: 'Hoje, 14:30',
            details: { summary: 'Festival multicultural.' },
            canvas: {
                ...INITIAL_CANVAS,
                valueProposition: 'Democratizar o acesso à arte urbana com um festival gratuito que une grafite, dança e música.',
                customerSegments: 'Jovens de 16-24 anos da periferia, classe C e D, estudantes de escolas públicas.'
            },
            blocks: MASTER_TEMPLATE.map(b => {
                if (b.id === 'b-intro') return { ...b, content: 'O Festival Urbrasil é a maior celebração de arte urbana...' };
                if (b.id === 'b-acess') return { ...b, content: 'Contaremos com intérpretes de LIBRAS em todos os palcos.' };
                return b;
            }),
            sponsorshipTiers: []
        },
        {
            id: 'sub-1',
            parentId: 'master-1',
            name: 'Oficinas de Graffiti',
            fundingModes: ['PUBLIC'],
            progress: 30,
            lastModified: 'Ontem',
            details: { summary: 'Ciclo de formação.' },
            canvas: INITIAL_CANVAS,
            blocks: MASTER_TEMPLATE // Novo projeto, vazio
        }
    ]);

    const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '');
    const [isExporting, setIsExporting] = useState(false);

    // --- EFFECT: Trigger Creation on Mount if requested ---
    useEffect(() => {
        if (initialCreate) {
            handleCreateProject();
        } else if (initialProjectId) {
            handleOpenProject(initialProjectId);
        }
    }, [initialCreate, initialProjectId]);

    // --- COMPUTED ---
    const activeProject = useMemo(() =>
        projects.find(p => p.id === selectedProjectId)
        , [projects, selectedProjectId]);

    const masterProjects = useMemo(() =>
        projects.filter(p => p.parentId === null)
        , [projects]);

    const complianceStatus = useMemo(() => {
        if (!activeProject) return { score: 0, missing: [] };

        const requiredBlocks = activeProject.blocks.filter(b => b.isRequired);
        const filledBlocks = requiredBlocks.filter(b => b.content && b.content.length > 5);

        const score = Math.round((filledBlocks.length / requiredBlocks.length) * 100);

        const needsSocial = activeProject.fundingModes.some(m => ['INCENTIVE', 'PUBLIC'].includes(m));
        const missingCritical: string[] = [];

        if (needsSocial) {
            const access = activeProject.blocks.find(b => b.id === 'b-acess');
            const impact = activeProject.blocks.find(b => b.id === 'b-impacto');

            if (!access || access.content.length < 10) missingCritical.push('Plano de Acessibilidade');
            if (!impact || impact.content.length < 10) missingCritical.push('Impacto Social');
        }

        return { score, missingCritical };
    }, [activeProject]);

    // --- ACTIONS ---

    // Navegação Segura (Impede perda de dados)
    // Navegação Segura (Impede perda de dados)
    const handleSafeExit = () => {
        if (viewMode === 'PROJECT_WORKSPACE' && hasUnsavedChanges) {
            setPendingNavigation(() => () => onNavigate(ViewState.ORBIT));
            setShowExitModal(true);
        } else {
            onNavigate(ViewState.ORBIT);
        }
    };

    const handleConfirmExit = () => {
        if (pendingNavigation) {
            pendingNavigation();
        }
        setShowExitModal(false);
        setHasUnsavedChanges(false);
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
        setPendingNavigation(null);
    };

    const handleOpenProject = (id: string) => {
        setSelectedProjectId(id);
        setViewMode('PROJECT_WORKSPACE');
        setHasUnsavedChanges(false);
        const proj = projects.find(p => p.id === id);
        const isNew = proj?.blocks.every(b => !b.content);

        if (isNew) {
            setWorkspaceTab('SETUP');
        } else {
            setWorkspaceTab('CANVAS');
        }
    };

    const handleCreateProject = () => {
        const newProject: ProjectNode = {
            id: `proj-${Date.now()}`,
            parentId: null,
            name: 'Novo Projeto Master',
            fundingModes: [],
            progress: 0,
            lastModified: 'Agora',
            details: { summary: '' },
            canvas: INITIAL_CANVAS,
            blocks: JSON.parse(JSON.stringify(MASTER_TEMPLATE))
        };
        setProjects(prev => [newProject, ...prev]);
        setSelectedProjectId(newProject.id);
        setViewMode('PROJECT_WORKSPACE');
        setWorkspaceTab('SETUP');
        setHasUnsavedChanges(true); // Novo projeto já começa "dirty"
    };

    const updateBlock = (blockId: string, updates: Partial<ProjectBlock>) => {
        if (!activeProject) return;
        const updatedBlocks = activeProject.blocks.map(b =>
            b.id === blockId ? { ...b, ...updates } : b
        );
        updateProjectBlocks(updatedBlocks);
        setHasUnsavedChanges(true);
    };

    const updateProjectBlocks = (newBlocks: ProjectBlock[]) => {
        setProjects(prev => prev.map(p =>
            p.id === selectedProjectId ? { ...p, blocks: newBlocks } : p
        ));
    };

    const updateProjectName = (name: string) => {
        setProjects(prev => prev.map(p =>
            p.id === selectedProjectId ? { ...p, name: name } : p
        ));
        setHasUnsavedChanges(true);
    };

    const updateCanvas = (field: keyof CanvasData, value: string) => {
        if (!activeProject) return;
        setProjects(prev => prev.map(p =>
            p.id === selectedProjectId ? { ...p, canvas: { ...p.canvas!, [field]: value } } : p
        ));
        setHasUnsavedChanges(true);
    };

    const syncCanvasToBlocks = () => {
        if (!activeProject || !activeProject.canvas) return;

        const c = activeProject.canvas;
        const newBlocks = [...activeProject.blocks];

        const mapCanvasToBlock = (canvasText: string, blockId: string, append: boolean = false) => {
            const blockIndex = newBlocks.findIndex(b => b.id === blockId);
            if (blockIndex !== -1 && canvasText.length > 0) {
                if (!newBlocks[blockIndex].content || newBlocks[blockIndex].content.length < 10) {
                    newBlocks[blockIndex] = { ...newBlocks[blockIndex], content: canvasText };
                } else if (append) {
                    if (!newBlocks[blockIndex].content.includes(canvasText)) {
                        newBlocks[blockIndex] = { ...newBlocks[blockIndex], content: newBlocks[blockIndex].content + "\n\n" + canvasText };
                    }
                }
            }
        };

        mapCanvasToBlock(c.valueProposition, 'b-sinopse');
        mapCanvasToBlock(`A principal força deste projeto reside na sua proposta de valor: ${c.valueProposition}`, 'b-justif', true);
        mapCanvasToBlock(c.keyActivities, 'b-metod');
        mapCanvasToBlock(c.customerSegments, 'b-publico');
        mapCanvasToBlock(c.costStructure, 'b-orcamento');
        mapCanvasToBlock(c.keyPartners, 'b-equipe');
        mapCanvasToBlock(`Canais de Distribuição: ${c.channels}\nRelacionamento: ${c.customerRelationships}`, 'b-midia');
        mapCanvasToBlock(`Recursos Chave Necessários: ${c.keyResources}`, 'b-metod', true);

        updateProjectBlocks(newBlocks);
        alert('🔄 Sincronização Concluída!\n\nOs campos do Formulário Base foram preenchidos automaticamente.');
        setWorkspaceTab('SETUP');
        setHasUnsavedChanges(true);
    };

    const toggleFundingMode = (mode: FundingType) => {
        if (!activeProject) return;
        const current = activeProject.fundingModes;
        const updated = current.includes(mode)
            ? current.filter(m => m !== mode)
            : [...current, mode];

        setProjects(prev => prev.map(p =>
            p.id === selectedProjectId ? { ...p, fundingModes: updated } : p
        ));
        setHasUnsavedChanges(true);
    };

    const handleOpenBudgetManager = () => {
        setWorkspaceTab('BUDGET');
    };

    const simulateSave = async (): Promise<void> => {
        setSavingState('SAVING');
        return new Promise(resolve => {
            setTimeout(() => {
                setSavingState('SAVED');
                setHasUnsavedChanges(false); // Reset dirty state
                setTimeout(() => setSavingState('IDLE'), 2000);
                resolve();
            }, 800);
        });
    };

    const handleSaveAndContinue = async () => {
        await simulateSave();
    };

    const handleSaveAndClose = async () => {
        await simulateSave();
        setViewMode('GRID');
    };

    const handleGoToPreview = () => {
        setViewMode('PREVIEW');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = (format: 'PDF' | 'DOCX') => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert(`Arquivo baixado: ${activeProject?.name}.${format.toLowerCase()}`);
        }, 1500);
    };

    // --- RENDERERS ---

    // 1. GRID VIEW
    if (viewMode === 'GRID') {
        return (
            <div className="min-h-screen bg-[#101922] text-white p-8 font-sans">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="cursor-pointer" onClick={() => onNavigate(ViewState.ORBIT)}>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-3xl">account_tree</span>
                                Central de Projetos
                            </h1>
                            <p className="text-white/50">Visão panorâmica da Holding</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate(ViewState.DASHBOARD)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            title="Ir para Dashboard"
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                        </button>
                        <button
                            onClick={handleCreateProject}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Novo Projeto Master
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {masterProjects.map(project => {
                        const req = project.blocks.filter(b => b.isRequired).length;
                        const filled = project.blocks.filter(b => b.isRequired && b.content && b.content.length > 5).length;
                        const score = Math.round((filled / req) * 100) || 0;

                        return (
                            <div
                                key={project.id}
                                onClick={() => handleOpenProject(project.id)}
                                className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-primary/50 hover:bg-[#1c1c1e]/80 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="material-symbols-outlined text-8xl">folder_open</span>
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                        <span className="material-symbols-outlined text-2xl text-white/70">folder</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {project.fundingModes.length > 0 ? project.fundingModes.map(mode => (
                                            <Badge key={mode} mode={mode} />
                                        )) : <span className="text-[10px] text-white/30 border border-white/10 px-2 py-0.5 rounded">Rascunho</span>}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                                    <p className="text-sm text-white/50 mb-6">Última edição: {project.lastModified}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-xs font-bold px-2 py-1 rounded ${score === 100 ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}>
                                                {score}% Preenchido
                                            </div>
                                        </div>
                                        <button className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            Abrir <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                                    <div className="h-full bg-primary" style={{ width: `${score}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 2. PROJECT WORKSPACE (EDIT MODE)
    if (viewMode === 'PROJECT_WORKSPACE' && activeProject) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] text-slate-800 flex flex-col font-sans">
                {/* Workspace Header */}
                <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setViewMode('GRID')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span className="text-sm font-bold hidden md:inline">Voltar</span>
                                </button>

                                <div
                                    className="cursor-pointer flex items-center gap-2 border-l pl-4 border-gray-300"
                                    onClick={handleSafeExit}
                                    title="Voltar para a Órbita (Home)"
                                >
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-lg">bolt</span>
                                    </div>
                                    <span className="font-display font-bold text-slate-800">Usina</span>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={activeProject.name}
                                        onChange={(e) => updateProjectName(e.target.value)}
                                        className="bg-transparent font-bold text-lg leading-tight text-slate-800 focus:outline-none w-64 md:w-auto"
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Workspace Integrado</span>
                                        {hasUnsavedChanges && <span className="text-[10px] text-orange-500 font-bold">• Não salvo</span>}
                                        {complianceStatus.score === 100 && (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">check</span> Pronto
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* View Switcher Tabs */}
                            <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1 border border-gray-200 overflow-x-auto">
                                <button
                                    onClick={() => setWorkspaceTab('SETUP')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${workspaceTab === 'SETUP' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">settings_account_box</span>
                                    Início
                                </button>
                                <button
                                    onClick={() => setWorkspaceTab('CANVAS')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${workspaceTab === 'CANVAS' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">view_kanban</span>
                                    Canvas
                                </button>
                                <button
                                    onClick={() => setWorkspaceTab('EDITOR')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${workspaceTab === 'EDITOR' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">description</span>
                                    Editor
                                </button>
                                <button
                                    onClick={() => setWorkspaceTab('BUDGET')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${workspaceTab === 'BUDGET' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">table_chart</span>
                                    Planilhas
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleGoToPreview}
                                    className="bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                    title="Visualizar antes de imprimir"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                    Visualizar
                                </button>
                                {workspaceTab === 'CANVAS' && (
                                    <button
                                        onClick={syncCanvasToBlocks}
                                        className="bg-[#1c1c1e] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 hidden md:flex"
                                        title="Sincronizar dados do Canvas para o Projeto"
                                    >
                                        <span className="material-symbols-outlined">sync_saved_locally</span>
                                        Sincronizar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full bg-[#F0F2F5] p-4 md:p-8 overflow-y-auto pb-24">

                    {/* --- SETUP VIEW --- */}
                    {workspaceTab === 'SETUP' && (
                        <div className="max-w-2xl mx-auto animate-fade-in pb-20">
                            {/* ... (Existing setup content) ... */}
                            <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-6 shadow-xl mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Travado no início?</h3>
                                        <p className="text-white/80 text-sm">Use o Canvas Didático para estruturar sua ideia visualmente.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setWorkspaceTab('CANVAS')}
                                    className="bg-white text-primary font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                >
                                    Iniciar pelo Canvas
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                                <h2 className="text-2xl font-display font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">edit_document</span>
                                    Formulário Base de Projeto
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Título do Projeto Master</label>
                                        <input
                                            type="text"
                                            value={activeProject.name}
                                            onChange={(e) => updateProjectName(e.target.value)}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            placeholder="Ex: Festival Urbrasil 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Modalidade de Fomento Inicial</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['PRIVATE', 'INCENTIVE', 'PUBLIC'].map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => toggleFundingMode(mode as FundingType)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${activeProject.fundingModes.includes(mode as FundingType)
                                                            ? 'bg-primary text-white border-primary shadow-md'
                                                            : 'bg-white text-slate-500 border-gray-200 hover:border-gray-400'
                                                        }`}
                                                >
                                                    {mode === 'PRIVATE' ? 'Privado' : mode === 'INCENTIVE' ? 'Incentivo Fiscal' : 'Edital Público'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Sinopse Curta</label>
                                        <textarea
                                            value={activeProject.blocks.find(b => b.id === 'b-sinopse')?.content || ''}
                                            onChange={(e) => updateBlock('b-sinopse', { content: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px]"
                                            placeholder="Descreva a ideia central do projeto em poucas linhas..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CANVAS VIEW --- */}
                    {workspaceTab === 'CANVAS' && activeProject.canvas && (
                        <div className="max-w-[1600px] mx-auto animate-fade-in pb-20">
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center gap-2">
                                        <span className="text-sm font-normal text-slate-500 uppercase tracking-widest bg-white px-2 py-1 rounded border border-gray-200">Estratégia de Projeto</span>
                                        Modelo de Negócio
                                    </h2>
                                    <p className="text-slate-500 mt-1">Toque em cada área para detalhar sua estratégia cultural.</p>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">Usina Canvas v2.0</div>
                            </div>
                            <div id="canvas-board" className="grid grid-cols-1 md:grid-cols-5 gap-4 auto-rows-min md:h-[800px]">
                                <div className="md:row-span-2">
                                    <CanvasBlock color="blue" icon="handshake" title="Parcerias Principais" placeholder="Ex: Patrocinadores, fornecedores, espaços culturais..." value={activeProject.canvas.keyPartners} onChange={(v) => updateCanvas('keyPartners', v)} tooltip="Quem ajuda você a realizar o projeto?" />
                                </div>
                                <div className="">
                                    <CanvasBlock color="blue" icon="settings" title="Atividades Principais" placeholder="O que você faz?" value={activeProject.canvas.keyActivities} onChange={(v) => updateCanvas('keyActivities', v)} tooltip="Quais as ações cruciais para a proposta de valor funcionar?" />
                                </div>
                                <div className="md:row-span-2">
                                    <CanvasBlock color="red" icon="redeem" title="Proposta de Valor" placeholder="Qual o diferencial do projeto?" value={activeProject.canvas.valueProposition} onChange={(v) => updateCanvas('valueProposition', v)} tooltip="Que valor entregamos ao público? Que problema resolvemos?" />
                                </div>
                                <div className="">
                                    <CanvasBlock color="green" icon="favorite" title="Relacionamento" placeholder="Como engaja o público?" value={activeProject.canvas.customerRelationships} onChange={(v) => updateCanvas('customerRelationships', v)} tooltip="Que tipo de relação o público espera?" />
                                </div>
                                <div className="md:row-span-2">
                                    <CanvasBlock color="green" icon="groups" title="Segmentos de Clientes" placeholder="Para quem é o projeto?" value={activeProject.canvas.customerSegments} onChange={(v) => updateCanvas('customerSegments', v)} tooltip="Quem é o público-alvo principal?" />
                                </div>
                                <div className="">
                                    <CanvasBlock color="blue" icon="inventory_2" title="Recursos Principais" placeholder="Materiais, equipe, verba..." value={activeProject.canvas.keyResources} onChange={(v) => updateCanvas('keyResources', v)} tooltip="O que é necessário para a proposta de valor acontecer?" />
                                </div>
                                <div className="">
                                    <CanvasBlock color="green" icon="local_shipping" title="Canais" placeholder="Onde o projeto acontece?" value={activeProject.canvas.channels} onChange={(v) => updateCanvas('channels', v)} tooltip="Como o público chega até você?" />
                                </div>
                                <div className="md:col-span-2.5 md:col-start-1 md:col-end-3">
                                    <CanvasBlock color="orange" icon="payments" title="Estrutura de Custos" placeholder="Quais são as principais despesas?" value={activeProject.canvas.costStructure} onChange={(v) => updateCanvas('costStructure', v)} tooltip="Quais os custos mais importantes?" />
                                </div>
                                <div className="md:col-span-2.5 md:col-start-4 md:col-end-6">
                                    <CanvasBlock color="orange" icon="account_balance_wallet" title="Fontes de Receita" placeholder="Como o projeto se sustenta?" value={activeProject.canvas.revenueStreams} onChange={(v) => updateCanvas('revenueStreams', v)} tooltip="Quanto o público pagaria? Quais editais?" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- BUDGET VIEW (EMBEDDED) --- */}
                    {workspaceTab === 'BUDGET' && (
                        <div className="max-w-[1600px] mx-auto animate-fade-in pb-20 h-full">
                            <BudgetManager
                                onBack={() => { }} // No back action needed in embedded mode
                                onNavigate={onNavigate}
                                activeProjectId={activeProject.id}
                                isEmbedded={true}
                            />
                        </div>
                    )}

                    {/* --- EDITOR VIEW --- */}
                    {workspaceTab === 'EDITOR' && (
                        <div className="max-w-4xl mx-auto space-y-4 pb-32 animate-fade-in text-slate-800">
                            <div className="flex justify-center gap-2 mb-6 bg-white border border-gray-200 p-2 rounded-xl inline-block mx-auto w-full shadow-sm">
                                <span className="text-xs font-bold text-slate-500 self-center mr-2">Modalidade:</span>
                                <FundingToggle mode="INCENTIVE" active={activeProject.fundingModes.includes('INCENTIVE')} onClick={() => toggleFundingMode('INCENTIVE')} />
                                <FundingToggle mode="PUBLIC" active={activeProject.fundingModes.includes('PUBLIC')} onClick={() => toggleFundingMode('PUBLIC')} />
                                <FundingToggle mode="PRIVATE" active={activeProject.fundingModes.includes('PRIVATE')} onClick={() => toggleFundingMode('PRIVATE')} />
                            </div>

                            {activeProject.blocks.map((block) => {
                                if (block.type === 'SECTION_HEADER') {
                                    return (
                                        <div key={block.id} className="pt-8 pb-4 border-b border-gray-200 flex items-center gap-3">
                                            <div className="h-6 w-1 bg-primary rounded-full"></div>
                                            <h2 className="text-xl font-display font-bold text-slate-800 uppercase tracking-wide">{block.title}</h2>
                                        </div>
                                    );
                                }
                                const isMissing = block.isRequired && (!block.content || block.content.length === 0);
                                return (
                                    <div key={block.id} className={`group relative bg-white border rounded-xl transition-all shadow-sm ${isMissing ? 'border-orange-200 bg-orange-50' : 'border-gray-200 hover:border-primary/30'}`}>
                                        {block.isRequired && (
                                            <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isMissing ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                {isMissing ? 'Obrigatório' : 'Preenchido'}
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex justify-between items-baseline mb-3">
                                                <h3 className="text-sm font-bold text-slate-700">{block.title}</h3>
                                                {block.type === 'TABLE' && <span className="text-[10px] text-slate-400 uppercase">Planilha</span>}
                                            </div>

                                            {block.type === 'TABLE' && (
                                                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors min-h-[100px]" onClick={handleOpenBudgetManager}>
                                                    <span className="material-symbols-outlined text-slate-300 text-3xl">table_view</span>
                                                    <p className="text-xs text-slate-500 text-center">{block.metadata?.placeholder || 'Configurar planilha...'}</p>
                                                    <button className="text-xs bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1 rounded text-slate-600 mt-2 pointer-events-none">Abrir Editor de Tabela</button>
                                                </div>
                                            )}

                                            {block.type === 'TEXT' && (
                                                <textarea
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                                    className="w-full min-h-[120px] bg-gray-50 border border-gray-200 rounded-lg p-4 text-slate-700 leading-relaxed resize-y focus:outline-none focus:border-primary/50 text-sm placeholder-slate-400"
                                                    placeholder={block.metadata?.placeholder || "Digite o conteúdo aqui..."}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="h-20 flex items-center justify-center text-slate-300 text-xs font-mono uppercase tracking-widest pt-8">
                                *** Fim do Documento ***
                            </div>
                        </div>
                    )}
                </main>

                {/* --- FOOTER DE PERSISTÊNCIA (EDITOR) --- */}
                {/* O footer só aparece se não estiver na aba de Budget, pois o Budget tem seu próprio controle interno (ou não precisa salvar globalmente da mesma forma) */}
                {workspaceTab !== 'BUDGET' && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                {savingState === 'SAVING' ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                        Salvando alterações...
                                    </>
                                ) : savingState === 'SAVED' ? (
                                    <>
                                        <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                        Salvo com sucesso
                                    </>
                                ) : (
                                    <>
                                        {hasUnsavedChanges ? (
                                            <span className="flex items-center gap-1 text-orange-500">
                                                <span className="material-symbols-outlined text-sm">warning</span>
                                                Alterações pendentes
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">cloud_done</span>
                                                Todas as alterações salvas
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveAndContinue}
                                    className="px-6 py-2.5 rounded-lg font-bold text-slate-700 hover:bg-gray-100 border border-gray-200 transition-colors"
                                >
                                    Salvar e Continuar
                                </button>
                                <button
                                    onClick={handleSaveAndClose}
                                    className="px-6 py-2.5 rounded-lg font-bold bg-[#1c1c1e] text-white hover:bg-black transition-colors shadow-lg"
                                >
                                    Salvar e Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // 3. PREVIEW MODE (READ-ONLY / PRINT READY)
    if (viewMode === 'PREVIEW' && activeProject) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
                {/* Preview Toolbar - Hidden on Print */}
                <header className="bg-[#1c1c1e] text-white p-4 sticky top-0 z-50 shadow-xl no-print">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setViewMode('PROJECT_WORKSPACE')} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                                <span className="font-bold text-sm">Voltar à Edição</span>
                            </button>
                            <div className="h-6 w-px bg-white/20"></div>
                            <h1 className="font-bold text-lg">{activeProject.name} <span className="text-white/50 text-sm font-normal">(Modo Visualização)</span></h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDownload('DOCX')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">description</span>
                                Baixar .DOCX
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg text-sm font-bold transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">print</span>
                                Imprimir / PDF
                            </button>
                            <button
                                onClick={handleSaveAndClose}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition-colors ml-2"
                            >
                                <span className="material-symbols-outlined text-lg">check</span>
                                Finalizar
                            </button>
                        </div>
                    </div>
                </header>

                {/* Document Canvas (A4 Style) */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div id="printable-area" className="max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl p-[20mm] text-black">

                        {/* Doc Header */}
                        <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">{activeProject.name}</h1>
                                <p className="text-sm text-gray-500">Documento gerado via Usina Cultural</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase">Data de Emissão</p>
                                <p className="text-sm">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Doc Content */}
                        <div className="space-y-8">
                            {activeProject.blocks.map(block => {
                                if (block.type === 'SECTION_HEADER') {
                                    return (
                                        <div key={block.id} className="pt-4 border-b border-gray-300 pb-2">
                                            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-800">{block.title}</h2>
                                        </div>
                                    );
                                }

                                if (!block.content && block.type !== 'TABLE') return null;

                                return (
                                    <div key={block.id} className="mb-6 avoid-break">
                                        <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">{block.title}</h3>

                                        {block.type === 'TEXT' && (
                                            <div className="text-justify text-sm leading-relaxed whitespace-pre-line text-gray-900 font-serif">
                                                {block.content}
                                            </div>
                                        )}

                                        {block.type === 'TABLE' && (
                                            <div className="w-full border border-gray-300 rounded p-4 bg-gray-50 flex items-center justify-center gap-3">
                                                <span className="material-symbols-outlined text-gray-400">table_view</span>
                                                <span className="text-sm font-mono text-gray-500 italic">Anexo: {block.title} (Ver planilha separada)</span>
                                            </div>
                                        )}

                                        {block.type === 'IMAGE' && block.content && (
                                            <div className="w-full border border-gray-200 p-2">
                                                <img src={block.content} className="max-w-full h-auto mx-auto" alt="Project asset" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Doc Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                            <p>Documento confidencial gerado pela plataforma Usina Cultural.</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return null;
};

// --- SUBCOMPONENTS ---

// Updated Canvas Block for BMC Layout
const CanvasBlock: React.FC<{
    color: 'blue' | 'red' | 'green' | 'orange',
    icon: string,
    title: string,
    placeholder: string,
    value: string,
    onChange: (v: string) => void,
    tooltip: string
}> = ({ color, icon, title, placeholder, value, onChange, tooltip }) => {

    const colors = {
        blue: 'bg-blue-50 border-blue-200 text-blue-900',
        red: 'bg-red-50 border-red-200 text-red-900',
        green: 'bg-green-50 border-green-200 text-green-900',
        orange: 'bg-orange-50 border-orange-200 text-orange-900'
    };

    const iconColors = {
        blue: 'text-blue-500',
        red: 'text-red-500',
        green: 'text-green-500',
        orange: 'text-orange-500'
    };

    const placeholderColors = {
        blue: 'placeholder-blue-300',
        red: 'placeholder-red-300',
        green: 'placeholder-green-300',
        orange: 'placeholder-orange-300'
    };

    return (
        <div className={`h-full rounded-2xl border-2 p-4 flex flex-col transition-all hover:shadow-lg ${colors[color]}`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`material-symbols-outlined ${iconColors[color]}`}>{icon}</span>
                <span className="material-symbols-outlined text-black/20 text-sm cursor-help" title={tooltip}>help</span>
            </div>
            <h3 className="font-bold text-sm uppercase mb-2 tracking-wide opacity-80">{title}</h3>
            <textarea
                className={`w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed font-medium ${placeholderColors[color]}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

const Badge: React.FC<{ mode: FundingType }> = ({ mode }) => {
    const map = {
        'PRIVATE': { label: 'Privado', class: 'bg-green-500/20 text-green-500 border-green-500/30' },
        'INCENTIVE': { label: 'Incentivo', class: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
        'PUBLIC': { label: 'Edital', class: 'bg-purple-500/20 text-purple-500 border-purple-500/30' }
    };
    const style = map[mode];
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.class}`}>
            {style.label}
        </span>
    );
};

const FundingToggle: React.FC<{ mode: FundingType, active: boolean, onClick: () => void }> = ({ mode, active, onClick }) => {
    const labels = { 'PRIVATE': 'Privado', 'INCENTIVE': 'Incentivo', 'PUBLIC': 'Edital' };
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all border ${active ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-400 border-gray-200 hover:border-gray-400'}`}
        >
            {labels[mode]}
        </button>
    );
};

export default ProjectManager;
