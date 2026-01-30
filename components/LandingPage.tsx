import React, { useState } from 'react';
import { ViewState } from '../types';

interface LandingPageProps {
    onNavigate: (view: ViewState) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');

    const handleLogin = () => {
        onNavigate(ViewState.ORBIT);
    };

    const handleCta = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#1A365D] text-white selection:bg-[#319795] selection:text-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#1A365D]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div 
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.location.reload()}
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">bolt</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">Usina Cultural</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#planos" className="hidden md:block text-sm font-semibold text-white/80 hover:text-[#319795] transition-colors">Planos</a>
                        <button 
                            onClick={handleLogin}
                            className="text-sm font-bold text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </header>

            {/* SECTION 1: HERO */}
            <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#319795]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Hero Content */}
                    <div className="text-center lg:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#319795]/10 border border-[#319795]/30 text-[#319795] text-xs font-bold uppercase tracking-widest mb-6">
                            Plataforma de Gestão Cultural
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6">
                            Transforme Sua Ideia Cultural em um <span className="text-primary">Projeto Financiado.</span>
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                            A primeira plataforma que integra criação, gestão, análise de editais e captação. Do portfólio à prestação de contas, simplifique a burocracia e foque na arte.
                        </p>
                        
                        {/* Hero CTA Form */}
                        <form onSubmit={handleCta} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                            <input 
                                type="email" 
                                placeholder="Seu melhor e-mail profissional" 
                                className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#319795] transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95 whitespace-nowrap"
                            >
                                Começar Teste Grátis
                            </button>
                        </form>
                        <p className="mt-3 text-xs text-slate-400">Teste de 7 dias sem compromisso. Cancele quando quiser.</p>
                    </div>

                    {/* Hero Visual (Dashboard Preview) */}
                    <div className="relative mt-10 lg:mt-0 perspective-1000">
                        <div className="relative bg-[#0F213A] border border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 transform lg:rotate-y-6 lg:rotate-x-2 transition-transform duration-500 hover:rotate-0">
                            {/* Fake Dashboard Header */}
                            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                                </div>
                                <div className="h-2 w-20 bg-white/10 rounded-full"/>
                            </div>
                            {/* Fake Dashboard Content */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#1A365D] p-4 rounded-xl border-l-4 border-[#319795]">
                                    <div className="h-2 w-12 bg-[#319795]/30 rounded mb-2"/>
                                    <div className="h-6 w-24 bg-white/20 rounded"/>
                                </div>
                                <div className="bg-[#1A365D] p-4 rounded-xl border-l-4 border-primary">
                                    <div className="h-2 w-12 bg-primary/30 rounded mb-2"/>
                                    <div className="h-6 w-16 bg-white/20 rounded"/>
                                </div>
                            </div>
                            <div className="bg-[#1A365D] p-4 rounded-xl mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-4 w-32 bg-white/10 rounded"/>
                                    <div className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] rounded font-bold">98% Compatível</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded"/>
                                    <div className="h-2 w-5/6 bg-white/5 rounded"/>
                                    <div className="h-2 w-4/6 bg-white/5 rounded"/>
                                </div>
                            </div>
                             {/* Floating Badge */}
                             <div className="absolute -bottom-6 -left-6 bg-surface-dark border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                                <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Edital Rouanet</p>
                                    <p className="text-sm font-bold text-white">Projeto Aprovado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: 4 PILLARS (Clickable Cards) */}
            <section className="py-20 bg-[#152C4E]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Tudo o que você precisa em um só lugar</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Abandonamos as planilhas complexas para oferecer uma suíte completa de ferramentas.</p>
                        <p className="text-xs text-primary font-bold mt-2 uppercase tracking-wide">Clique nos cards para testar</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard 
                            icon="perm_media"
                            title="Portfólio Dinâmico"
                            description="Monte e atualize seu portfólio profissional em minutos com templates aprovados por curadores."
                            color="text-blue-400"
                            onClick={() => onNavigate(ViewState.MODULE_PORTFOLIO)}
                        />
                         <FeatureCard 
                            icon="plagiarism"
                            title="Analisador IA"
                            description="Carregue o PDF do edital e receba insights automáticos sobre elegibilidade e palavras-chave vitais."
                            color="text-[#319795]"
                            onClick={() => onNavigate(ViewState.MODULE_EDITAL)}
                        />
                         <FeatureCard 
                            icon="account_tree"
                            title="Estruturador"
                            description="Modelos prontos para leis de incentivo, editais públicos e captação privada."
                            color="text-purple-400"
                            onClick={() => onNavigate(ViewState.MODULE_PROJECTS)}
                        />
                         <FeatureCard 
                            icon="inventory"
                            title="Gestão Financeira"
                            description="Organize notas fiscais, arquivos e orçamentos integrado à nuvem de forma segura."
                            color="text-orange-400"
                            onClick={() => onNavigate(ViewState.MODULE_BUDGET)}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 3: SOCIAL PROOF */}
            <section className="py-20 bg-[#1A365D] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-display font-bold text-center mb-12">Confiança de Produtores que Realizam</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard 
                            quote="Com a Usina, reduzi 80% do tempo para escrever um projeto. O analisador de editais é algo que eu nunca vi antes."
                            author="João Silva"
                            role="Produtor de Teatro, SP"
                            image="https://i.pravatar.cc/150?img=11"
                        />
                        <TestimonialCard 
                            quote="Consegui meu primeiro financiamento via ProAC graças à organização que a plataforma me deu. Vale cada centavo."
                            author="Marina Souza"
                            role="Gestora Cultural, RJ"
                            image="https://i.pravatar.cc/150?img=5"
                        />
                        <TestimonialCard 
                            quote="O portfólio gerado pela Usina me garantiu elogios da curadoria. Profissionalismo em outro nível."
                            author="Carlos Mendes"
                            role="Artista Visual, MG"
                            image="https://i.pravatar.cc/150?img=3"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 4: PRICING */}
            <section id="planos" className="py-24 px-6 bg-[#0F213A]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Escolha o Plano que Acelera Sua Trajetória</h2>
                        <p className="text-slate-400">Investimento inteligente e dedutível para sua carreira.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                        {/* Plano Pro */}
                        <PricingCard 
                            title="Plano Pro"
                            price="R$ 97"
                            period="/mês"
                            description="Ideal para quem está começando."
                            features={[
                                "Acesso aos Editais",
                                "1 Portfólio Ativo", 
                                "Estruturador Básico",
                                "Suporte por Email"
                            ]}
                            buttonText="Escolher Plano Pro"
                            onSelect={handleLogin}
                            bgClass="bg-[#152C4E]"
                        />

                        {/* Plano Elite */}
                        <PricingCard 
                            title="Plano Elite"
                            price="R$ 797"
                            period="/ano"
                            subtitle="Eq. a R$ 66,42/mês"
                            description="O favorito dos profissionais sérios."
                            features={[
                                "Tudo do Plano Pro",
                                "Portfólios Ilimitados", 
                                "IA Analisadora Ilimitada",
                                "Gestão de Equipe (até 3)",
                                "Mentoria Mensal em Grupo"
                            ]}
                            isPopular={true}
                            highlight="Mais Popular"
                            buttonText="Escolher Plano Elite"
                            onSelect={handleLogin}
                            bgClass="bg-[#1A365D]"
                            borderClass="border-primary"
                        />

                        {/* Membro Fundador */}
                        <PricingCard 
                            title="Membro Fundador"
                            price="R$ 497"
                            period="único"
                            description="Oportunidade exclusiva e limitada."
                            features={[
                                "Acesso VITALÍCIO",
                                "Sem mensalidades nunca",
                                "Badge de Fundador", 
                                "Grupo VIP de Networking",
                                "Acesso Antecipado a Features"
                            ]}
                            buttonText="Garantir Acesso Vitalício"
                            highlight="Oferta Limitada"
                            onSelect={handleLogin}
                            bgClass="bg-gradient-to-b from-[#319795]/20 to-[#152C4E]"
                            borderClass="border-[#319795]"
                            accentColor="text-[#319795]"
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 5: FOOTER CTA */}
            <section className="py-20 px-6 bg-gradient-to-b from-[#1A365D] to-black text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-display font-bold mb-6">7 dias grátis para testar todos os recursos</h2>
                    <p className="text-slate-300 mb-10 text-lg">
                        Não deixe sua ideia na gaveta. Junte-se à comunidade que está profissionalizando a cultura no Brasil.
                    </p>
                    <button 
                        onClick={handleLogin}
                        className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white text-lg font-bold py-4 px-12 rounded-xl shadow-lg shadow-primary/30 transition-transform hover:scale-105"
                    >
                        Criar Minha Conta Gratuita
                    </button>
                    <p className="mt-8 text-xs text-slate-500">
                        &copy; 2024 Usina Cultural. Todos os direitos reservados.
                    </p>
                </div>
            </section>
        </div>
    );
};

