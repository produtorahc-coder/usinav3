import React from 'react';

export interface ModuleConfig {
    id: string;
    icon: string;
    label: string;
    subtitle?: string;
    color: 'blue' | 'purple' | 'orange' | 'teal' | 'yellow';
    highlight?: boolean;
    onClick: () => void;
}

interface ModuleCardProps {
    module: ModuleConfig;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
    const colorClasses = {
        blue: 'bg-blue-600/20 text-accent-blue',
        purple: 'bg-primary-purple/20 text-primary-purple',
        orange: 'bg-accent-orange/20 text-accent-orange',
        teal: 'bg-accent-teal/20 text-accent-teal',
        yellow: 'bg-accent-yellow/20 text-accent-yellow'
    };

    return (
        <div
            onClick={module.onClick}
            className={`
                bg-slate-800 rounded-2xl p-6 
                flex flex-col items-center justify-center gap-3
                cursor-pointer transition-all duration-200
                border border-slate-700
                hover:transform hover:-translate-y-1 hover:shadow-lg
                min-h-[120px]
                ${module.highlight
                    ? 'bg-gradient-to-br from-accent-orange/20 to-accent-orange-dark/10 border-accent-orange hover:border-accent-orange-dark'
                    : 'hover:border-primary-purple'
                }
            `}
        >
            {/* Icon */}
            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${colorClasses[module.color]}
            `}>
                <span className="material-symbols-outlined text-2xl">
                    {module.icon}
                </span>
            </div>

            {/* Label */}
            <div className="text-center">
                <h3 className="font-semibold text-white text-sm">
                    {module.label}
                </h3>
                {module.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">
                        {module.subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ModuleCard;
