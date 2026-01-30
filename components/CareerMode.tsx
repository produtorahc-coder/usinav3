
import React, { useState, useMemo } from 'react';
import { ViewState } from '../types';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

// --- TYPES & DATA STRUCTURES ---

type Difficulty = 'Fácil' | 'Média' | 'Difícil';
type Category = 'História' | 'Leis & Editais' | 'Siglas & Termos' | 'Documentos' | 'Técnico' | 'Prático/Social' | 'Geral';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex: number;
    category: Category;
    difficulty: Difficulty;
    explanation: string; // Feedback educativo
}

interface Mission {
    id: string;
    title: string;
    narrative: string;
    levelRequired: number;
    xpReward: number;
    questions: Question[];
}

interface UserProgress {
    level: number;
    title: string;
    xp: number;
    xpToNext: number;
    completedMissions: string[];
}

// --- CONTENT DATABASE ---

const LEVELS = [
    { lvl: 1, title: "Agente Cultural Local", description: "Seu bairro, centro cultural comunitário.", icon: "home_work" },
    { lvl: 2, title: "Produtor Independente", description: "Pequeno teatro, galeria alternativa.", icon: "theaters" },
    { lvl: 3, title: "Gestor de Projetos", description: "Secretaria de Cultura, editais locais.", icon: "account_balance" },
    { lvl: 4, title: "Diretor Cultural", description: "Instituto cultural, produtora estabelecida.", icon: "business_center" },
    { lvl: 5, title: "Referência Nacional", description: "Palco nacional, ministério, grandes festivais.", icon: "public" },
];

const MISSION_01: Mission = {
    id: 'm1-primeiro-edital',
    title: 'O Teste de Fogo',
    narrative: 'Você está prestes a assumir seu primeiro grande festival. A teoria é linda, mas a prática é cheia de armadilhas. Prove que você domina o "idioletos" da produção e sabe lidar com imprevistos reais.',
    levelRequired: 1,
    xpReward: 850,
    questions: [
        // A. Siglas e Termos Técnicos
        {
            id: 1,
            category: 'Siglas & Termos',
            difficulty: 'Fácil',
            text: "O que significa a sigla ANCINE?",
            options: ["Associação Nacional de Cineastas", "Agência Nacional do Cinema", "Arquivo Nacional de Cinema e Educação", "Agência de Notícias Cine"],
            correctIndex: 1,
            explanation: "ANCINE é a Agência Nacional do Cinema, autarquia responsável por fomentar, regular e fiscalizar a indústria cinematográfica no Brasil."
        },
        {
            id: 2,
            category: 'Técnico',
            difficulty: 'Média',
            text: "No mundo da dança e teatro, o que é o 'Rider Técnico'?",
            options: ["A lista de exigências de camarim e alimentação", "O contrato assinado pelo artista", "O documento que lista as necessidades de som, luz e palco", "O motorista que transporta a equipe"],
            correctIndex: 2,
            explanation: "O Rider Técnico é o manual de instruções do show: mapa de palco, lista de canais de som (input list), iluminação e equipamentos necessários."
        },
        {
            id: 3,
            category: 'Siglas & Termos',
            difficulty: 'Difícil',
            text: "Qual a diferença técnica entre uma OSCIP e uma ONG?",
            options: ["Nenhuma, são sinônimos", "ONG é um termo genérico; OSCIP é uma qualificação jurídica oficial dada pelo Estado", "OSCIP visa lucro, ONG não", "ONG é pública, OSCIP é privada"],
            correctIndex: 1,
            explanation: "ONG é um termo popular. OSCIP (Organização da Sociedade Civil de Interesse Público) é um título jurídico oficial concedido pelo Ministério da Justiça que facilita parcerias."
        },
        
        // B. Marcos Históricos e Leis
        {
            id: 4,
            category: 'História',
            difficulty: 'Média',
            text: "O que foi a Semana de Arte Moderna de 1922?",
            options: ["Uma feira de artesanato no Rio de Janeiro", "Um movimento de ruptura que consolidou o Modernismo no Brasil", "A inauguração do MASP", "Um protesto contra a Lei Rouanet"],
            correctIndex: 1,
            explanation: "Realizada no Theatro Municipal de SP, a Semana de 22 rompeu com o conservadorismo e introduziu a identidade brasileira moderna nas artes."
        },
        {
            id: 5,
            category: 'Leis & Editais',
            difficulty: 'Média',
            text: "Qual o foco principal da Lei Paulo Gustavo para o setor audiovisual?",
            options: ["Construção de cinemas apenas", "Ações emergenciais de fomento devido à pandemia", "Financiamento exclusivo de novelas", "Isenção fiscal para empresas"],
            correctIndex: 1,
            explanation: "A Lei Paulo Gustavo foi criada para mitigar os efeitos da pandemia, injetando recursos diretos em estados e municípios para fomento cultural."
        },

        // C. Vida Real
        {
            id: 6,
            category: 'Prático/Social',
            difficulty: 'Difícil',
            text: "A polícia chegou no seu evento de rua pedindo o alvará, mas o documento físico ficou no escritório. Qual a sua atitude imediata?",
            options: ["Fugir pelos fundos", "Discutir com o policial dizendo que ele não pode parar a arte", "Manter a calma, apresentar o protocolo digital e pedir que aguardem a chegada do físico", "Oferecer dinheiro para liberarem"],
            correctIndex: 2,
            explanation: "A postura profissional é vital. Apresente o protocolo/versão digital no celular, mostre que está legalizado e aja com diplomacia enquanto resolve a logística."
        },
        {
            id: 7,
            category: 'Prático/Social',
            difficulty: 'Média',
            text: "Seu festival gerou 2 toneladas de lixo. Como proceder legalmente para não ser multado e agir eticamente?",
            options: ["Deixar para a prefeitura recolher na rua", "Queimar o lixo em local afastado", "Ter um Plano de Gerenciamento de Resíduos e destinar para cooperativas licenciadas", "Esconder os sacos em caçambas vizinhas"],
            correctIndex: 2,
            explanation: "Grandes eventos são grandes geradores de resíduos. A lei exige a destinação correta (reciclagem/aterro) comprovada via manifesto de transporte (MTR)."
        },

        // D. Documentação
        {
            id: 8,
            category: 'Documentos',
            difficulty: 'Média',
            text: "O que é fundamental para emitir uma CND (Certidão Negativa de Débitos)?",
            options: ["Ter conta no Instagram verificada", "Não possuir dívidas tributárias com o órgão (União, Estado ou Município)", "Ter um contador parente", "Pagar uma taxa extra para o cartório"],
            correctIndex: 1,
            explanation: "A CND prova que você está 'limpo' com o fisco. Se houver dívida ativa ou imposto atrasado, ela não sai."
        },
        {
            id: 9,
            category: 'Documentos',
            difficulty: 'Difícil',
            text: "Quais são os 3 documentos básicos de um proponente (PJ) para assinar contrato público?",
            options: ["Selfie, Comprovante de Residência e RG", "Contrato Social, Cartão CNPJ e Certidões Negativas (Regularidade Fiscal)", "Rider Técnico, Mapa de Palco e Setlist", "Atestado de Antecedentes, Exame de Saúde e Título de Eleitor"],
            correctIndex: 1,
            explanation: "Para contratar com o poder público (PJ), você precisa provar quem você é (Contrato Social/CNPJ) e que está em dia com as obrigações (Certidões)."
        }
    ]
};

