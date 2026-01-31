import React from 'react';

interface BottomNavItem {
    id: string;
    icon: string;
    label: string;
    onClick: () => void;
}

interface BottomNavigationProps {
    items: BottomNavItem[];
    activeId: string;
    onFabClick?: () => void;
    fabIcon?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    items,
    activeId,
    onFabClick,
    fabIcon = 'add'
}) => {
    // Split items to place FAB in the middle
    const leftItems = items.slice(0, 2);
    const rightItems = items.slice(2);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50 no-print">
            <div className="flex items-center justify-around py-3 px-4 max-w-md mx-auto">
                {/* Left Items */}
                {leftItems.map(item => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
                            flex flex-col items-center gap-1 min-w-[60px]
                            transition-colors duration-200
                            ${activeId === item.id
                                ? 'text-accent-orange'
                                : 'text-slate-400 hover:text-white'
                            }
                        `}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {item.icon}
                        </span>
                        <span className="text-xs font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}

                {/* FAB (Floating Action Button) */}
                {onFabClick && (
                    <div className="relative -mt-8">
                        <button
                            onClick={onFabClick}
                            className="
                                w-14 h-14 rounded-full 
                                bg-gradient-to-br from-accent-orange to-accent-orange-dark
                                text-white shadow-xl
                                flex items-center justify-center
                                transition-all duration-200
                                hover:scale-110 hover:shadow-2xl hover:shadow-accent-orange/50
                                active:scale-95
                            "
                        >
                            <span className="material-symbols-outlined text-3xl">
                                {fabIcon}
                            </span>
                        </button>
                    </div>
                )}

                {/* Right Items */}
                {rightItems.map(item => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className={`
                            flex flex-col items-center gap-1 min-w-[60px]
                            transition-colors duration-200
                            ${activeId === item.id
                                ? 'text-accent-orange'
                                : 'text-slate-400 hover:text-white'
                            }
                        `}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {item.icon}
                        </span>
                        <span className="text-xs font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigation;
