import React from 'react';

interface ProfileCardProps {
    name: string;
    level: number;
    organization: string;
    currentXP: number;
    maxXP: number;
    avatarUrl?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    level,
    organization,
    currentXP,
    maxXP,
    avatarUrl
}) => {
    const percentage = Math.round((currentXP / maxXP) * 100);
    const nextLevel = level + 1;

    return (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-fadeIn">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full border-4 border-primary-purple overflow-hidden flex-shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-purple to-primary-purple-dark flex items-center justify-center text-2xl font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">{name}</h2>
                    <p className="text-sm text-slate-400">Nível {level} • {organization}</p>

                    {/* Progress */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">PROGRESSO PARA NÍVEL {nextLevel}</span>
                            <span className="text-white font-semibold">{currentXP}/{maxXP} XP</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-purple to-primary-purple-light transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 text-right mt-1">{percentage}% concluído</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
