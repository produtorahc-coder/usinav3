
import React, { useState } from 'react';

interface Props {
    onComplete: (data: { roles: string[], segments: string[] }) => void;
}

// Lista de Perfis (Step 1)
const ROLES = [
    { id: 'artista', label: 'Artista / Criativo', desc: 'Ator, Músico, Artista Plástico...', icon: 'palette' },
    { id: 'produtor', label: 'Produtor Cultural / Gestor', desc: 'Produção Executiva, Gestão de Projetos...', icon: 'business_center' },
    { id: 'tecnico', label: 'Técnico de Espetáculo', desc: 'Luz, Som, Palco, Montagem, Roadie...', icon: 'settings' },
    { id: 'servico', label: 'Prestador de Serviço', desc: 'Contabilidade, Jurídico, Transporte...', icon: 'handshake' },
    { id: 'educador', label: 'Educador / Oficineiro', desc: 'Workshops, Aulas, Palestras...', icon: 'school' },
    { id: 'curador', label: 'Curador / Parecerista', desc: 'Seleção artística, Análise de editais...', icon: 'verified' },
];

// Lista Expandida de Segmentos (Step 2)
const SEGMENTS = [
    { id: 'musica', label: 'Música', desc: 'Erudita, Popular, DJ, Instrumentista', icon: 'music_note' },
    { id: 'artes_cenicas', label: 'Artes Cênicas', desc: 'Teatro, Dança, Circo, Performance', icon: 'theater_comedy' },
    { id: 'artes_visuais', label: 'Artes Visuais', desc: 'Pintura, Escultura, Fotografia, Design', icon: 'brush' },
    { id: 'audiovisual', label: 'Audiovisual', desc: 'Cinema, TV, Streaming, Documentário', icon: 'movie' },
    { id: 'literatura', label: 'Literatura', desc: 'Poesia, Romance, Crônica, Dramaturgia', icon: 'menu_book' },
    { id: 'patrimonio', label: 'Patrimônio Cultural', desc: 'Museus, Arquivos, Restauração', icon: 'account_balance' },
    { id: 'culturas_populares', label: 'Culturas Populares', desc: 'Folclore, Festas Tradicionais, Artesanato', icon: 'celebration' },
    { id: 'games', label: 'Games & Interatividade', desc: 'Jogos Digitais, Realidade Virtual', icon: 'sports_esports' },
];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleRole = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(r => r !== roleId)
                : [...prev, roleId]
        );
        setError(null);
    };

    const toggleSegment = (segmentId: string) => {
        setSelectedSegments(prev =>
            prev.includes(segmentId)
                ? prev.filter(s => s !== segmentId)
                : [...prev, segmentId]
        );
        setError(null);
    };

    const handleNext = () => {
        if (selectedRoles.length === 0) {
            setError('Por favor, selecione pelo menos um perfil.');
            return;
        }
        setStep(2);
        setError(null);
    };

    const handleBack = () => {
        setStep(1);
        setError(null);
    };

    const handleComplete = async () => {
        if (selectedSegments.length === 0) {
            setError('Por favor, selecione pelo menos um segmento.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simula salvamento (pode ser substituído por chamada API)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Chama o callback com os dados
            onComplete({
                roles: selectedRoles,
                segments: selectedSegments
            });
        } catch (err) {
            setIsLoading(false);
            setError('Erro ao salvar seus dados. Por favor, tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Bem-vindo à <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Usina Cultural</span>
                    </h1>
                    <p className="text-white/60 text-lg">
                        {step === 1 ? 'Conte-nos sobre você' : 'Quais são suas áreas de atuação?'}
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className={`h-2 w-20 rounded-full transition-all ${step >= 1 ? 'bg-purple-500' : 'bg-white/20'}`} />
                    <div className={`h-2 w-20 rounded-full transition-all ${step >= 2 ? 'bg-purple-500' : 'bg-white/20'}`} />
                </div>

                {/* Content Card */}
                <div className="bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                    {/* Step 1: Perfis */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Selecione seu(s) perfil(is)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {ROLES.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => toggleRole(role.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedRoles.includes(role.id)
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-purple-400 text-3xl">
                                                {role.icon}
                                            </span>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1">{role.label}</h3>
                                                <p className="text-white/60 text-sm">{role.desc}</p>
                                            </div>
                                            {selectedRoles.includes(role.id) && (
                                                <span className="material-symbols-outlined text-purple-400">check_circle</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50"
                            >
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* Step 2: Segmentos */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Selecione seu(s) segmento(s)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {SEGMENTS.map(segment => (
                                    <button
                                        key={segment.id}
                                        onClick={() => toggleSegment(segment.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedSegments.includes(segment.id)
                                                ? 'border-pink-500 bg-pink-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-pink-400 text-3xl">
                                                {segment.icon}
                                            </span>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1">{segment.label}</h3>
                                                <p className="text-white/60 text-sm">{segment.desc}</p>
                                            </div>
                                            {selectedSegments.includes(segment.id) && (
                                                <span className="material-symbols-outlined text-pink-400">check_circle</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Salvando...
                                        </>
                                    ) : (
                                        'Salvar e Continuar'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="text-center mt-6 text-white/40 text-sm">
                    Você poderá editar essas informações depois no seu perfil
                </div>
            </div>
        </div>
    );
};

export default Onboarding;