import React, { useState, useEffect } from 'react';
import { ViewState, DigitalEdict } from '../types';
import { supabase } from '../supabaseClient';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

const AdminEdictsManager: React.FC<Props> = ({ onBack, onNavigate }) => {
    const [edicts, setEdicts] = useState<DigitalEdict[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [selectedEdict, setSelectedEdict] = useState<DigitalEdict | null>(null); // For JSON Review
    const [viewMode, setViewMode] = useState<'EDICTS' | 'LOGS'>('EDICTS');

    useEffect(() => {
        fetchEdicts();
        fetchPayments();
    }, []);

    const fetchEdicts = async () => {
        const { data, error } = await supabase.from('edicts').select('*').order('upload_date', { ascending: false });
        if (data) {
            // Map snake_case database fields to camelCase interface
            const typesData = data.map((d: any) => ({
                id: d.id,
                title: d.title,
                category: d.sphere || 'Cultura', // Fallback or map
                uploadDate: new Date(d.upload_date).toLocaleDateString('pt-BR'),
                status: d.status,
                extractedText: d.extracted_text,
                keywords: d.keywords || [],
                publicUrl: d.file_url,
                fileName: d.title + '.pdf', // Mock filename if not stored
                structuredData: d.structured_data
            }));
            setEdicts(typesData);
        }
    };

    const fetchPayments = async () => {
        const { data } = await supabase.from('payments').select('*').order('purchase_date', { ascending: false });
        if (data) setPayments(data);
    };

    // Simulate AI Extraction
    const simulateExtraction = (file: File): Partial<DigitalEdict> => {
        const isFederal = file.name.toLowerCase().includes('federal') || file.name.toLowerCase().includes('minc');

        return {
            title: file.name.replace('.pdf', ''),
            category: isFederal ? 'Patrimônio' : 'Cultura',
            status: 'PROCESSING',
            extractedText: 'EXTRACTED CONTENT...',
            keywords: ['cultura', 'edital', 'fomento', '2024'],
            structuredData: {
                identification: {
                    organ: isFederal ? 'Ministério da Cultura' : 'Secretaria Estadual de Cultura',
                    sphere: isFederal ? 'Federal' : 'Estadual'
                },
                timeline: {
                    registrationStart: '2024-02-01',
                    registrationEnd: '2024-03-15',
                    resultsDate: '2024-04-20',
                    executionPeriod: '12 meses'
                },
                financial: {
                    totalValue: 'R$ 1.500.000,00',
                    maxPerProject: 'R$ 50.000,00'
                },
                eligibility: {
                    participants: 'Pessoa Física e Jurídica (MEI/ME)',
                    requiredDocs: [
                        'RG/CPF dos Proponentes',
                        'Comprovante de Residência (2 anos)',
                        'Portfólio Artístico',
                        'Certidões Negativas (Federal, Estadual, Municipal)',
                        'Planilha Orçamentária Detalhada'
                    ]
                }
            }
        };
    };

    const handleFileUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploading(true);
        setOcrProgress(0);

        // Simulate upload/OCR progress
        const interval = setInterval(() => {
            setOcrProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    completeUpload(file);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const completeUpload = async (file: File) => {
        const extractedData = simulateExtraction(file);

        // Save to Supabase
        const { error } = await supabase.from('edicts').insert({
            title: extractedData.title,
            organ: extractedData.structuredData?.identification.organ,
            sphere: extractedData.structuredData?.identification.sphere,
            status: 'DRAFT', // Starts as draft
            extracted_text: extractedData.extractedText,
            structured_data: extractedData.structuredData,
            keywords: extractedData.keywords
            // file_url: ... in real scenario upload to storage first
        });

        setUploading(false);
        if (error) {
            console.error('Error saving:', error);
            alert('Erro ao salvar no banco de dados.');
        } else {
            fetchEdicts(); // Refresh list
            alert("Digitalização e Extração concluídas com sucesso!");
        }
    };

    const handlePublish = async (id: string) => {
        await supabase.from('edicts').update({ status: 'PUBLISHED' }).eq('id', id);
        fetchEdicts();
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
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
                            <p className="text-xs text-white/50">Painel Master • Auditoria & Extração</p>
                        </div>
                    </div>

                    {/* View Switcher */}
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('EDICTS')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'EDICTS' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                        >
                            Acervo & OCR
                        </button>
                        <button
                            onClick={() => setViewMode('LOGS')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'LOGS' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                        >
                            Logs & Transações
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">

                {viewMode === 'EDICTS' && (
                    <>
                        {/* 1. Ingestão */}
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
                                    <p className="text-white/50 text-sm mb-6">A IA extrairá: Cronograma, Financeiro e Critérios de Elegibilidade.</p>
                                    <label className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors shadow-lg">
                                        Selecionar Arquivo
                                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e.target.files)} />
                                    </label>
                                </div>
                            ) : (
                                <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center h-64 animate-fade-in">
                                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-lg font-bold text-white mb-2">Analisando PDF...</h3>
                                    <p className="text-blue-400 font-mono mb-4">{ocrProgress}% Extraído</p>
                                    <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* 2. Lista */}
                        <section>
                            <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-black/20 border-b border-white/10 text-xs uppercase text-white/50 font-bold">
                                            <th className="p-4">Título</th>
                                            <th className="p-4">Esfera / Órgão</th>
                                            <th className="p-4">Processamento</th>
                                            <th className="p-4 text-right">Auditoria</th>
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
                                                            <p className="text-[10px] text-white/40 font-mono">{edict.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-sm">
                                                        <p className="text-white">{edict.structuredData?.identification.organ}</p>
                                                        <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/60">{edict.structuredData?.identification.sphere}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {edict.status === 'PUBLISHED' ? (
                                                        <span className="text-green-400 text-xs font-bold border border-green-500/30 px-2 py-1 rounded-full bg-green-500/10">PUBLICADO</span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-yellow-500 text-xs font-bold border border-yellow-500/30 px-2 py-1 rounded-full bg-yellow-500/10">RASCUNHO</span>
                                                            <button onClick={() => handlePublish(edict.id)} className="text-xs text-blue-400 underline hover:text-blue-300">Publicar</button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedEdict(edict)}
                                                        className="text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded transition-colors text-white"
                                                    >
                                                        Ver JSON
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {viewMode === 'LOGS' && (
                    <section className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex items-start gap-3">
                            <span className="material-symbols-outlined text-yellow-500">warning</span>
                            <div>
                                <h3 className="font-bold text-yellow-500 text-sm">Controle de Logs Hotmart</h3>
                                <p className="text-sm text-yellow-100/80">
                                    Utilize esta lista para validar acessos de proponentes que relataram Erro 404 após pagamento.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-white/10 text-xs uppercase text-white/50 font-bold">
                                        <th className="p-4">Data</th>
                                        <th className="p-4">Usuário</th>
                                        <th className="p-4">Produto</th>
                                        <th className="p-4">ID Transação</th>
                                        <th className="p-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-white/30">Nenhum log de transação encontrado.</td>
                                        </tr>
                                    ) : payments.map(pay => (
                                        <tr key={pay.id}>
                                            <td className="p-4 text-xs text-white/60">{new Date(pay.purchase_date).toLocaleString()}</td>
                                            <td className="p-4 text-sm font-bold text-white">{pay.user_email}</td>
                                            <td className="p-4 text-sm text-white/80">{pay.product_id}</td>
                                            <td className="p-4 text-xs font-mono text-white/50">{pay.transaction_id}</td>
                                            <td className="p-4 text-right">
                                                <span className="text-green-400 text-xs font-bold">{pay.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* JSON Viewer Modal */}
            {selectedEdict && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-[#0F172A] border border-white/20 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1e293b] rounded-t-2xl">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">data_object</span>
                                Dados Estruturados Extraídos
                            </h3>
                            <button onClick={() => setSelectedEdict(null)} className="text-white/50 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-0 bg-[#0d1117]">
                            <pre className="text-xs font-mono text-green-400 p-6 leading-relaxed">
                                {JSON.stringify(selectedEdict.structuredData, null, 4)}
                            </pre>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-[#1e293b] rounded-b-2xl flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(selectedEdict.structuredData, null, 4));
                                    alert('JSON copiado!');
                                }}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors"
                            >
                                Copiar JSON
                            </button>
                            <button
                                onClick={() => setSelectedEdict(null)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEdictsManager;