const CareerMode: React.FC<Props> = ({ onBack, onNavigate }) => {
    // --- STATE ---
    const [view, setView] = useState<'MAP' | 'MISSION_INTRO' | 'QUIZ' | 'RESULT'>('MAP');
    const [activeTab, setActiveTab] = useState<'CAREER' | 'STUDY'>('CAREER');
    
    // User Stats Mock
    const [user, setUser] = useState<UserProgress>({
        level: 1,
        title: "Agente Cultural Local",
        xp: 350,
        xpToNext: 1200,
        completedMissions: []
    });

    // Gameplay State
    const [activeMission, setActiveMission] = useState<Mission | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

    // --- ACTIONS ---

    const startMission = (mission: Mission) => {
        setActiveMission(mission);
        setCurrentQIndex(0);
        setScore(0);
        setIsAnswered(false);
        setSelectedOption(null);
        setFeedback(null);
        setView('MISSION_INTRO');
    };

    const confirmStart = () => {
        setView('QUIZ');
    };

    const handleAnswer = (index: number) => {
        if (isAnswered || !activeMission) return;
        
        setSelectedOption(index);
        setIsAnswered(true);
        
        const currentQ = activeMission.questions[currentQIndex];
        const isCorrect = index === currentQ.correctIndex;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback('CORRECT');
        } else {
            setFeedback('WRONG');
        }
    };

    const nextQuestion = () => {
        if (!activeMission) return;

        if (currentQIndex < activeMission.questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setFeedback(null);
        } else {
            finishMission();
        }
    };

    const finishMission = () => {
        if (!activeMission) return;
        
        // Calculate Rewards - Passa se acertar 60%
        const passed = score >= Math.ceil(activeMission.questions.length * 0.6); 
        
        if (passed && !user.completedMissions.includes(activeMission.id)) {
            const newXp = user.xp + activeMission.xpReward;
            // Simple level up logic
            let newLevel = user.level;
            let newTitle = user.title;
            if (newXp >= user.xpToNext && user.level < 5) {
                newLevel += 1;
                newTitle = LEVELS[newLevel - 1].title;
            }

            setUser(prev => ({
                ...prev,
                xp: newXp,
                level: newLevel,
                title: newTitle,
                completedMissions: [...prev.completedMissions, activeMission.id]
            }));
        }
        
        setView('RESULT');
    };

    // --- RENDERERS ---

    const renderHeader = () => (
        <div className="bg-[#1c1c1e] border-b border-white/10 p-4 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">sports_esports</span>
                            Modo Carreira
                        </h1>
                        <p className="text-xs text-white/50">Nível {user.level}: {user.title}</p>
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

                    {/* XP Bar */}
                    <div className="hidden md:flex flex-col w-48 gap-1">
                        <div className="flex justify-between text-[10px] font-bold text-white/70">
                            <span>XP: {user.xp}</span>
                            <span>{user.xpToNext}</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-yellow-500 transition-all duration-500" 
                                style={{ width: `${Math.min((user.xp / user.xpToNext) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMap = () => (
        <div className="flex-1 max-w-5xl mx-auto w-full p-6 animate-fade-in">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-[#1c1c1e] p-1 rounded-xl border border-white/10 flex">
                    <button 
                        onClick={() => setActiveTab('CAREER')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'CAREER' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        Jornada
                    </button>
                    <button 
                        onClick={() => setActiveTab('STUDY')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'STUDY' ? 'bg-primary text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        Estudo Livre
                    </button>
                </div>
            </div>

            {activeTab === 'CAREER' ? (
                <div className="relative space-y-8 pl-8 md:pl-0">
                    {/* Timeline Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-white/10 -translate-x-1/2 hidden md:block"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 md:hidden"></div>

                    {LEVELS.map((level, index) => {
                        const isLocked = user.level < level.lvl;
                        const isCurrent = user.level === level.lvl;
                        const alignLeft = index % 2 === 0;

                        return (
                            <div key={level.lvl} className={`relative md:flex items-center justify-between group ${alignLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                                
                                {/* Timeline Node */}
                                <div className={`absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-all ${isLocked ? 'bg-[#121212] border-white/20 text-white/20' : isCurrent ? 'bg-primary border-primary shadow-[0_0_20px_rgba(242,127,13,0.5)] scale-110' : 'bg-green-500 border-green-500 text-white'}`}>
                                    {isLocked ? (
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                    ) : isCurrent ? (
                                        <span className="material-symbols-outlined text-sm text-white animate-pulse">star</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">check</span>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className={`ml-8 md:ml-0 md:w-[45%] bg-[#1c1c1e] border ${isCurrent ? 'border-primary' : 'border-white/5'} rounded-2xl p-6 relative hover:bg-[#252527] transition-all ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/50'}`}>
                                            <span className="material-symbols-outlined text-2xl">{level.icon}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Nível {level.lvl}</span>
                                            <h3 className="text-xl font-bold text-white">{level.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/60 mb-4">{level.description}</p>
                                    
                                    {/* Mission Slot */}
                                    {level.lvl === 1 && (
                                        <button 
                                            onClick={() => startMission(MISSION_01)}
                                            disabled={isLocked}
                                            className="w-full bg-[#121212] border border-white/10 hover:border-primary/50 rounded-xl p-3 flex items-center justify-between group/mission transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm">flag</span>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-white group-hover/mission:text-primary transition-colors">{MISSION_01.title}</p>
                                                    <p className="text-[10px] text-white/40">Recompensa: {MISSION_01.xpReward} XP</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-white/30 group-hover/mission:translate-x-1 transition-transform">arrow_forward_ios</span>
                                        </button>
                                    )}

                                    {level.lvl > 1 && (
                                        <div className="text-center p-3 border border-dashed border-white/10 rounded-xl text-xs text-white/30">
                                            Missões em desenvolvimento...
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:block w-[45%]"></div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Free Study Categories */}
                    {['História', 'Leis & Editais', 'Siglas & Termos', 'Documentos', 'Técnico'].map((cat, idx) => (
                        <button key={idx} className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-6 text-left hover:border-primary/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <span className="bg-white/5 text-white/40 text-[10px] font-bold px-2 py-1 rounded">Quiz Rápido</span>
                            </div>
                            <h3 className="font-bold text-lg text-white mb-1">{cat}</h3>
                            <p className="text-xs text-white/50">Treine seus conhecimentos específicos nesta categoria.</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const renderMissionIntro = () => {
        if (!activeMission) return null;
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in max-w-2xl mx-auto text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                    <span className="material-symbols-outlined text-5xl text-primary">flag</span>
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">{activeMission.title}</h2>
                <div className="bg-[#1c1c1e] border border-white/10 p-6 rounded-2xl mb-8 text-left">
                    <p className="text-lg text-white/80 leading-relaxed font-serif italic">"{activeMission.narrative}"</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setView('MAP')} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white font-bold">
                        Voltar
                    </button>
                    <button 
                        onClick={confirmStart}
                        className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/30 transform hover:scale-105 transition-all"
                    >
                        Começar Desafio
                    </button>
                </div>
            </div>
        );
    };

    const renderQuiz = () => {
        if (!activeMission) return null;
        const question = activeMission.questions[currentQIndex];

        return (
            <div className="flex-1 max-w-3xl mx-auto w-full p-6 flex flex-col justify-center animate-slide-up">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-white/50 mb-2 uppercase font-bold tracking-wider">
                        <span>Questão {currentQIndex + 1} de {activeMission.questions.length}</span>
                        <span>{question.category} • {question.difficulty}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((currentQIndex + 1) / activeMission.questions.length) * 100}%` }}></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl">quiz</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug relative z-10">
                        {question.text}
                    </h3>
                    
                    <div className="space-y-3 relative z-10">
                        {question.options.map((option, idx) => {
                            let statusClass = 'border-white/10 hover:bg-white/5';
                            if (isAnswered) {
                                if (idx === question.correctIndex) statusClass = 'border-green-500 bg-green-500/20 text-green-400';
                                else if (idx === selectedOption) statusClass = 'border-red-500 bg-red-500/20 text-red-400';
                                else statusClass = 'border-white/5 opacity-50';
                            } else if (selectedOption === idx) {
                                statusClass = 'border-primary bg-primary/20';
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={isAnswered}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200 ${statusClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold opacity-70">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {option}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback & Navigation */}
                {isAnswered && (
                    <div className="animate-fade-in">
                        <div className={`p-4 rounded-xl border mb-6 ${feedback === 'CORRECT' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <div className="flex items-center gap-2 mb-2 font-bold">
                                <span className="material-symbols-outlined">
                                    {feedback === 'CORRECT' ? 'check_circle' : 'cancel'}
                                </span>
                                <span className={feedback === 'CORRECT' ? 'text-green-400' : 'text-red-400'}>
                                    {feedback === 'CORRECT' ? 'Resposta Correta!' : 'Resposta Incorreta'}
                                </span>
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">
                                {question.explanation}
                            </p>
                        </div>
                        <button 
                            onClick={nextQuestion}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            {currentQIndex < activeMission.questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Missão'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderResult = () => {
        if (!activeMission) return null;
        // Aprova com 60% de acerto
        const minCorrect = Math.ceil(activeMission.questions.length * 0.6);
        const passed = score >= minCorrect;

        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in text-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 ${passed ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
                    <span className="material-symbols-outlined text-6xl">
                        {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
                    </span>
                </div>

                <h2 className="text-3xl font-bold mb-2">
                    {passed ? 'Missão Cumprida!' : 'Tente Novamente'}
                </h2>
                <p className="text-white/60 mb-8 max-w-md">
                    {passed 
                        ? `Excelente! Você acertou ${score} de ${activeMission.questions.length} perguntas e avançou na sua carreira.` 
                        : `Você acertou ${score} de ${activeMission.questions.length}. É necessário acertar pelo menos ${minCorrect} para avançar.`}
                </p>

                {passed && (
                    <div className="bg-[#1c1c1e] border border-white/10 rounded-xl p-6 mb-8 w-full max-w-sm flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-xs text-white/50 uppercase font-bold">Recompensa</p>
                            <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                                +{activeMission.xpReward} <span className="text-xs">XP</span>
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-white/50 uppercase font-bold">Status</p>
                             <p className="text-green-500 font-bold">Aprovado</p>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setView('MAP')}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                >
                    Voltar ao Mapa
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#101012] text-white font-sans flex flex-col">
            {renderHeader()}
            
            {view === 'MAP' && renderMap()}
            {view === 'MISSION_INTRO' && renderMissionIntro()}
            {view === 'QUIZ' && renderQuiz()}
            {view === 'RESULT' && renderResult()}
        </div>
    );
};

export default CareerMode;
