
import React, { useState } from 'react';
import { ViewState } from '../types';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

// Interfaces para Artigos Ricos (Nível 1)
interface RichArticle {
    id: string;
    title: string;
    summary: string;
    steps: string[];
    example: {
        context: string;
        text: string;
        analysis: string;
    };
    commonError: string;
    nextStepLabel: string;
}

interface Category {
    title: string;
    icon: string;
    articles: RichArticle[];
}

// Dados da Base de Conhecimento (Nível 1)
const KNOWLEDGE_BASE: Category[] = [
    {
        title: "Conceito e Escrita",
        icon: "edit_note",
        articles: [
            {
                id: "art-01",
                title: "Como escrever uma justificativa convincente?",
                summary: "A justificativa é a 'venda' do seu projeto. É onde você convence o avaliador de que sua ideia não só merece, mas PRECISA existir agora.",
                steps: [
                    "Identifique o Problema: Qual lacuna cultural ou social você resolve?",
                    "Apresente a Solução: Como seu projeto preenche essa lacuna.",
                    "Demonstre Relevância: Por que agora? Por que você?",
                    "Use Dados: Se possível, cite estatísticas do IBGE ou dados locais."
                ],
                example: {
                    context: "Projeto de Cinema Itinerante",
                    text: "\"O bairro X possui 50 mil habitantes e nenhuma sala de cinema. O projeto CineRua visa democratizar o acesso à sétima arte...\"",
                    analysis: "Bom uso do dado demográfico (50 mil habitantes) contrastado com a escassez (nenhuma sala)."
                },
                commonError: "Escrever uma justificativa genérica como 'Levar cultura para todos' sem especificar quem, onde e porquê.",
                nextStepLabel: "Ir para Objetivos"
            },
            {
                id: "art-02",
                title: "Definindo o Público-Alvo sem 'Achismo'",
                summary: "Não existe 'público geral'. Projetos aprovados sabem exatamente com quem estão falando.",
                steps: [
                    "Recorte Demográfico: Idade, Gênero, Classe Social.",
                    "Recorte Geográfico: Bairro, Cidade, Região.",
                    "Comportamento: O que consomem? Onde estão na internet?",
                    "Acessibilidade: Como você garante que eles cheguem até você?"
                ],
                example: {
                    context: "Festival de Trap",
                    text: "\"Jovens de 16 a 24 anos, residentes nas zonas Norte e Leste, usuários ativos de TikTok, classes C e D.\"",
                    analysis: "Específico e acionável para o plano de mídia."
                },
                commonError: "Colocar 'Livre para todos os públicos' (classificação indicativa) achando que isso é definição de público-alvo.",
                nextStepLabel: "Ir para Plano de Mídia"
            }
        ]
    },
    {
        title: "Orçamento e Finanças",
        icon: "attach_money",
        articles: [
            {
                id: "art-03",
                title: "5 Passos para um Orçamento sem Furos",
                summary: "O orçamento é onde a maioria dos projetos é reprovada tecnicamente. Coerência é a chave.",
                steps: [
                    "Cote tudo antes: Não chute valores.",
                    "Separe por Etapas: Pré-produção, Produção, Pós-produção.",
                    "Impostos e Taxas: Lembre-se do INSS, ISS e taxas bancárias.",
                    "Custos Administrativos: Contador, captador e coordenação."
                ],
                example: {
                    context: "Rubrica de Cachê",
                    text: "\"Cachê Artista Principal: R$ 10.000,00 (Valor de mercado compatível com portfólio anexo)\"",
                    analysis: "Sempre justifique valores altos com comprovação de mercado."
                },
                commonError: "Esquecer de prever a verba de Assessoria de Imprensa e Design, sobrecarregando a produção.",
                nextStepLabel: "Ir para Planilha Orçamentária"
            }
        ]
    },
    {
        title: "Jurídico e Prestação de Contas",
        icon: "gavel",
        articles: [
            {
                id: "art-04",
                title: "Documentação Obrigatória: O Checklist",
                summary: "Não seja inabilitado por falta de um PDF. A burocracia é a primeira peneira.",
                steps: [
                    "Portfólio Comprobatório (Clipping, Links).",
                    "Cartas de Anuência (Equipe e Locais).",
                    "Certidões Negativas (Receita, FGTS, Trabalhista).",
                    "Ficha Técnica detalhada."
                ],
                example: {
                    context: "Carta de Anuência",
                    text: "\"Declaro para os devidos fins que estou ciente e de acordo em participar do projeto X na função Y...\"",
                    analysis: "Simples e direta. Deve ser assinada pelo titular."
                },
                commonError: "Enviar certidões vencidas. Sempre emita novas no dia do envio do projeto.",
                nextStepLabel: "Ir para Módulo de Documentos"
            }
        ]
    }
];

