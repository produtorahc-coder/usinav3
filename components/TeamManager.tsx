
import React, { useState, useEffect } from 'react';
import { ViewState, TeamMember, ProjectStaffing, ServiceValue } from '../types';
import { ExitConfirmationModal } from './ExitConfirmationModal';

interface Props {
    onBack: () => void;
    onNavigate: (view: ViewState, params?: any) => void;
}

// --- MOCK DATA INICIAL ---
const INITIAL_MEMBERS: TeamMember[] = [
    {
        id: 'm1',
        name: 'Ana Souza',
        email: 'ana.souza@email.com',
        whatsapp: '11999999999',
        mainRole: 'Designer Pleno',
        segment: 'Artes Visuais',
        cpf_cnpj: '123.456.789-00',
        pix_key: 'ana.souza@email.com',
        availableServices: [
            { id: 's1', role: 'Identidade Visual Completa', value: 2500 },
            { id: 's2', role: 'Desdobramento Redes Sociais', value: 800 },
            { id: 's2-extra', role: 'Diagramação de Ebook', value: 1200 }
        ]
    },
    {
        id: 'm2',
        name: 'Carlos Lima',
        email: 'carlos.prod@email.com',
        whatsapp: '21988887777',
        mainRole: 'Produtor Executivo',
        segment: 'Produção Cultural',
        cpf_cnpj: '22.333.444/0001-99',
        pix_key: '22333444000199',
        availableServices: [
            { id: 's3', role: 'Coordenação Geral', value: 5000 },
            { id: 's4', role: 'Prestação de Contas', value: 1500 },
            { id: 's4-b', role: 'Captação de Recursos (10%)', value: 0 }
        ]
    },
    {
        id: 'm3',
        name: 'Beatriz Silva',
        email: 'bia.silva@email.com',
        whatsapp: '31977776666',
        mainRole: 'Social Media',
        segment: 'Comunicação',
        cpf_cnpj: '987.654.321-11',
        pix_key: '+5531977776666',
        availableServices: [
            { id: 's5', role: 'Gestão Instagram (Mensal)', value: 1200 },
            { id: 's6', role: 'Cobertura de Evento (Diária)', value: 450 }
        ]
    },
];

const MOCK_PROJECTS = [
    { id: 'master-1', name: 'Festival Urbrasil 2024' },
    { id: 'master-2', name: 'Curta Metragem: O Silêncio' },
    { id: 'master-3', name: 'Exposição Coletiva SP' }
];

