
export enum ViewState {
    LANDING = 'LANDING',
    LOGIN = 'LOGIN',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD',
    ONBOARDING = 'ONBOARDING', // Novo: Fluxo de Primeiro Acesso
    ORBIT = 'ORBIT', // Novo: Página Inicial Espacial
    DASHBOARD = 'DASHBOARD',
    MODULE_EDITAL = 'MODULE_EDITAL',
    MODULE_BUDGET = 'MODULE_BUDGET',
    MODULE_CAREER = 'MODULE_CAREER', // Mantido para legado/gamificação
    MODULE_TEAM = 'MODULE_TEAM',     // Novo: Gestão de Equipe (Dynamic Staffing)
    MODULE_PORTFOLIO = 'MODULE_PORTFOLIO',
    MODULE_PROJECTS = 'MODULE_PROJECTS', // Novo: Estruturador
    MODULE_PROFILE = 'MODULE_PROFILE',   // Novo: Perfil
    ADMIN_EDICTS = 'ADMIN_EDICTS',       // Novo: Gestão de Acervo e OCR (Master)
    SUPPORT = 'SUPPORT', // Novo: SAC / Central de Ajuda
    PLANS = 'PLANS',
    ALL_TOOLS = 'ALL_TOOLS', // Nova página de ferramentas

    // Aliases para compatibilidade com CommandCenter
    CAREER_MODE = 'MODULE_CAREER',
    PROFILE = 'MODULE_PROFILE',
    AI_REVIEW = 'AI_REVIEW', // IA Review Feature

    // --- ADMIN PANEL ROUTES ---
    // 1. Dashboard & Analytics
    ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
    ADMIN_ANALYTICS = 'ADMIN_ANALYTICS',
    ADMIN_FINANCE = 'ADMIN_FINANCE',

    // 2. Content & Projects
    ADMIN_TEMPLATES = 'ADMIN_TEMPLATES',
    ADMIN_FEATURED_CALLS = 'ADMIN_FEATURED_CALLS',
    ADMIN_LIBRARY = 'ADMIN_LIBRARY',
    ADMIN_QUIZ = 'ADMIN_QUIZ',
    ADMIN_MODERATION = 'ADMIN_MODERATION',

    // 3. Users & Plans
    ADMIN_USERS = 'ADMIN_USERS',
    ADMIN_SUBSCRIPTIONS = 'ADMIN_SUBSCRIPTIONS',
    ADMIN_FOUNDERS = 'ADMIN_FOUNDERS',
    ADMIN_COUPONS = 'ADMIN_COUPONS',

    // 4. System
    ADMIN_AI_SETTINGS = 'ADMIN_AI_SETTINGS',
    ADMIN_LOGS = 'ADMIN_LOGS',
    ADMIN_CLOUD = 'ADMIN_CLOUD',
    ADMIN_BACKUP = 'ADMIN_BACKUP',
    ADMIN_EMAIL = 'ADMIN_EMAIL',

    // 5. Settings & Legal
    ADMIN_SETTINGS_GENERAL = 'ADMIN_SETTINGS_GENERAL',
    ADMIN_PLANS_CONFIG = 'ADMIN_PLANS_CONFIG',
    ADMIN_LEGAL = 'ADMIN_LEGAL',
    ADMIN_SUPPORT_SETTINGS = 'ADMIN_SUPPORT_SETTINGS',
    ADMIN_SEO = 'ADMIN_SEO',

    // 6. Tools
    ADMIN_BROADCAST = 'ADMIN_BROADCAST',
    ADMIN_BULK_UPLOAD = 'ADMIN_BULK_UPLOAD',
    ADMIN_MAINTENANCE = 'ADMIN_MAINTENANCE',

    // 7. Notifications Control
    ADMIN_NOTIFICATIONS = 'ADMIN_NOTIFICATIONS'
}

export interface PlanProps {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    highlight?: string;
}

export interface NavItem {
    icon: string;
    label: string;
    view: ViewState;
}

// Portfolio Types
export type BlockType = 'cover' | 'text' | 'gallery' | 'bio' | 'contact' | 'social' | 'clipping';

export interface PortfolioBlock {
    id: string;
    type: BlockType;
    content: any; // Flexível para suportar { instagram: string } ou { quotes: [] }
    styles: {
        backgroundColor?: string;
        textColor?: string;
        padding?: string;
        align?: 'left' | 'center' | 'right';
    };
}

export interface GalleryImage {
    url: string;
    caption: string;
}

// Project Hierarchy Types
export type FundingType = 'PRIVATE' | 'INCENTIVE' | 'PUBLIC';

export interface SponsorshipTier {
    id: string;
    name: string;
    value: number;
    benefits: string;
}

// Novo: Blocos do Editor Lego
export type ProjectBlockType = 'SECTION_HEADER' | 'TEXT' | 'IMAGE' | 'TABLE';

