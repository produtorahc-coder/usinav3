import React, { useState, useEffect } from 'react';
import { ViewState, DigitalEdict } from '../types';
import { supabase } from '../supabaseClient';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

type AnalysisStatus = 'IDLE' | 'PROCESSING' | 'COMPLETE';

const EditalAnalyzer: React.FC<Props> = ({ onBack, onNavigate }) => {
    const [status, setStatus] = useState<AnalysisStatus>('IDLE');
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [currentEdict, setCurrentEdict] = useState<DigitalEdict | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'APPROVED' | 'PENDING' | 'NONE'>('NONE');

    // Fetch latest edict for demo purposes
    useEffect(() => {
        const fetchLatestEdict = async () => {
            const { data } = await supabase.from('edicts').select('*').order('created_at', { ascending: false }).limit(1).single();
            if (data) {
                setCurrentEdict({
                    id: data.id,
                    title: data.title,
                    category: data.sphere || 'Cultura',
                    uploadDate: new Date(data.upload_date).toLocaleDateString('pt-BR'),
                    status: data.status,
                    extractedText: data.extracted_text,
                    keywords: data.keywords || [],
                    fileName: data.title + '.pdf',
                    structuredData: data.structured_data
                });
            }
        };

        const checkPayment = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('payments').select('status').eq('user_email', user.email).single();
                if (data) setPaymentStatus(data.status);
            } else {
                // Mock for demo if no auth
                setPaymentStatus('APPROVED');
            }
        };

        fetchLatestEdict();
        checkPayment();
    }, []);

    // Simulação do Processamento da IA
    useEffect(() => {
        if (status === 'PROCESSING') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('COMPLETE');
                        return 100;
                    }
                    return prev + Math.floor(Math.random() * 15);
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [status]);

    const handleFileSelect = () => {
        setStatus('PROCESSING');
        setProgress(0);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect();
    };

    return (
        <div className="min-h-screen bg-[#101922] text-white font-sans flex flex-col pb-24 md:pb-0">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-white/10 bg-[#101922] sticky top-0 z-30">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                </button>
                <h2 className="flex-1 text-center font-bold text-lg">Analisador de Editais</h2>

                {/* Hotmart Status Badge */}
                <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${paymentStatus === 'APPROVED' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                    title={paymentStatus === 'APPROVED' ? 'Acesso Premium Liberado via Hotmart' : 'Pagamento Pendente'}
                >
                    <span className="material-symbols-outlined text-sm">{paymentStatus === 'APPROVED' ? 'verified' : 'lock'}</span>
                    {paymentStatus === 'APPROVED' ? 'Premium Ativo' : 'Acesso Limitado'}
                </div>
            </div>

            <main className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-6">

                {/* 1. Área de Upload */}
                {status === 'IDLE' && (
                    <div
                        className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 h-80 ${dragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-white/10 bg-[#1c1c1e]'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="w-16 h-16 bg-[#252527] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <span className="material-symbols-outlined text-3xl text-blue-500">upload_file</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Carregar Edital (PDF)</h3>
                        <p className="text-sm text-white/50 mb-8 max-w-xs">
                            Arraste ou selecione o arquivo do edital cultural para análise da Usina IA
                        </p>
                        <button
                            onClick={handleFileSelect}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            Selecionar Arquivo
                        </button>
                    </div>
                )}

                {/* 2. Processamento */}
                {(status === 'PROCESSING' || status === 'COMPLETE') && (
                    <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 shadow-xl animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                {status === 'PROCESSING' ? (
                                    <span className="material-symbols-outlined text-blue-500 animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                )}
                                {status === 'PROCESSING' ? 'Processamento em tempo real' : 'Análise Concluída'}
                            </h3>
                            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/30 uppercase tracking-wide">
                                IA Ativa
                            </span>
                        </div>

                        <div className="mb-2 flex justify-between items-end">
                            <span className="text-xs text-blue-400 font-medium">
                                {status === 'PROCESSING' ? 'Escaneando regras e critérios...' : 'Extração finalizada'}
                            </span>
                            <span className="text-sm font-bold text-blue-400">{progress}%</span>
                        </div>

                        <div className="h-2 w-full bg-[#121212] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* 3. Resultados Estruturados (Visão do Proponente) */}
                {progress > 50 && (
                    <div className="space-y-6 animate-slide-up">

                        {/* Timeline Alert (Only pertinent ones) */}
                        {currentEdict?.structuredData?.timeline && (
                            <div className="bg-[#1a1500] border border-orange-500/30 rounded-2xl p-5 relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <span className="material-symbols-outlined text-orange-500 text-2xl mt-1">event_busy</span>
                                    <div>
                                        <h4 className="font-bold text-orange-500 text-sm uppercase mb-1">Atenção ao Cronograma</h4>
                                        <p className="text-sm text-orange-100/80">
                                            As inscrições encerram em <strong className="text-white">{new Date(currentEdict.structuredData.timeline.registrationEnd).toLocaleDateString()}</strong>.
                                            Faltam apenas 15 dias!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Checklist de Sucesso */}
                        <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                                <span className="material-symbols-outlined text-green-400">checklist</span>
                                <h3 className="font-bold text-lg text-white">Checklist Documental</h3>
                            </div>

                            <ul className="space-y-3">
                                {currentEdict?.structuredData?.eligibility.requiredDocs.map((doc, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 group hover:text-white transition-colors cursor-pointer">
                                        <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center mt-0.5 group-hover:border-blue-500 transition-colors">
                                            {/* Mock checkbox state */}
                                        </div>
                                        <span>{doc}</span>
                                    </li>
                                )) || (
                                        <p className="text-white/50 text-sm italic">Nenhum documento listado. Aguarde o processamento.</p>
                                    )}
                            </ul>
                        </div>

                        {/* Financial Insight */}
                        {currentEdict?.structuredData && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1c1c1e] border border-white/5 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Valor Total</p>
                                    <p className="text-lg font-bold text-green-400">{currentEdict.structuredData.financial.totalValue}</p>
                                </div>
                                <div className="bg-[#1c1c1e] border border-white/5 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Máx. por Projeto</p>
                                    <p className="text-lg font-bold text-white">{currentEdict.structuredData.financial.maxPerProject}</p>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </main>

            {/* Footer Action Button */}
            {status === 'COMPLETE' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#101922]/90 backdrop-blur-md border-t border-white/10 z-40 animate-slide-up">
                    <div className="max-w-2xl mx-auto">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
                            onClick={onBack}
                        >
                            <span className="material-symbols-outlined">add_link</span>
                            Vincular ao Meu Projeto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditalAnalyzer;
