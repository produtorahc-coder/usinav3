import React from 'react';

interface UrgentAlertProps {
    title: string;
    message: string;
    ctaText: string;
    onCtaClick: () => void;
    icon?: string;
}

export const UrgentAlert: React.FC<UrgentAlertProps> = ({
    title,
    message,
    ctaText,
    onCtaClick,
    icon = 'warning'
}) => {
    return (
        <div className="bg-gradient-to-r from-accent-orange to-accent-orange-dark rounded-2xl p-4 shadow-lg shadow-accent-orange/30 animate-slideDown">
            <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-white text-2xl flex-shrink-0">
                    {icon}
                </span>
                <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-orange-100">
                        {message}
                    </p>
                </div>
            </div>
            <button
                onClick={onCtaClick}
                className="
                    w-full mt-3 bg-white text-accent-orange 
                    font-bold py-3 rounded-xl
                    transition-all duration-200
                    hover:bg-orange-50 hover:scale-105
                    active:scale-95
                "
            >
                {ctaText}
            </button>
        </div>
    );
};

export default UrgentAlert;
