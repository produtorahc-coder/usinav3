import React from 'react';

interface Props {
    onBack: () => void;
    onSelectPlan: (planName: string) => void;
}

const PlansPage: React.FC<Props> = ({ onBack, onSelectPlan }) => {
    return (
        <div className="min-h-screen bg-[#101922] text-white font-sans selection:bg-primary selection:text-white pb-20">
            {/* Header Simples */}
            <header className="sticky top-0 z-50 bg-[#101922]/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-medium">Voltar</span>
                    </button>
                    <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80" 
                        onClick={onBack}
                    >
                        <span className="material-symbols-outlined text-primary">bolt</span>
                        <span className="font-display font-bold text-lg tracking-tight">Usina Cultural</span>
                    </div>
                    <div className="w-20"></div> {/* Spacer for center alignment */}
                </div>
            </header>

            {/* Hero Section */}
            <section className="text-center py-16 px-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                    Investimento na sua Carreira
                </span>
                <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-6">
                    Escolha o plano que acelera sua trajetória
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Desbloqueie ferramentas profissionais, análises ilimitadas de editais e garanta que seus projetos sejam aprovados com mais agilidade.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Plano Pro */}
                    <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                        <h3 className="text-xl font-bold text-white mb-2">Plano Pro</h3>
                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-display font-bold">R$ 97</span>
                            <span className="text-sm text-slate-500 ml-1">/mês</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
                            Ideal para quem está começando ou quer testar a potência da plataforma.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <FeatureItem text="Acesso aos Editais" />
                            <FeatureItem text="1 Portfólio Ativo" />
                            <FeatureItem text="Estruturador Básico" />
                            <FeatureItem text="Suporte por Email" />
                            <FeatureItem text="Sem fidelidade" />
                        </ul>
                        <button onClick={() => onSelectPlan('Pro')} className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors">
                            Começar Agora
                        </button>
                    </div>

                    {/* Plano Elite */}
                    <div className="bg-[#1A365D] border border-primary shadow-2xl shadow-primary/10 rounded-2xl p-8 transform md:-translate-y-4 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                            Mais Popular
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Plano Elite</h3>
                        <div className="flex items-baseline mb-1">
                            <span className="text-4xl font-display font-bold">R$ 797</span>
                            <span className="text-sm text-slate-300 ml-1">/ano</span>
                        </div>
                        <p className="text-xs text-primary font-bold mb-4">Economize R$ 367/ano (Eq. R$ 66/mês)</p>
                        <p className="text-sm text-slate-300 mb-8 pb-8 border-b border-white/10">
                            O favorito dos profissionais sérios. Todas as ferramentas liberadas.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <FeatureItem text="Tudo do Plano Pro" active />
                            <FeatureItem text="Portfólios Ilimitados" active />
                            <FeatureItem text="IA Analisadora Ilimitada" active />
                            <FeatureItem text="Gestão de Equipe (até 3)" active />
                            <FeatureItem text="Exportação PDF Sem Marca" active />
                        </ul>
                        <button onClick={() => onSelectPlan('Elite')} className="w-full py-4 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white transition-colors shadow-lg">
                            Assinar Elite Anual
                        </button>
                    </div>

                    {/* Membro Fundador */}
                    <div className="bg-gradient-to-b from-[#1c1c1e] to-[#0a192f] border border-[#319795]/50 rounded-2xl p-8 hover:border-[#319795] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#319795]/20 blur-2xl rounded-full"></div>
                        <h3 className="text-xl font-bold text-[#319795] mb-2">Membro Fundador</h3>
                        <div className="flex items-baseline mb-4">
                            <span className="text-4xl font-display font-bold">R$ 497</span>
                            <span className="text-sm text-slate-500 ml-1">único</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
                            Oportunidade limitada de lançamento. Invista uma vez, use para sempre.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <FeatureItem text="Acesso VITALÍCIO" highlight />
                            <FeatureItem text="Sem mensalidades nunca" highlight />
                            <FeatureItem text="Badge de Fundador" />
                            <FeatureItem text="Grupo VIP de Networking" />
                            <FeatureItem text="Acesso Antecipado a Betas" />
                        </ul>
                        <button onClick={() => onSelectPlan('Founder')} className="w-full py-4 rounded-xl font-bold border border-[#319795] text-[#319795] hover:bg-[#319795] hover:text-white transition-colors">
                            Tornar-se Fundador
                        </button>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="max-w-5xl mx-auto px-6 mb-24 hidden md:block">
                <h2 className="text-2xl font-display font-bold text-center mb-12">Comparativo de Recursos</h2>
                <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-6 font-bold text-sm text-slate-400 uppercase tracking-wider w-1/3">Recurso</th>
                                <th className="p-6 font-bold text-center w-1/6">Pro</th>
                                <th className="p-6 font-bold text-center text-primary w-1/6">Elite</th>
                                <th className="p-6 font-bold text-center text-[#319795] w-1/6">Fundador</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <TableRow label="Análise de Editais com IA" pro="Limitado (5/mês)" elite="Ilimitado" founder="Ilimitado" />
                            <TableRow label="Geração de Portfólios" pro="1 Ativo" elite="Ilimitados" founder="Ilimitados" />
                            <TableRow label="Exportação PDF" pro="Com Marca d'água" elite="White Label" founder="White Label" />
                            <TableRow label="Gestão de Orçamento" pro={<Check />} elite={<Check />} founder={<Check />} />
                            <TableRow label="Modo Carreira" pro={<Check />} elite={<Check />} founder={<Check />} />
                            <TableRow label="Suporte Prioritário" pro="-" elite={<Check />} founder={<Check />} />
                            <TableRow label="Comunidade VIP" pro="-" elite="-" founder={<Check />} />
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-6">
                <h2 className="text-2xl font-display font-bold text-center mb-12">Perguntas Frequentes</h2>
                <div className="space-y-4">
                    <FaqItem 
                        question="O plano vitalício realmente não tem mensalidade?" 
                        answer="Sim! O plano Membro Fundador é uma oferta única de lançamento. Você paga uma vez e tem acesso à plataforma para sempre, incluindo atualizações futuras do plano base."
                    />
                    <FaqItem 
                        question="Posso cancelar o plano Pro ou Elite?" 
                        answer="Com certeza. O cancelamento pode ser feito a qualquer momento no painel do usuário e você terá acesso até o fim do ciclo pago."
                    />
                    <FaqItem 
                        question="A plataforma serve para Leis de Incentivo?" 
                        answer="Sim. Nossos estruturadores de projeto e planilhas orçamentárias seguem os padrões exigidos pela Lei Rouanet, Paulo Gustavo e ProAC."
                    />
                    <FaqItem 
                        question="Como funciona a garantia?" 
                        answer="Oferecemos 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro sem perguntas."
                    />
                </div>
            </section>
        </div>
    );
};