// --- Subcomponents ---

const FeatureCard: React.FC<{icon: string, title: string, description: string, color: string, onClick?: () => void}> = ({ icon, title, description, color, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-[#1A365D] border border-white/5 p-6 rounded-2xl hover:border-[#319795]/50 hover:bg-[#1A365D]/80 transition-all duration-300 group cursor-pointer active:scale-95"
    >
        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
            Acessar <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
        </div>
    </div>
);

const TestimonialCard: React.FC<{quote: string, author: string, role: string, image: string}> = ({ quote, author, role, image }) => (
    <div className="bg-[#152C4E] p-8 rounded-2xl border border-white/5 relative">
        <span className="material-symbols-outlined text-4xl text-[#319795]/20 absolute top-4 right-4">format_quote</span>
        <p className="text-slate-300 italic mb-6 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-4">
            <img src={image} alt={author} className="w-12 h-12 rounded-full border-2 border-[#319795]" />
            <div>
                <p className="font-bold text-white text-sm">{author}</p>
                <p className="text-xs text-slate-400">{role}</p>
            </div>
        </div>
    </div>
);

const PricingCard: React.FC<any> = ({ 
    title, price, period, subtitle, description, features, 
    isPopular, buttonText, highlight, onSelect, 
    bgClass, borderClass, accentColor 
}) => (
    <div className={`relative ${bgClass} border ${borderClass || 'border-white/10'} rounded-2xl p-8 flex flex-col h-full hover:transform hover:-translate-y-2 transition-transform duration-300 ${isPopular ? 'shadow-2xl shadow-primary/10 scale-105 z-10' : ''}`}>
        {highlight && (
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${isPopular ? 'bg-primary' : 'bg-[#319795]'} text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap`}>
                {highlight}
            </div>
        )}
        <h3 className={`text-xl font-bold mb-2 ${accentColor || 'text-white'}`}>{title}</h3>
        <div className="flex items-baseline mb-1">
            <span className="text-4xl lg:text-5xl font-display font-bold">{price}</span>
            <span className="text-sm text-slate-500 ml-1">{period}</span>
        </div>
        {subtitle && <p className="text-xs text-[#319795] font-bold mb-4">{subtitle}</p>}
        {!subtitle && <div className="mb-4 h-4"></div>}
        
        <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">{description}</p>
        
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start text-sm text-slate-300">
                    <span className={`material-symbols-outlined text-lg mr-2 flex-shrink-0 ${accentColor ? accentColor : 'text-primary'}`}>check_circle</span>
                    {feature}
                </li>
            ))}
        </ul>

        <button 
            onClick={onSelect}
            className={`w-full py-4 rounded-xl font-bold transition-all ${isPopular ? 'bg-primary hover:bg-primary-hover text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
        >
            {buttonText}
        </button>
    </div>
);

export default LandingPage;