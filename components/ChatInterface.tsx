import React from 'react';

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp?: Date;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    title?: string;
    subtitle?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onSendMessage,
    placeholder = 'Digite sua mensagem...',
    isLoading = false,
    title,
    subtitle
}) => {
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-primary">
            {/* Header */}
            {(title || subtitle) && (
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div>
                        {title && (
                            <h1 className="text-lg font-bold text-white">{title}</h1>
                        )}
                        {subtitle && (
                            <p className="text-xs text-slate-400">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </button>
                        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-400">more_vert</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 animate-slideUp ${msg.isUser ? 'flex-row-reverse' : ''}`}
                    >
                        {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-primary-purple flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-sm">
                                    auto_awesome
                                </span>
                            </div>
                        )}
                        <div
                            className={`
                                max-w-[80%] rounded-2xl p-4
                                ${msg.isUser
                                    ? 'bg-gradient-to-br from-primary-purple to-primary-purple-dark text-white'
                                    : 'bg-slate-800 text-slate-100'
                                }
                            `}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.content}
                            </p>
                        </div>
                        {msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-sm">
                                    person
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-purple flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm animate-pulse">
                                auto_awesome
                            </span>
                        </div>
                        <div className="bg-slate-800 rounded-2xl p-4">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-400">
                            attach_file
                        </span>
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="
                            flex-1 bg-slate-800 rounded-xl px-4 py-3 
                            text-white placeholder-slate-500
                            focus:outline-none focus:ring-2 focus:ring-primary-purple
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="
                            p-3 bg-primary-purple rounded-xl
                            hover:bg-primary-purple-dark
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-colors
                        "
                    >
                        <span className="material-symbols-outlined text-white">
                            send
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