const TeamManager: React.FC<Props> = ({ onBack, onNavigate }) => {
    // --- STATE ---
    const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
    const [allocations, setAllocations] = useState<ProjectStaffing[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Exit Modal State
    const [showExitModal, setShowExitModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // TeamManager saves largely on modal close, but general changes could be tracked

    // Modal Edit/Create Member
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    // Quick Profile Drawer State
    const [selectedMemberProfile, setSelectedMemberProfile] = useState<TeamMember | null>(null);

    // Form State (Edit/Create)
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formWhatsapp, setFormWhatsapp] = useState('');
    const [formRole, setFormRole] = useState('');
    const [formSegment, setFormSegment] = useState('');
    const [formCpfCnpj, setFormCpfCnpj] = useState('');
    const [formPix, setFormPix] = useState('');
    const [formServices, setFormServices] = useState<ServiceValue[]>([]);

    // Modal Link Project
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [memberToLink, setMemberToLink] = useState<TeamMember | null>(null);
    const [selectedProjectToLink, setSelectedProjectToLink] = useState('');

    // --- HELPERS ---
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copiado para a área de transferência!`);
    };

    // WhatsApp Link Generator
    const handleWhatsAppClick = (member: TeamMember, projectName?: string) => {
        if (!member.whatsapp) return alert("Número de WhatsApp não cadastrado para este colaborador.");

        let cleanNum = member.whatsapp.replace(/\D/g, '');
        if (!cleanNum.startsWith('55') && cleanNum.length <= 11) {
            cleanNum = `55${cleanNum}`;
        }

        const myName = "Felipe da F-Laure Produções";
        let message = '';

        if (projectName) {
            message = `Olá ${member.name}, aqui é o ${myName}. Gostaria de falar sobre sua participação no projeto *${projectName}*.`;
        } else {
            message = `Olá ${member.name}, aqui é o ${myName}. Gostaria de falar sobre oportunidades de parceria na Usina Cultural.`;
        }

        const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // --- ACTIONS: MEMBER MANAGEMENT ---

    const handleOpenProfile = (member: TeamMember) => {
        setSelectedMemberProfile(member);
    };

    const handleCloseProfile = () => {
        setSelectedMemberProfile(null);
    };

    const handleOpenMemberModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormName(member.name);
            setFormEmail(member.email);
            setFormWhatsapp(member.whatsapp || '');
            setFormRole(member.mainRole);
            setFormSegment(member.segment || '');
            setFormCpfCnpj(member.cpf_cnpj || '');
            setFormPix(member.pix_key || '');
            setFormServices([...member.availableServices]);
        } else {
            setEditingMember(null);
            setFormName('');
            setFormEmail('');
            setFormWhatsapp('');
            setFormRole('');
            setFormSegment('');
            setFormCpfCnpj('');
            setFormPix('');
            setFormServices([{ id: Date.now().toString(), role: '', value: 0 }]);
        }
        setIsMemberModalOpen(true);
    };

    const handleSaveMember = () => {
        if (!formName || !formRole) return alert("Nome e Função Principal são obrigatórios.");

        const cleanServices = formServices.filter(s => s.role.trim() !== '');

        if (editingMember) {
            // Update
            setMembers(prev => prev.map(m => m.id === editingMember.id ? {
                ...m,
                name: formName,
                email: formEmail,
                whatsapp: formWhatsapp,
                mainRole: formRole,
                segment: formSegment,
                cpf_cnpj: formCpfCnpj,
                pix_key: formPix,
                availableServices: cleanServices
            } : m));
        } else {
            // Create
            if (members.length >= 100) return alert("Limite de 100 colaboradores atingido.");

            const newMember: TeamMember = {
                id: Date.now().toString(),
                name: formName,
                email: formEmail,
                whatsapp: formWhatsapp,
                mainRole: formRole,
                segment: formSegment,
                cpf_cnpj: formCpfCnpj,
                pix_key: formPix,
                availableServices: cleanServices
            };
            setMembers([...members, newMember]);
        }
        setIsMemberModalOpen(false);
    };

    const handleDeleteMember = (id: string) => {
        if (window.confirm("Remover este colaborador?")) {
            setMembers(members.filter(m => m.id !== id));
            if (selectedMemberProfile?.id === id) setSelectedMemberProfile(null);
        }
    };

    // --- ACTIONS: SERVICE MANAGEMENT INSIDE MODAL ---
    const updateServiceRow = (id: string, field: keyof ServiceValue, value: any) => {
        setFormServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addServiceRow = () => {
        if (formServices.length >= 30) return alert("Máximo de 30 serviços por colaborador.");
        setFormServices([...formServices, { id: Date.now().toString(), role: '', value: 0 }]);
    };

    const removeServiceRow = (id: string) => {
        setFormServices(prev => prev.filter(s => s.id !== id));
    };

    // --- ACTIONS: LINKING TO PROJECT (CHECKBOX LOGIC) ---
    const handleOpenLinkModal = (member: TeamMember) => {
        setMemberToLink(member);
        setSelectedProjectToLink('');
        setIsLinkModalOpen(true);
    };

    const isServiceLinked = (serviceRoleName: string) => {
        if (!memberToLink || !selectedProjectToLink) return false;
        const projectStaffing = allocations.find(
            p => p.projectId === selectedProjectToLink && p.memberId === memberToLink.id
        );
        if (!projectStaffing) return false;
        return projectStaffing.allocations.some(a => a.roleName === serviceRoleName);
    };

    const handleToggleLink = (service: ServiceValue) => {
        if (!memberToLink || !selectedProjectToLink) return;
        if (isServiceLinked(service.role)) return;

        setAllocations(prev => {
            const existingStaffing = prev.find(
                p => p.projectId === selectedProjectToLink && p.memberId === memberToLink.id
            );

            if (existingStaffing) {
                return prev.map(p => {
                    if (p.projectId === selectedProjectToLink && p.memberId === memberToLink.id) {
                        return {
                            ...p,
                            allocations: [...p.allocations, {
                                id: Date.now().toString(),
                                roleName: service.role,
                                serviceValue: service.value,
                                paymentStatus: 'Pending',
                                isSyncedToBudget: true
                            }]
                        };
                    }
                    return p;
                });
            } else {
                return [...prev, {
                    projectId: selectedProjectToLink,
                    memberId: memberToLink.id,
                    allocations: [{
                        id: Date.now().toString(),
                        roleName: service.role,
                        serviceValue: service.value,
                        paymentStatus: 'Pending',
                        isSyncedToBudget: true
                    }]
                }];
            }
        });
        setHasUnsavedChanges(true);
    };

    // --- EXIT SAFETY ---
    const handleSafeExit = () => {
        if (hasUnsavedChanges) {
            setPendingNavigation(() => () => onNavigate(ViewState.ORBIT));
            setShowExitModal(true);
        } else {
            onNavigate(ViewState.ORBIT);
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



    // Filter Logic
    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mainRole.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#101922] text-white font-sans flex flex-col">
            {/* Header */}
            <header className="bg-[#1c1c1e] border-b border-white/10 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={handleSafeExit} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <div>
                                <h1 className="text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">groups</span>
                                    Central de Equipe
                                </h1>
                                <p className="text-xs text-white/50">Gestão de Talentos & Comunicação Integrada</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-white/70">
                                Colaboradores: <span className="text-white font-bold">{members.length}</span> / 100
                            </div>
                            <button
                                onClick={handleSafeExit}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>



            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou função..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">search</span>
                    </div>
                    <button
                        onClick={() => handleOpenMemberModal()}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 w-full md:w-auto justify-center"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Novo Colaborador
                    </button>
                </div>

                {/* Data List (Updated to Contact Center Style) */}
                <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/20 text-xs font-bold uppercase text-white/40 border-b border-white/10">
                                    <th className="p-4 w-16">Iniciais</th>
                                    <th className="p-4">Colaborador</th>
                                    <th className="p-4">Função Base</th>
                                    <th className="p-4">Projeto Atual (Ativo)</th>
                                    <th className="p-4 text-center">Contato Rápido</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredMembers.map(member => {
                                    const activeAlloc = allocations.find(a => a.memberId === member.id);
                                    let activeProjectName = "Disponível";
                                    let activeProjectId = undefined;

                                    if (activeAlloc) {
                                        const proj = MOCK_PROJECTS.find(p => p.id === activeAlloc.projectId);
                                        activeProjectName = proj ? proj.name : "Projeto Desconhecido";
                                        activeProjectId = activeAlloc.projectId;
                                    }

                                    return (
                                        <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div
                                                    onClick={() => handleOpenProfile(member)}
                                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/10 cursor-pointer hover:scale-110 transition-transform"
                                                >
                                                    {getInitials(member.name)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleOpenProfile(member)}
                                                    className="text-left group/name"
                                                >
                                                    <p className="font-bold text-white text-sm group-hover/name:text-primary transition-colors flex items-center gap-2">
                                                        {member.name}
                                                        <span className="material-symbols-outlined text-[10px] opacity-0 group-hover/name:opacity-100">open_in_new</span>
                                                    </p>
                                                    <p className="text-xs text-white/40">{member.email}</p>
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-white/5 text-white/80 px-2 py-1 rounded text-xs border border-white/10">
                                                    {member.mainRole}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {activeProjectId ? (
                                                    <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        {activeProjectName}
                                                    </span>
                                                ) : (
                                                    <span className="text-white/20 text-xs flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-white/20"></span>
                                                        Disponível
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleWhatsAppClick(member, activeProjectId ? activeProjectName : undefined)}
                                                    className={`
                                                        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95
                                                        ${member.whatsapp
                                                            ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white'
                                                            : 'bg-white/5 text-white/20 border-white/10 cursor-not-allowed'}
                                                    `}
                                                    disabled={!member.whatsapp}
                                                >
                                                    <span className="material-symbols-outlined text-sm">perm_phone_msg</span>
                                                    WhatsApp
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenLinkModal(member)}
                                                        className="bg-primary/20 hover:bg-primary hover:text-white text-primary p-2 rounded-lg transition-colors"
                                                        title="Vincular a Projeto"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">link</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenMemberModal(member)}
                                                        className="bg-white/5 hover:bg-white/20 text-white/70 hover:text-white p-2 rounded-lg transition-colors"
                                                        title="Editar Dados"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMember(member.id)}
                                                        className="hover:bg-red-500/20 text-white/30 hover:text-red-400 p-2 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredMembers.length === 0 && (
                        <div className="p-12 text-center text-white/30">
                            Nenhum colaborador encontrado.
                        </div>
                    )}
                </div>
            </main>

            {/* --- DRAWER: PERFIL RÁPIDO DO COLABORADOR --- */}
            {
                selectedMemberProfile && (
                    <div className="fixed inset-0 z-[70] flex justify-end">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseProfile}></div>
                        <div className="relative w-full max-w-md bg-[#1c1c1e] border-l border-white/10 h-full shadow-2xl flex flex-col animate-slide-left overflow-hidden">

                            {/* Header Profile */}
                            <div className="p-6 border-b border-white/10 flex flex-col items-center bg-gradient-to-b from-white/5 to-transparent relative">
                                <button onClick={handleCloseProfile} className="absolute top-4 right-4 text-white/50 hover:text-white">
                                    <span className="material-symbols-outlined">close</span>
                                </button>

                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl border-4 border-[#1c1c1e] mb-4">
                                    {getInitials(selectedMemberProfile.name)}
                                </div>

                                <h2 className="text-2xl font-bold text-white text-center leading-tight mb-1">{selectedMemberProfile.name}</h2>
                                <p className="text-white/60 text-sm mb-3">{selectedMemberProfile.mainRole}</p>

                                {/* Status Badge */}
                                {allocations.some(a => a.memberId === selectedMemberProfile.id) ? (
                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Em Projeto
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/50 text-xs font-bold border border-white/5">
                                        Disponível
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                                {/* Actions Area */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleWhatsAppClick(selectedMemberProfile)}
                                        disabled={!selectedMemberProfile.whatsapp}
                                        className={`py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${selectedMemberProfile.whatsapp ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                                    >
                                        <span className="material-symbols-outlined">chat</span>
                                        WhatsApp
                                    </button>
                                    <a
                                        href={`mailto:${selectedMemberProfile.email}`}
                                        className="py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-white font-bold transition-all border border-white/5"
                                    >
                                        <span className="material-symbols-outlined">mail</span>
                                        E-mail
                                    </a>
                                </div>

                                {/* Data Sections */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Dados de Pagamento</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                <div>
                                                    <p className="text-[10px] text-white/40 uppercase font-bold">CPF / CNPJ</p>
                                                    <p className="text-sm text-white font-mono">{selectedMemberProfile.cpf_cnpj || 'Não cadastrado'}</p>
                                                </div>
                                                {selectedMemberProfile.cpf_cnpj && (
                                                    <button onClick={() => handleCopy(selectedMemberProfile.cpf_cnpj!, 'CPF/CNPJ')} className="text-white/30 hover:text-primary">
                                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                                <div>
                                                    <p className="text-[10px] text-white/40 uppercase font-bold">Chave PIX</p>
                                                    <p className="text-sm text-white font-mono">{selectedMemberProfile.pix_key || 'Não cadastrado'}</p>
                                                </div>
                                                {selectedMemberProfile.pix_key && (
                                                    <button onClick={() => handleCopy(selectedMemberProfile.pix_key!, 'Chave PIX')} className="text-white/30 hover:text-primary">
                                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Segmento & Serviços</h3>
                                        <div className="mb-3">
                                            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Área de Atuação</p>
                                            <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold border border-primary/30">
                                                {selectedMemberProfile.segment || 'Geral'}
                                            </span>
                                        </div>
                                        <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                                            <table className="w-full text-left">
                                                <thead className="bg-white/5 text-[10px] uppercase text-white/40">
                                                    <tr>
                                                        <th className="p-3">Função</th>
                                                        <th className="p-3 text-right">Valor Tabela</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {selectedMemberProfile.availableServices.map(service => (
                                                        <tr key={service.id}>
                                                            <td className="p-3 text-sm text-white">{service.role}</td>
                                                            <td className="p-3 text-right text-sm font-mono text-green-400">{formatCurrency(service.value)}</td>
                                                        </tr>
                                                    ))}
                                                    {selectedMemberProfile.availableServices.length === 0 && (
                                                        <tr><td colSpan={2} className="p-3 text-center text-xs text-white/30">Sem serviços cadastrados</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Histórico de Projetos</h3>
                                        <div className="space-y-2">
                                            {allocations.filter(a => a.memberId === selectedMemberProfile.id).map(alloc => {
                                                const proj = MOCK_PROJECTS.find(p => p.id === alloc.projectId);
                                                return (
                                                    <div key={alloc.projectId} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                                        <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-white/50 text-sm">folder</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{proj?.name || 'Projeto Desconhecido'}</p>
                                                            <p className="text-[10px] text-white/50">
                                                                {alloc.allocations.length} função(ões) ativa(s)
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {!allocations.some(a => a.memberId === selectedMemberProfile.id) && (
                                                <p className="text-xs text-white/30 italic">Nenhum projeto vinculado no momento.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Edit */}
                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <button
                                    onClick={() => { handleCloseProfile(); handleOpenMemberModal(selectedMemberProfile); }}
                                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">edit_note</span>
                                    Editar Perfil Completo
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ... (Existing Create/Edit Modal and Link Modal remain the same) ... */}
            {/* ... The rest of the file content (Modals) is preserved implicitly or should be included if rewriting full file ... */}
            {/* Note: I'm including the full file content below to ensure consistency as requested */}

            {/* --- MODAL: CREATE/EDIT MEMBER --- */}
            {
                isMemberModalOpen && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMemberModalOpen(false)}></div>
                        <div className="relative bg-[#1c1c1e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">id_card</span>
                                    {editingMember ? 'Editar Colaborador' : 'Novo Colaborador'}
                                </h3>
                                <button onClick={() => setIsMemberModalOpen(false)}><span className="material-symbols-outlined text-white/50 hover:text-white">close</span></button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">Nome Completo</label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">Função Principal</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Produtor"
                                            value={formRole}
                                            onChange={(e) => setFormRole(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">E-mail</label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-green-500/70 uppercase mb-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">smartphone</span>
                                            WhatsApp (Com DDD)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 11999999999"
                                            value={formWhatsapp}
                                            onChange={(e) => setFormWhatsapp(e.target.value)}
                                            className="w-full bg-black/20 border border-green-500/30 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none placeholder-white/20"
                                        />
                                    </div>

                                    {/* New Fields */}
                                    <div>
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">Segmento / Área</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Música, Dança..."
                                            value={formSegment}
                                            onChange={(e) => setFormSegment(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">CPF / CNPJ</label>
                                        <input
                                            type="text"
                                            value={formCpfCnpj}
                                            onChange={(e) => setFormCpfCnpj(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-white/50 uppercase mb-1 block">Chave PIX</label>
                                        <input
                                            type="text"
                                            value={formPix}
                                            onChange={(e) => setFormPix(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Services List */}
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-primary uppercase flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">payments</span>
                                            Tabela de Serviços & Valores
                                        </label>
                                        <button
                                            onClick={addServiceRow}
                                            className="text-xs font-bold text-white/70 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded hover:bg-white/10"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                            Adicionar Serviço
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-[1fr_120px_40px] gap-2 text-[10px] text-white/30 uppercase font-bold px-2">
                                            <span>Descrição do Serviço / Cargo</span>
                                            <span>Valor (R$)</span>
                                            <span></span>
                                        </div>
                                        {formServices.map((service) => (
                                            <div key={service.id} className="grid grid-cols-[1fr_120px_40px] gap-2 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Ex: Direção de Arte"
                                                    value={service.role}
                                                    onChange={(e) => updateServiceRow(service.id, 'role', e.target.value)}
                                                    className="bg-[#1c1c1e] border border-white/10 rounded p-2 text-sm text-white focus:border-primary outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={service.value || ''}
                                                    onChange={(e) => updateServiceRow(service.id, 'value', parseFloat(e.target.value))}
                                                    className="bg-[#1c1c1e] border border-white/10 rounded p-2 text-sm text-white focus:border-primary outline-none text-right"
                                                />
                                                <button
                                                    onClick={() => removeServiceRow(service.id)}
                                                    className="flex items-center justify-center text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                        {formServices.length === 0 && (
                                            <p className="text-center text-white/20 text-xs py-4">Nenhum serviço cadastrado.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#151517] flex justify-end gap-3">
                                <button onClick={() => setIsMemberModalOpen(false)} className="px-6 py-3 rounded-xl hover:bg-white/5 text-white/70 font-bold">Cancelar</button>
                                <button onClick={handleSaveMember} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg">Salvar Dados</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- MODAL: LINK TO PROJECT (UPDATED MULTI-ROLE LOGIC) --- */}
            {
                isLinkModalOpen && memberToLink && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLinkModalOpen(false)}></div>
                        <div className="relative bg-[#1c1c1e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white mb-1">Vincular Colaborador</h3>
                                <p className="text-white/50 text-sm">Selecione o projeto e os serviços a serem contratados.</p>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                {/* Member Info */}
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-black">{getInitials(memberToLink.name)}</div>
                                    <div>
                                        <p className="font-bold text-white">{memberToLink.name}</p>
                                        <p className="text-xs text-white/50">{memberToLink.mainRole}</p>
                                    </div>
                                </div>

                                {/* 1. Select Project */}
                                <div>
                                    <label className="text-xs font-bold text-white/50 uppercase mb-2 block">Projeto Selecionado</label>
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none cursor-pointer"
                                        value={selectedProjectToLink}
                                        onChange={(e) => setSelectedProjectToLink(e.target.value)}
                                    >
                                        <option value="">Selecione um projeto para iniciar...</option>
                                        {MOCK_PROJECTS.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. Select Service (Checklist) */}
                                {selectedProjectToLink && (
                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-white/50 uppercase">Serviços Disponíveis</label>
                                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                                                Multiprofissão Ativo
                                            </span>
                                        </div>

                                        <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white/5 text-[10px] uppercase font-bold text-white/40">
                                                        <th className="p-3 w-10 text-center"></th>
                                                        <th className="p-3">Profissão / Função</th>
                                                        <th className="p-3 text-right">Valor</th>
                                                        <th className="p-3 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {memberToLink.availableServices.map(service => {
                                                        const isLinked = isServiceLinked(service.role);
                                                        return (
                                                            <tr key={service.id} className={isLinked ? 'bg-green-900/10' : 'hover:bg-white/5 transition-colors'}>
                                                                <td className="p-3 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isLinked}
                                                                        disabled={isLinked} // Trava de Segurança
                                                                        onChange={() => handleToggleLink(service)}
                                                                        className={`w-4 h-4 rounded border-gray-500 bg-transparent text-green-500 focus:ring-0 cursor-pointer ${isLinked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    />
                                                                </td>
                                                                <td className="p-3">
                                                                    <span className={`text-sm font-medium ${isLinked ? 'text-green-400' : 'text-white'}`}>
                                                                        {service.role}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-right">
                                                                    <span className="text-sm font-mono text-white/70">
                                                                        {formatCurrency(service.value)}
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-center">
                                                                    {isLinked ? (
                                                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider flex items-center justify-center gap-1">
                                                                            <span className="material-symbols-outlined text-sm">lock</span>
                                                                            Vinculado
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] text-white/30 uppercase">Disponível</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {memberToLink.availableServices.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="p-4 text-center text-xs text-white/30">
                                                                Nenhum serviço cadastrado para este colaborador.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-[10px] text-white/30 mt-2 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">info</span>
                                            Marque a caixa para injetar automaticamente o valor na planilha do projeto. Itens vinculados são travados para evitar duplicidade.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#151517] flex justify-end">
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                >
                                    Concluir
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <ExitConfirmationModal
                isOpen={showExitModal}
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
            />
        </div>
    );
};

export default TeamManager;