const SupportCenter: React.FC<Props> = ({ onBack, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArticle, setSelectedArticle] = useState<RichArticle | null>(null);
    const [ticketCategory, setTicketCategory] = useState<string>('');
    const [ticketMessage, setTicketMessage] = useState('');
    const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);

    // Filter Logic for Level 1
    const filteredCategories = KNOWLEDGE_BASE.map(cat => ({
        ...cat,
        articles: cat.articles.filter(art => 
            art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            art.summary.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.articles.length > 0);

    const handleSendTicket = () => {
        if (!ticketCategory) return alert("Selecione uma categoria.");
        if (!ticketMessage) return alert("Descreva seu problema.");
        
        alert(`Ticket #${Math.floor(Math.random() * 9000) + 1000} criado com sucesso!\n\nCategoria: ${ticketCategory}\n\nEntraremos em contato em breve.`);
        setTicketCategory('');
        setTicketMessage('');
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
            {/* Header */}
            <header className="bg-[#1c1c1e] border-b border-white/5 p-4 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                                Central de Suporte
                            </h1>
                            <p className="text-xs text-white/50">Base de Conhecimento • Tickets • Mentoria</p>
                        </div>
                    </div>
                    
                    {/* Dashboard Button */}
                    <button 
                        onClick={() => onNavigate(ViewState.DASHBOARD)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        title="Ir para Dashboard"
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-12 pb-24">
                
                {/* LEVEL 1: SEARCH & KNOWLEDGE BASE */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Como podemos ajudar?</h2>
                        <p className="text-white/50">Pesquise nossa base de conhecimento gerada por especialistas.</p>
                    </div>
                    
                    <div className="relative max-w-2xl mx-auto mb-10 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Ex: 'como fazer orçamento', 'justificativa', 'público alvo'..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#121212] border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-xl"
                            />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50">search</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((cat, idx) => (
                            <div key={idx} className="bg-[#1c1c1e] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                                    <h3 className="font-bold">{cat.title}</h3>
                                </div>
                                <div className="p-2">
                                    {cat.articles.map(article => (
                                        <button 
                                            key={article.id}
                                            onClick={() => setSelectedArticle(article)}
                                            className="w-full text-left p-3 hover:bg-white/5 rounded-lg flex items-start gap-2 transition-colors group"
                                        >
                                            <span className="material-symbols-outlined text-sm text-white/30 mt-0.5 group-hover:text-primary">article</span>
                                            <div>
                                                <p className="text-sm font-medium text-white/90 group-hover:text-primary transition-colors">{article.title}</p>
                                                {/*<p className="text-xs text-white/40 line-clamp-1">{article.summary}</p>*/}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                {/* LEVEL 2: TICKET SYSTEM */}
                <section className="bg-[#151517] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-9xl">confirmation_number</span>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase mb-4">
                                Nível 2: Suporte Técnico
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Não encontrou o que precisava?</h2>
                            <p className="text-white/60 mb-6">Abra um chamado direto com nossa equipe de suporte. Respondemos em até 24h úteis.</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {['Erro Técnico', 'Dúvida Financeira', 'Problema com PDF', 'Sugestão'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setTicketCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm border transition-all text-left ${ticketCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-white/10 text-white/60 hover:border-white/30'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            
                            {ticketCategory && (
                                <div className="animate-fade-in space-y-3">
                                    <textarea 
                                        placeholder={`Descreva seu problema com ${ticketCategory}...`}
                                        className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none text-white resize-none"
                                        value={ticketMessage}
                                        onChange={(e) => setTicketMessage(e.target.value)}
                                    ></textarea>
                                    <button 
                                        onClick={handleSendTicket}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-900/20 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                        Enviar Ticket
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Visual Help */}
                        <div className="hidden md:block w-72 bg-[#1c1c1e] rounded-xl p-4 border border-white/5">
                            <h4 className="font-bold text-sm mb-3 text-white/80">Status dos Seus Tickets</h4>
                            <div className="space-y-3">
                                <TicketStatus id="#4921" subject="Erro no upload de imagem" status="Resolvido" date="Há 2 dias" />
                                <TicketStatus id="#4988" subject="Dúvida sobre plano Pro" status="Em Análise" date="Hoje" active />
                            </div>
                        </div>
                    </div>
                </section>

                {/* LEVEL 3: MENTORSHIP */}
                <section className="bg-gradient-to-br from-primary/10 to-[#1c1c1e] border border-primary/20 rounded-2xl p-8 text-center md:text-left relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary text-primary text-xs font-bold uppercase mb-4">
                                Nível 3: Mentoria Premium
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Precisa de um olhar humano experiente?</h2>
                            <p className="text-white/70 max-w-xl">
                                Agende uma sessão de 30 minutos com produtores seniores para destravar seu projeto. Exclusivo para assinantes Elite e Fundadores.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsMentorshipModalOpen(true)}
                            className="bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(242,127,13,0.3)] transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined">calendar_month</span>
                            Agendar Mentoria
                        </button>
                     </div>
                </section>

            </main>

            {/* MODAL DE ARTIGO RICO (NÍVEL 1) */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedArticle(null)} />
                    <div className="relative w-full max-w-3xl bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-[#151517] flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white leading-tight mb-2">{selectedArticle.title}</h2>
                                <p className="text-white/60 text-sm">{selectedArticle.summary}</p>
                            </div>
                            <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            
                            {/* Steps */}
                            <div>
                                <h3 className="text-primary font-bold uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">format_list_numbered</span>
                                    Passo a Passo
                                </h3>
                                <ul className="space-y-4">
                                    {selectedArticle.steps.map((step, i) => (
                                        <li key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center border border-primary/30">
                                                {i + 1}
                                            </span>
                                            <span className="text-white/90 text-sm leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Example Block */}
                            <div className="bg-[#151517] border border-white/10 rounded-xl overflow-hidden">
                                <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/50 uppercase">Exemplo Prático: {selectedArticle.example.context}</span>
                                    <span className="material-symbols-outlined text-white/20 text-sm">lightbulb</span>
                                </div>
                                <div className="p-6">
                                    <blockquote className="border-l-4 border-primary pl-4 italic text-white/80 mb-4 font-serif text-lg">
                                        {selectedArticle.example.text}
                                    </blockquote>
                                    <p className="text-xs text-green-400 font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Por que funciona: {selectedArticle.example.analysis}
                                    </p>
                                </div>
                            </div>

                            {/* Common Error */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-4 items-start">
                                <span className="material-symbols-outlined text-red-500 mt-1">warning</span>
                                <div>
                                    <h4 className="font-bold text-red-400 text-sm uppercase mb-1">Erro Comum</h4>
                                    <p className="text-sm text-red-100/80">{selectedArticle.commonError}</p>
                                </div>
                            </div>

                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-white/10 bg-[#151517] flex justify-end">
                            <button 
                                onClick={() => {
                                    setSelectedArticle(null);
                                    // Here you would navigate
                                }} 
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                            >
                                <span>{selectedArticle.nextStepLabel}</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MENTORSHIP MODAL MOCKUP */}
            {isMentorshipModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMentorshipModalOpen(false)} />
                    <div className="relative bg-[#1c1c1e] p-8 rounded-2xl max-w-sm w-full text-center border border-primary">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Recurso Premium</h3>
                        <p className="text-white/60 mb-6 text-sm">
                            As mentorias são exclusivas para assinantes do plano Elite ou Membros Fundadores. Faça o upgrade para desbloquear.
                        </p>
                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl mb-3">
                            Ver Planos
                        </button>
                        <button onClick={() => setIsMentorshipModalOpen(false)} className="text-white/40 text-sm hover:text-white">
                            Voltar
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

const TicketStatus: React.FC<{id: string, subject: string, status: string, date: string, active?: boolean}> = ({ id, subject, status, date, active }) => (
    <div className={`p-3 rounded-lg border flex justify-between items-center ${active ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-white/30">{id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${status === 'Resolvido' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {status}
                </span>
            </div>
            <p className="text-xs font-bold text-white/90">{subject}</p>
        </div>
        <span className="text-[10px] text-white/40">{date}</span>
    </div>
);

export default SupportCenter;
