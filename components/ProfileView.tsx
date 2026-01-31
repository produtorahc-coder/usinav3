
import React, { useState } from 'react';

interface Props {
    onBack: () => void;
    onLogout: () => void;
    userProfile?: {
        roles: string[];
        segments: string[];
    };
}

const ProfileView: React.FC<Props> = ({ onBack, onLogout, userProfile }) => {
    const [preferences, setPreferences] = useState({
        emailNotif: true,
        darkMode: true
    });

    const handleEditPhoto = () => {
        alert("Funcionalidade de upload de foto em desenvolvimento.");
    };

    const handlePaymentMethods = () => {
        alert("Redirecionando para portal seguro de pagamentos...");
    };

    const togglePref = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const primaryRole = userProfile?.roles[0] || 'Produtor Cultural Sênior';
    const otherRolesCount = userProfile?.roles.length ? userProfile.roles.length - 1 : 0;

    return (
        <div className="min-h-screen bg-[#121212] text-white font-sans">
             <header className="bg-[#1A365D] border-b border-white/10 p-4 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white">
                         <span className="material-symbols-outlined">arrow_back</span>
                         Voltar ao Dashboard
                    </button>
                    <h1 className="font-bold text-lg">Meu Perfil</h1>
                    <button onClick={onLogout} className="text-red-400 hover:text-red-300 text-sm font-bold">
                        Sair
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-8">
                {/* Header Card */}
                <div className="bg-[#1c1c1e] rounded-2xl p-6 border border-white/10 flex flex-col md:flex-row items-center gap-6">
                    <div 
                        className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-primary shadow-xl"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDk1t8ypYL8CxWIldjxcSuzk9OyjIsta-GLZgO_XgBT-wzRlsO0JonpAk2JeMjOmCj3FHO1l886fE7dK3Lp6IM4bIrxqxsnJaq55fIAnlDx9A5c-dkCHsMXQOkGCxEBa7SPaHjtyXBK8dfSjMAn7l-_2Uv6y326ms8iC7o7PzKN1rknp3ohgE5v7hn94igcy4mp8viJlQPElp1VVpz1IR2qFDlnuCEFfRl_fVf9_ViK7wfgd06QyIdvdcMaQIwFjDrVqG1kIhcb1zk")' }}
                    />
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl font-bold">{primaryRole}</h2>
                        <p className="text-white/50">membro.fundador@usinacultural.com</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">Membro Fundador</span>
                            <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-bold rounded-full">Nível 12</span>
                            {otherRolesCount > 0 && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                                    +{otherRolesCount} funções
                                </span>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={handleEditPhoto}
                        className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        Editar Foto
                    </button>
                </div>

                {/* Form Data */}
                <div className="space-y-6">
                    <Section title="Dados Pessoais">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Nome Completo" value="Produtor Cultural Sênior" />
                            <Input label="CPF/CNPJ" value="00.000.000/0001-99" />
                            <Input label="Telefone" value="(11) 99999-9999" />
                            <Input label="Cidade/UF" value="São Paulo, SP" />
                        </div>
                    </Section>

                    {/* Perfil Profissional Multi-Select Display */}
                    <Section title="Perfil Profissional">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/50 font-bold uppercase mb-2 block">Funções e Atuação</label>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile?.roles.map((role, idx) => (
                                        <span key={idx} className="bg-white/10 border border-white/10 text-white px-3 py-1 rounded-lg text-sm">
                                            {role}
                                        </span>
                                    ))}
                                    {(!userProfile?.roles || userProfile.roles.length === 0) && <span className="text-white/30 text-sm">Nenhuma função selecionada.</span>}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/50 font-bold uppercase mb-2 block">Segmentos de Mercado</label>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile?.segments.map((seg, idx) => (
                                        <span key={idx} className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-bold">
                                            {seg}
                                        </span>
                                    ))}
                                    {(!userProfile?.segments || userProfile.segments.length === 0) && <span className="text-white/30 text-sm">Nenhum segmento selecionado.</span>}
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Assinatura & Cobrança">
                        <div className="bg-[#0a192f] p-4 rounded-xl border border-blue-500/30 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-white">Plano Vitalício Ativo</p>
                                <p className="text-xs text-white/50">Acesso liberado a todos os recursos.</p>
                            </div>
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                        </div>
                        <div className="mt-4">
                            <button 
                                onClick={handlePaymentMethods}
                                className="text-sm text-primary hover:underline"
                            >
                                Gerenciar métodos de pagamento
                            </button>
                        </div>
                    </Section>

                    <Section title="Preferências">
                         <div className="flex items-center justify-between py-2 border-b border-white/5">
                            <span className="text-sm">Receber e-mails de editais novos</span>
                            <Toggle active={preferences.emailNotif} onToggle={() => togglePref('emailNotif')} />
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm">Modo Escuro</span>
                            <Toggle active={preferences.darkMode} onToggle={() => togglePref('darkMode')} />
                        </div>
                    </Section>
                </div>

                 <div className="flex justify-end gap-4 pt-8">
                    <button onClick={onBack} className="px-6 py-3 rounded-xl hover:bg-white/5 transition-colors font-bold text-white/70">Cancelar</button>
                    <button onClick={() => alert('Dados salvos!')} className="px-6 py-3 bg-primary hover:bg-primary-hover rounded-xl font-bold shadow-lg text-white">Salvar Alterações</button>
                </div>
            </main>
        </div>
    );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-[#1c1c1e] p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold mb-4 text-white/90 border-b border-white/5 pb-2">{title}</h3>
        {children}
    </div>
);

const Input: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <label className="text-xs text-white/50 font-bold uppercase mb-1 block">{label}</label>
        <input 
            type="text" 
            defaultValue={value} 
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
        />
    </div>
);

const Toggle: React.FC<{active?: boolean, onToggle: () => void}> = ({ active, onToggle }) => (
    <div 
        onClick={onToggle}
        className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-primary' : 'bg-white/20'}`}
    >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-5' : 'left-1'}`} />
    </div>
);

export default ProfileView;
