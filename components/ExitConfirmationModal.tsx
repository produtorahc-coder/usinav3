import React from 'react';

interface ExitConfirmationModalProps {
    isOpen: boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm: () => void;
    onSave?: () => void;
    title?: string;
    message?: string;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    onSave,
    title = 'Deseja salvar antes de sair?',
    message = 'Você tem alterações não salvas. O que deseja fazer?'
}) => {
    if (!isOpen) return null;

    const handleClose = onClose || onCancel;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700 shadow-2xl animate-scale-in">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-accent-orange/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent-orange text-3xl">
                        warning
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-slate-400 text-center mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {/* Save and Exit */}
                    {onSave && (
                        <button
                            onClick={onSave}
                            className="w-full bg-gradient-to-r from-primary-purple to-primary-purple-dark hover:from-primary-purple-dark hover:to-primary-purple text-white font-bold py-3 rounded-xl transition-all"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">save</span>
                                Salvar e Sair
                            </span>
                        </button>
                    )}

                    {/* Exit without saving */}
                    <button
                        onClick={onConfirm}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">logout</span>
                            Sair sem Salvar
                        </span>
                    </button>

                    {/* Cancel */}
                    {handleClose && (
                        <button
                            onClick={handleClose}
                            className="w-full bg-transparent hover:bg-slate-700/50 text-slate-400 hover:text-white font-semibold py-3 rounded-xl transition-colors border border-slate-600"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExitConfirmationModal;
