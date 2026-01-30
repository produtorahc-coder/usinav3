import React from 'react';

export interface TimelineMilestone {
    id: string;
    title: string;
    subtitle: string;
    completed: boolean;
    current: boolean;
    locked: boolean;
    actions?: Array<{
        icon: string;
        label: string;
        onClick: () => void;
    }>;
}

interface TimelineProps {
    milestones: TimelineMilestone[];
    userAvatar?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ milestones, userAvatar }) => {
    return (
        <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

            {/* Milestones */}
            {milestones.map((milestone, index) => (
                <div
                    key={milestone.id}
                    className="relative flex items-start gap-4 mb-8 last:mb-0 animate-slideUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Icon */}
                    <div className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                        transition-all duration-300
                        ${milestone.completed
                            ? 'bg-primary-purple shadow-lg shadow-primary-purple/30'
                            : milestone.current
                                ? 'bg-slate-700 border-2 border-primary-purple'
                                : 'bg-slate-800 border-2 border-slate-600'
                        }
                    `}>
                        {milestone.completed && (
                            <span className="material-symbols-outlined text-white">check</span>
                        )}
                        {milestone.current && userAvatar && (
                            <img
                                src={userAvatar}
                                alt="Current"
                                className="w-full h-full rounded-full object-cover"
                            />
                        )}
                        {milestone.current && !userAvatar && (
                            <div className="w-3 h-3 rounded-full bg-primary-purple animate-pulse" />
                        )}
                        {milestone.locked && (
                            <span className="material-symbols-outlined text-slate-600">lock</span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2 min-w-0">
                        <h3 className={`
                            font-bold text-base
                            ${milestone.locked ? 'text-slate-600' : 'text-white'}
                        `}>
                            {milestone.title}
                        </h3>
                        <p className={`
                            text-sm mt-0.5
                            ${milestone.locked ? 'text-slate-700' : 'text-slate-400'}
                        `}>
                            {milestone.subtitle}
                        </p>
                    </div>

                    {/* Actions */}
                    {milestone.actions && milestone.actions.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {milestone.actions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    title={action.label}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {action.icon}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Timeline;
