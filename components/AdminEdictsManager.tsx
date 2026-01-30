
import React, { useState, useEffect } from 'react';
import { ViewState, DigitalEdict } from '../types';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

const MOCK_EXISTING_EDICTS: DigitalEdict[] = [
    {
        id: 'ed-001',
        title: 'Edital de Fomento ao Teatro 2024',
        category: 'Cultura',
        uploadDate: '24/10/2023',
        status: 'PUBLISHED',
        extractedText: 'Objeto: Seleção de projetos teatrais... Valor: R$ 500.000,00...',
        keywords: ['teatro', 'fomento', 'produção'],
        publicUrl: 'https://usina.cultura/editais/teatro-2024',
        fileName: 'edital_teatro_vfinal.pdf'
    },
    {
        id: 'ed-002',
        title: 'Chamamento Público - Audiovisual',
        category: 'Audiovisual',
        uploadDate: '25/10/2023',
        status: 'DRAFT',
        extractedText: '...Artigo 5: Das vedações...',
        keywords: ['cinema', 'curta-metragem'],
        fileName: 'minuta_audiovisual.pdf'
    }
];

const AdminEdictsManager: React.FC<Props> = ({ onBack, onNavigate }) => {
    const [edicts, setEdicts] = useState<DigitalEdict[]>(MOCK_EXISTING_EDICTS);
    const [uploading, setUploading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    // Simulação de Upload e OCR
    const handleFileUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        const file = files[0];
        setUploading(true);
        setOcrProgress(0);

        // Simula processamento
        const interval = setInterval(() => {
            setOcrProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    completeUpload(file);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const completeUpload = (file: File) => {
        setUploading(false);
        const newEdict: DigitalEdict = {
            id: `ed-${Date.now()}`,
            title: file.name.replace('.pdf', ''),
            category: 'Cultura',
            uploadDate: new Date().toLocaleDateString('pt-BR'),
            status: 'DRAFT',
            extractedText: 'Texto extraído via OCR simulado... Contém palavras-chave: acessibilidade, prazos, orçamento.',
            keywords: ['novo', 'upload', 'ocr'],
            fileName: file.name
        };
        setEdicts([newEdict, ...edicts]);
        alert("Digitalização concluída! O texto foi extraído e indexado.");
    };

    const handlePublish = (id: string) => {
        setEdicts(prev => prev.map(ed => 
            ed.id === id 
            ? { ...ed, status: 'PUBLISHED', publicUrl: `https://usina.cultura/editais/${id}` } 
            : ed
        ));
        // Aqui chamaria o backend para disparar o Broadcast se desejado
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans flex flex-col">
             {/* Header */}
             <header className="bg-[#1e293b] border-b border-white/10 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">inventory_2</span>
                                Gestão de Acervo Digital
                            </h1>
                            <p className="text-xs text-white/50">Painel Master • OCR & Indexação de Editais</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
                
                {/* 1. Área de Ingestão (Upload + OCR) */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400">upload_file</span>
                        Ingestão de Novos Editais
                    </h2>
                    
                    {!uploading ? (
                        <div 
                            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all h-64 ${dragActive ? 'border-primary bg-primary/10' : 'border-white/10 bg-[#1e293b] hover:border-white/20'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <span className="material-symbols-outlined text-4xl text-white/30 mb-4">cloud_upload</span>
                            <h3 className="text-lg font-bold text-white mb-2">Arraste o PDF do Edital aqui</h3>
                            <p className="text-white/50 text-sm mb-6">A IA fará a leitura (OCR) e indexação automática para busca.</p>
                            <label className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-lg">
                                Selecionar Arquivo
                                <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e.target.files)} />
                            </label>
                        </div>
                    ) : (
                        <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center h-64 animate-fade-in">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-lg font-bold text-white mb-2">Processando OCR e Indexando...</h3>
                            <p className="text-blue-400 font-mono mb-4">{ocrProgress}% Concluído</p>
                            <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                            </div>
                            <p className="text-xs text-white/30 mt-4">Extraindo texto bruto e identificando palavras-chave.</p>
                        </div>
                    )}
                </section>

                {/* 2. Lista de Editais (Curadoria) */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-400">library_books</span>
                            Acervo e Curadoria
                        </h2>
                        <span className="text-xs text-white/40">Total: {edicts.length} documentos</span>
                    </div>

                    <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 border-b border-white/10 text-xs uppercase text-white/50 font-bold">
                                    <th className="p-4">Título do Edital</th>
                                    <th className="p-4">Categoria</th>
                                    <th className="p-4">Data Upload</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {edicts.map(edict => (
                                    <tr key={edict.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-red-400 text-2xl">picture_as_pdf</span>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{edict.title}</p>
                                                    <p className="text-[10px] text-white/40 font-mono">{edict.fileName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70">{edict.category}</span>
                                        </td>
                                        <td className="p-4 text-sm text-white/60">{edict.uploadDate}</td>
                                        <td className="p-4 text-center">
                                            {edict.status === 'PUBLISHED' ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase border border-green-500/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                    Publicado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold uppercase border border-yellow-500/30">
                                                    Rascunho
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {edict.status === 'DRAFT' && (
                                                    <button 
                                                        onClick={() => handlePublish(edict.id)}
                                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
                                                        title="Disponibilizar para busca dos usuários"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">publish</span>
                                                        Publicar
                                                    </button>
                                                )}
                                                {edict.status === 'PUBLISHED' && (
                                                    <button 
                                                        onClick={() => alert(`Link copiado: ${edict.publicUrl}`)}
                                                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-xs">link</span>
                                                        Copiar Link
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-white/10 rounded text-white/50 hover:text-white">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button className="p-2 hover:bg-red-500/20 rounded text-white/50 hover:text-red-400">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminEdictsManager;
