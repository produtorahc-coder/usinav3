import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface NotificationSettings {
    enabled: boolean;
    frequency_limit: number;
    show_dates: string[];
    start_time: string;
    end_time: string;
}

const AdminNotifications: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettings>({
        enabled: true,
        frequency_limit: 5,
        show_dates: [],
        start_time: '08:00',
        end_time: '18:00'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'notifications')
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found, use defaults
                    return;
                }
                throw error;
            }
            if (data) {
                setSettings(data.value);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage('Erro ao carregar configurações. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (newSettings: NotificationSettings) => {
        setSaving(true);
        // Optimistic update
        const prevSettings = settings;
        setSettings(newSettings);

        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'notifications',
                    value: newSettings,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setMessage('Configurações salvas com sucesso!');
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSettings(prevSettings); // Rollback
            setMessage('Erro ao salvar as configurações.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Controle de Notificações</h2>
                <p className="text-gray-500">Gerencie quando e como as notificações são exibidas para os usuários.</p>
            </div>

            {/* Global Switch */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Status do Sistema</h3>
                    <p className="text-gray-500 text-sm">Desative para silenciar todas as notificações do sistema imediatamente.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.enabled}
                        onChange={(e) => handleSave({ ...settings, enabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {/* Frequency Control */}
            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6 transition-opacity ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Regras de Exibição</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Limite de Frequência (por usuário)</label>
                        <p className="text-xs text-gray-500 mb-2">Quantas vezes a notificação aparecerá antes de ser silenciada.</p>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={settings.frequency_limit}
                                onChange={(e) => setSettings({ ...settings, frequency_limit: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="font-bold text-blue-600 text-xl w-12 text-center">{settings.frequency_limit}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Horário de Funcionamento</label>
                        <p className="text-xs text-gray-500 mb-2">Intervalo em que as notificações podem ser enviadas.</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                value={settings.start_time}
                                onChange={(e) => setSettings({ ...settings, start_time: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                            <span className="text-gray-400">até</span>
                            <input
                                type="time"
                                value={settings.end_time}
                                onChange={(e) => setSettings({ ...settings, end_time: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={() => handleSave(settings)}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 animate-bounce-in ${message.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span className="material-symbols-outlined">{message.includes('Erro') ? 'error' : 'check_circle'}</span>
                    {message}
                </div>
            )}
        </div>
    );
};

export default AdminNotifications;
