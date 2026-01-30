
import React, { useState, useRef } from 'react';
import { PortfolioBlock, BlockType, GalleryImage, ViewState } from '../types';
import { ExitConfirmationModal } from './ExitConfirmationModal';

// Declaração global para biblioteca de PDF (injetada no index.html)
declare var html2pdf: any;

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

// --- TEMPLATES ---

const TEMPLATE_CORES_DA_DANCA: PortfolioBlock[] = [
    {
        id: '1',
        type: 'cover',
        content: { title: 'Cores da Dança', subtitle: 'Portfólio Artístico 2024', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=1000' },
        styles: { backgroundColor: 'transparent', textColor: '#ffffff', align: 'left' }
    },
    {
        id: '2',
        type: 'bio',
        content: {
            title: 'Sobre o Artista',
            text: 'Explorando a interseção entre movimento e cor, este projeto busca traduzir a efemeridade da dança em instalações visuais permanentes.',
        },
        styles: { backgroundColor: '#1e293b', textColor: '#ffffff' }
    },
    {
        id: '3',
        type: 'gallery',
        content: {
            images: [
                { url: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=500', caption: 'Performance SP' },
                { url: 'https://images.unsplash.com/photo-1518834107812-bf56135fd181?auto=format&fit=crop&q=80&w=500', caption: 'Ensaio Aberto' }
            ]
        },
        styles: { backgroundColor: 'transparent', textColor: '#ffffff' }
    }
];

const TEMPLATE_GESTAO_PROJETOS: PortfolioBlock[] = [
    {
        id: 't1',
        type: 'cover',
        content: { title: 'Festival Urbrasil', subtitle: 'Relatório Técnico e Gestão', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000' },
        styles: { backgroundColor: 'transparent', textColor: '#ffffff', align: 'center' }
    },
    {
        id: 't2',
        type: 'text',
        content: {
            title: '1. Sinopse do Projeto',
            text: 'O Festival Urbrasil é uma iniciativa multicultural que reúne graffiti, dança urbana e música em um evento gratuito de 3 dias, visando a democratização do acesso à cultura na Zona Norte.',
        },
        styles: { backgroundColor: '#ffffff', textColor: '#000000' }
    },
    {
        id: 't3',
        type: 'text',
        content: {
            title: '2. Ficha Técnica',
            text: 'Direção Geral: Ana Souza\nProdução Executiva: Carlos Lima\nCuradoria Artística: Beatriz Silva\nAssessoria de Imprensa: Agência Viva',
        },
        styles: { backgroundColor: '#f8f9fa', textColor: '#000000' }
    },
    {
        id: 't4',
        type: 'text',
        content: {
            title: '3. Justificativa',
            text: 'A relevância do projeto reside na escassez de equipamentos culturais na região alvo. Com base nos dados do IBGE, o bairro possui 50 mil jovens sem acesso a cinema ou teatro num raio de 5km.',
        },
        styles: { backgroundColor: '#ffffff', textColor: '#000000' }
    },
    {
        id: 't5',
        type: 'text',
        content: {
            title: '4. Impacto Social',
            text: 'O projeto impactou diretamente 200 jovens através de oficinas de capacitação e indiretamente 5.000 espectadores durante os dias de evento, gerando 45 empregos diretos.',
        },
        styles: { backgroundColor: '#f8f9fa', textColor: '#000000' }
    }
];

const PortfolioGenerator: React.FC<Props> = ({ onBack, onNavigate }) => {
    // State
    const [viewMode, setViewMode] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
    const [blocks, setBlocks] = useState<PortfolioBlock[]>(TEMPLATE_GESTAO_PROJETOS);
    const [externalLink, setExternalLink] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTemplatesModal, setShowTemplatesModal] = useState(false);
    const [selectedBlockType, setSelectedBlockType] = useState<BlockType | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Exit Modal State
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

    // Actions
    const handleSafeExit = () => {
        if (hasUnsavedChanges) {
            setPendingNavigation(() => onBack);
            setShowExitModal(true);
        } else {
            onBack();
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

    const handleApplyTemplate = (template: PortfolioBlock[]) => {
        if (window.confirm("Aplicar este template substituirá todo o conteúdo atual. Deseja continuar?")) {
            setBlocks(JSON.parse(JSON.stringify(template)));
            setHasUnsavedChanges(true);
            setShowTemplatesModal(false);
        }
    };

    const handleConfirmAddBlock = () => {
        if (!selectedBlockType) return;

        const newBlock: PortfolioBlock = {
            id: Date.now().toString(),
            type: selectedBlockType,
            content: getDefaultContent(selectedBlockType),
            styles: { backgroundColor: '#1e293b', textColor: '#ffffff', padding: '1.5rem' }
        };

        setBlocks([...blocks, newBlock]);
        setShowAddModal(false);
        setSelectedBlockType(null);
        setHasUnsavedChanges(true);
    };

    const updateBlockContent = (id: string, newContent: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b));
        setHasUnsavedChanges(true);
    };

    const removeBlock = (id: string) => {
        if (window.confirm("Remover este bloco?")) {
            setBlocks(blocks.filter(b => b.id !== id));
            setHasUnsavedChanges(true);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId: string, key: string = 'image') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            if (key === 'gallery') {
                const currentGallery = blocks.find(b => b.id === blockId)?.content.images || [];
                updateBlockContent(blockId, { images: [...currentGallery, { url: imageUrl, caption: '' }] });
            } else {
                updateBlockContent(blockId, { [key]: imageUrl });
            }
        }
    };

    // --- SAÍDA (OUTPUT) ---

    const handlePreview = () => {
        setViewMode('PREVIEW');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = (format: 'PDF' | 'DOCX') => {
        setIsExporting(true);

        // Simulação de processamento local
        setTimeout(() => {
            if (format === 'PDF') {
                const element = document.getElementById('portfolio-preview');
                if (element && typeof html2pdf !== 'undefined') {
                    const opt = {
                        margin: 0,
                        filename: 'meu-portfolio-usina.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    html2pdf().from(element).set(opt).save();
                } else {
                    // Fallback se lib não carregar
                    alert("Iniciando diálogo de impressão do sistema...");
                    window.print();
                }
            } else {
                // Simulação DOCX
                alert(`Arquivo DOCX gerado com sucesso!\n\nEste arquivo foi processado localmente no seu dispositivo e não foi salvo em nossos servidores.`);
            }
            setIsExporting(false);
        }, 1000);
    };

    const handleSaveStructure = () => {
        // Simula salvamento no Firestore
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setHasUnsavedChanges(false);
            alert("Estrutura salva no seu perfil da Usina Cultural!");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans text-white overflow-hidden relative">

            {/* 1. Header (Barra de Ferramentas de Saída) */}
            <header className="bg-[#1e293b] border-b border-white/10 p-4 z-50 shadow-lg">
                <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Left: Nav & Title */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={handleSafeExit}
                            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white/70">arrow_back</span>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">perm_media</span>
                                Construtor de Portfólio
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                {hasUnsavedChanges ? <span className="text-orange-500 font-bold">• Não salvo</span> : <span>Salvo</span>}
                                <span className="hidden md:inline">| Interface Lego</span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Template & Add */}
                    {viewMode === 'EDITOR' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowTemplatesModal(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-white/10"
                            >
                                <span className="material-symbols-outlined text-sm">dashboard</span>
                                Templates
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Adicionar Bloco
                            </button>
                        </div>
                    )}

                    {/* Right: Output Actions */}
                    <div className="flex items-center gap-2">
                        {viewMode === 'EDITOR' ? (
                            <button
                                onClick={handlePreview}
                                className="px-4 py-2 bg-white text-slate-900 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <span className="material-symbols-outlined">visibility</span>
                                Visualizar
                            </button>
                        ) : (
                            <button
                                onClick={() => setViewMode('EDITOR')}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <span className="material-symbols-outlined">edit</span>
                                Editar
                            </button>
                        )}

                        <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

                        <button
                            onClick={handlePrint}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Imprimir / Salvar como PDF"
                        >
                            <span className="material-symbols-outlined">print</span>
                        </button>

                        <button
                            onClick={() => handleExport('PDF')}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Exportar PDF"
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </button>

                        <button
                            onClick={handleSaveStructure}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined text-sm">save</span>
                            Salvar
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area */}
            <main className="flex-1 overflow-hidden relative bg-[#0F172A]">

                {/* --- EDITOR MODE --- */}
                {viewMode === 'EDITOR' && (
                    <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar flex justify-center">
                        <div className="w-full max-w-2xl space-y-6 pb-48">

                            {/* Blocks List */}
                            {blocks.map((block, index) => (
                                <div key={block.id} className="relative group animate-fade-in">
                                    {/* Position Indicator */}
                                    <div className="absolute -left-10 top-6 text-white/20 font-mono text-xs hidden md:block">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Block Controls */}
                                    <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => removeBlock(block.id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"
                                            title="Remover Bloco"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                        <div className="w-6 flex items-center justify-center cursor-move text-white/30 hover:text-white">
                                            <span className="material-symbols-outlined text-lg">drag_indicator</span>
                                        </div>
                                    </div>

                                    {/* Render Block Editor */}
                                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1c1c1e] shadow-lg">
                                        {renderBlockEditor(block, (c) => updateBlockContent(block.id, c), (e) => handleImageUpload(e, block.id), (e) => handleImageUpload(e, block.id, 'gallery'))}
                                    </div>
                                </div>
                            ))}

                            {/* Add Block Placeholder */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full h-20 rounded-xl border-2 border-dashed border-white/10 hover:border-green-500/50 bg-white/5 hover:bg-green-500/5 flex items-center justify-center gap-2 text-white/30 hover:text-green-500 transition-all group"
                            >
                                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_circle</span>
                                <span className="text-sm font-bold uppercase tracking-widest">Adicionar Bloco</span>
                            </button>

                            {/* External Storage Field */}
                            <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/20 to-[#1c1c1e] border border-blue-500/30 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">Armazenamento na Nuvem</h3>
                                        <p className="text-sm text-white/60 mb-4">
                                            Para garantir a longevidade do seu portfólio, salve o PDF gerado no seu Google Drive ou Dropbox e cole o link abaixo.
                                        </p>
                                        <input
                                            type="text"
                                            value={externalLink}
                                            onChange={(e) => { setExternalLink(e.target.value); setHasUnsavedChanges(true); }}
                                            placeholder="Cole aqui o link do seu arquivo (ex: drive.google.com/...)"
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                                        />
                                        <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">lock</span>
                                            Este link será vinculado ao seu projeto para acesso rápido.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* --- PREVIEW MODE (A4) --- */}
                {viewMode === 'PREVIEW' && (
                    <div className="h-full overflow-y-auto p-8 bg-gray-500 flex justify-center custom-scrollbar">
                        <div
                            id="portfolio-preview"
                            className="bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] p-0 relative"
                        >
                            {blocks.map((block) => (
                                <div key={block.id}>
                                    {renderBlockPreview(block)}
                                </div>
                            ))}

                            {/* Watermark / Footer */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-center border-t border-gray-100 mt-auto">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                    Gerado via Usina Cultural • {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* MODAL: TEMPLATES */}
            {showTemplatesModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTemplatesModal(false)}></div>
                    <div className="relative bg-[#1c1c1e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Escolha um Template</h2>
                            <button onClick={() => setShowTemplatesModal(false)}><span className="material-symbols-outlined text-white/50 hover:text-white">close</span></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => handleApplyTemplate(TEMPLATE_CORES_DA_DANCA)}
                                className="group text-left bg-black/20 hover:bg-primary/10 border border-white/10 hover:border-primary rounded-xl p-6 transition-all"
                            >
                                <div className="h-32 bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">palette</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Cores da Dança</h3>
                                <p className="text-sm text-white/50">Foco artístico. Grandes áreas para fotos, bio resumida e destaque visual.</p>
                            </button>

                            <button
                                onClick={() => handleApplyTemplate(TEMPLATE_GESTAO_PROJETOS)}
                                className="group text-left bg-black/20 hover:bg-primary/10 border border-white/10 hover:border-primary rounded-xl p-6 transition-all"
                            >
                                <div className="h-32 bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-white drop-shadow-lg">assignment</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Gestão de Projetos</h3>
                                <p className="text-sm text-white/50">Foco técnico. Sinopse, Ficha Técnica, Justificativa e Impacto Social.</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ADD BLOCK */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Adicionar Novo Bloco</h2>
                            <button onClick={() => setShowAddModal(false)}><span className="material-symbols-outlined text-white/50 hover:text-white">close</span></button>
                        </div>

                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                            {[
                                { id: 'text', label: 'Texto Livre (Sinopse/Justificativa)', icon: 'notes', color: 'text-orange-400' },
                                { id: 'cover', label: 'Capa do Projeto', icon: 'image', color: 'text-purple-400' },
                                { id: 'gallery', label: 'Galeria de Fotos', icon: 'photo_library', color: 'text-teal-400' },
                                { id: 'bio', label: 'Bio / Currículo', icon: 'person', color: 'text-green-400' },
                                { id: 'contact', label: 'Contatos', icon: 'contact_mail', color: 'text-blue-400' },
                                { id: 'clipping', label: 'Clipping / Citações', icon: 'format_quote', color: 'text-pink-400' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSelectedBlockType(opt.id as BlockType)}
                                    className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${selectedBlockType === opt.id ? 'bg-primary/20 border-primary' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                >
                                    <span className={`material-symbols-outlined ${opt.color}`}>{opt.icon}</span>
                                    <span className="text-sm font-bold text-white">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleConfirmAddBlock}
                            disabled={!selectedBlockType}
                            className={`w-full py-4 rounded-xl font-bold transition-colors ${selectedBlockType ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                        >
                            Inserir no Portfólio
                        </button>
                    </div>
                </div>
            )}

            {/* Exit Confirmation Modal */}
            <ExitConfirmationModal
                isOpen={showExitModal}
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
            />
        </div>
    );
};

// --- RENDERERS (EDITOR vs PREVIEW) ---

const getDefaultContent = (type: BlockType) => {
    switch (type) {
        case 'cover': return { title: 'Título do Projeto', subtitle: 'Subtítulo', image: '' };
        case 'text': return { title: 'Nova Seção', text: 'Clique para editar este texto...', image: '' };
        case 'bio': return { title: 'Bio Profissional', text: 'Escreva sua biografia aqui...' };
        case 'gallery': return { images: [] };
        case 'contact': return { email: 'contato@email.com', phone: '', site: '' };
        case 'social': return { instagram: '@usuario', linkedin: '', behance: '' };
        case 'clipping': return { quotes: [{ source: 'Veículo', text: '"Citação..."', url: '' }] };
        default: return {};
    }
};

// --- EDITOR COMPONENT (Dark Mode, Editable) ---
const renderBlockEditor = (
    block: PortfolioBlock,
    onUpdate: (c: any) => void,
    onImageUpload: (e: any) => void,
    onGalleryUpload: (e: any) => void
) => {
    switch (block.type) {
        case 'cover':
            return (
                <div className="relative h-64 w-full group">
                    {block.content.image ? (
                        <img src={block.content.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black"></div>
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <input
                            value={block.content.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="bg-transparent text-3xl font-bold text-white placeholder-white/30 focus:outline-none mb-2"
                            placeholder="Título Principal"
                        />
                        <input
                            value={block.content.subtitle}
                            onChange={(e) => onUpdate({ subtitle: e.target.value })}
                            className="bg-transparent text-lg text-primary font-bold placeholder-white/30 focus:outline-none"
                            placeholder="Subtítulo"
                        />
                    </div>
                    <label className="absolute top-4 right-4 bg-black/50 p-2 rounded-full cursor-pointer hover:bg-black/80 text-white">
                        <span className="material-symbols-outlined">image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
                    </label>
                </div>
            );
        case 'text':
        case 'bio':
            return (
                <div className="p-6">
                    <input
                        value={block.content.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="bg-transparent text-lg font-bold text-white w-full mb-3 focus:outline-none border-b border-transparent focus:border-white/20 pb-1"
                        placeholder="Título da Seção"
                    />
                    <textarea
                        value={block.content.text}
                        onChange={(e) => onUpdate({ text: e.target.value })}
                        className="w-full h-32 bg-transparent text-sm text-slate-300 leading-relaxed resize-y focus:outline-none"
                        placeholder="Escreva o conteúdo aqui..."
                    />
                </div>
            );
        case 'gallery':
            return (
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white/70">Galeria</h3>
                        <label className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                            Adicionar Foto
                            <input type="file" className="hidden" accept="image/*" onChange={onGalleryUpload} />
                        </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {block.content.images?.map((img: GalleryImage, idx: number) => (
                            <div key={idx} className="aspect-square bg-black/30 rounded-lg overflow-hidden relative group/img">
                                <img src={img.url} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="material-symbols-outlined text-white cursor-pointer">delete</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        default: return <div className="p-4 text-white/30">Editor não disponível para este tipo.</div>;
    }
};

// --- PREVIEW COMPONENT (Light Mode, A4 Print) ---
const renderBlockPreview = (block: PortfolioBlock) => {
    switch (block.type) {
        case 'cover':
            return (
                <div className="h-[297mm] w-full relative flex flex-col justify-end text-white page-break-after">
                    <img src={block.content.image} className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                    <div className="relative z-20 p-[20mm]">
                        <h1 className="text-6xl font-bold uppercase tracking-tight mb-4 leading-none">{block.content.title}</h1>
                        <p className="text-2xl font-light tracking-widest border-l-4 border-white pl-4">{block.content.subtitle}</p>
                    </div>
                </div>
            );
        case 'text':
        case 'bio':
            return (
                <div className="px-[20mm] py-[10mm] text-gray-800">
                    <h2 className="text-2xl font-bold mb-4 uppercase text-black border-b-2 border-black pb-2 inline-block">{block.content.title}</h2>
                    <div className="text-justify text-sm leading-relaxed font-serif whitespace-pre-wrap">
                        {block.content.text}
                    </div>
                </div>
            );
        case 'gallery':
            return (
                <div className="px-[20mm] py-[10mm]">
                    <div className="grid grid-cols-2 gap-4">
                        {block.content.images?.map((img: GalleryImage, idx: number) => (
                            <div key={idx} className="break-inside-avoid">
                                <img src={img.url} className="w-full h-auto object-cover rounded-sm mb-2" />
                                {img.caption && <p className="text-xs text-gray-500 italic">{img.caption}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        default: return null;
    }
};

export default PortfolioGenerator;