export interface ProjectBlock {
    id: string;
    type: ProjectBlockType;
    title?: string; // Título editável do bloco (ex: "Justificativa", "Sinopse")
    content: string | any; // Texto ou URL da imagem
    isRequired?: boolean; // Se é obrigatório para compliance
    section?: string; // Para agrupar nos 4 pilares
    metadata?: {
        caption?: string;
        rows?: number; // Para tabelas futuras
        placeholder?: string; // Dica do que escrever
    };
}

// Novo: Estrutura do Canvas Cultural (9 Blocos)
export interface CanvasData {
    // Infraestrutura (Azul)
    keyPartners: string;      // Parcerias Principais
    keyActivities: string;    // Atividades Principais
    keyResources: string;     // Recursos Principais

    // Oferta (Vermelho)
    valueProposition: string; // Proposta de Valor

    // Mercado (Verde)
    customerRelationships: string; // Relacionamento
    channels: string;              // Canais
    customerSegments: string;      // Segmentos de Clientes

    // Finanças (Beige/Amarelo)
    costStructure: string;    // Estrutura de Custos
    revenueStreams: string;   // Fontes de Receita
}

export interface ProjectNode {
    id: string;
    parentId: string | null; // Null se for Master, ID se for Subprojeto
    name: string;
    fundingModes: FundingType[]; // Array para suportar múltiplos modelos simultâneos
    progress: number;
    lastModified: string;
    // Dados específicos do projeto
    details: {
        startDate?: string;
        endDate?: string;
        city?: string;
        publicEstimation?: string;
        summary?: string;
    };

    // Canvas Estratégico (O "Pai" dos dados)
    canvas?: CanvasData;

    // Substituído estrutura fixa por blocos dinâmicos (O Documento final)
    blocks: ProjectBlock[];

    // Legado (mantido para compatibilidade se necessário, mas o editor usará blocks)
    structure?: {
        objetivo: string;
        justificativa: string;
        metas: string;
    };
    incentiveData?: {
        democratization: string;
        accessibility: string;
    };
    privateFundingData?: {
        audienceMatch: string;   // Análise de Público Cruzado
        activationPlan: string;  // Plano de Ativação
        roiMetrics: string;      // Métricas de Retorno
    };
    sponsorshipTiers?: SponsorshipTier[];
}

// Budget Types
export interface BudgetItem {
    id: string;
    description: string;
    quantity: number;      // Qtde.
    unit: string;          // Unidade (ex: Cachê, Serviço)
    unitFrequency: number; // Qtde. de Unidade (ex: 5 dias, 12 meses)
    unitValue: number;     // Valor Unitário
}

export interface BudgetCategory {
    id: number;
    name: string;
    items: BudgetItem[];
}

export interface BudgetProject {
    id: string;
    projectId?: string | null; // ID do Projeto Master ao qual está vinculado (ou null se avulso)
    name: string;
    lastEdited: string;
    status: 'Em Elaboração' | 'Finalizado';
    categories: BudgetCategory[];
}

// --- TEAM MANAGEMENT TYPES ---

export interface ServiceValue {
    id: string;
    role: string; // Ex: "Designer Gráfico", "Diretor de Arte"
    value: number; // Valor padrão para este serviço
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    phone?: string;
    whatsapp?: string; // Novo: Integração Direct Link
    mainRole: string; // Função Principal para exibição na lista
    segment?: string; // Segmento de atuação (ex: Música, Dança)
    cpf_cnpj?: string; // Dados de pagamento
    pix_key?: string; // Chave PIX
    availableServices: ServiceValue[]; // Lista de serviços e valores possíveis (até 30)
}

export interface RoleAllocation {
    id: string;
    roleName: string;
    serviceValue: number;
    paymentStatus: 'Pending' | 'Scheduled' | 'Paid';
    isSyncedToBudget: boolean;
}

export interface ProjectStaffing {
    projectId: string; // ID do Projeto Master
    memberId: string;  // ID do Membro
    allocations: RoleAllocation[]; // Um membro pode ter várias funções no mesmo projeto
}

// --- DIGITAL ARCHIVE (OCR & IA) ---
export interface DigitalEdict {
    id: string;
    title: string;
    category: 'Cultura' | 'Audiovisual' | 'Eventos' | 'Patrimônio';
    uploadDate: string;
    status: 'DRAFT' | 'PROCESSING' | 'PUBLISHED';
    extractedText: string; // Texto bruto via OCR
    keywords: string[]; // Indexação para busca
    publicUrl?: string; // Link gerado para usuários
    fileName: string;
    structuredData?: {
        timeline: {
            registrationStart: string;
            registrationEnd: string;
            resultsDate: string;
            executionPeriod: string;
        };
        financial: {
            totalValue: string;
            maxPerProject: string;
        };
        eligibility: {
            participants: string;
            requiredDocs: string[];
        };
        identification: {
            organ: string;
            sphere: 'Municipal' | 'Estadual' | 'Federal' | 'Privado';
        }
    };
}