// Sub-components

const FeatureItem: React.FC<{text: string, active?: boolean, highlight?: boolean}> = ({ text, active, highlight }) => (
    <li className="flex items-center text-sm text-slate-300">
        <span className={`material-symbols-outlined text-lg mr-3 ${highlight ? 'text-[#319795]' : active ? 'text-primary' : 'text-slate-500'}`}>
            check_circle
        </span>
        <span className={highlight ? 'font-bold text-[#319795]' : ''}>{text}</span>
    </li>
);

const Check: React.FC = () => (
    <span className="material-symbols-outlined text-green-500">check</span>
);

const TableRow: React.FC<{label: string, pro: React.ReactNode, elite: React.ReactNode, founder: React.ReactNode}> = ({ label, pro, elite, founder }) => (
    <tr className="hover:bg-white/5 transition-colors">
        <td className="p-6 text-sm font-medium text-slate-300">{label}</td>
        <td className="p-6 text-sm text-center text-slate-400">{pro}</td>
        <td className="p-6 text-sm text-center font-bold text-white">{elite}</td>
        <td className="p-6 text-sm text-center font-bold text-white">{founder}</td>
    </tr>
);

const FaqItem: React.FC<{question: string, answer: string}> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border border-white/10 rounded-xl bg-[#1c1c1e] overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-white">{question}</span>
                <span className={`material-symbols-outlined text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default PlansPage;