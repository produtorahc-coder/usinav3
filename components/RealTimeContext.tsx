import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

type Listener = (data: any) => void;

interface RealTimeContextType {
    isConnected: boolean;
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
    emit: (event: string, data: any) => void;
    on: (event: string, callback: Listener) => void;
    off: (event: string, callback: Listener) => void;
}

const RealTimeContext = createContext<RealTimeContextType>({} as any);

export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const listeners = useRef<Record<string, Listener[]>>({});
    const activeRooms = useRef<Set<string>>(new Set());

    const settingsRef = useRef<any>({ enabled: true, frequency_limit: 999, start_time: '00:00', end_time: '23:59' });
    const notificationsShown = useRef(0);

    useEffect(() => {
        // Fetch initial settings
        const fetchSettings = async () => {
            const { data } = await supabase.from('app_settings').select('value').eq('key', 'notifications').single();
            if (data) settingsRef.current = data.value;
        };
        fetchSettings();

        // Subscribe to changes
        const channel = supabase
            .channel('app_settings_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_settings', filter: "key=eq.notifications" }, (payload: any) => {
                console.log('[WS] Configurações atualizadas:', payload.new.value);
                settingsRef.current = payload.new.value;
            })
            .subscribe();

        // Simula conexão
        const timer = setTimeout(() => {
            setIsConnected(true);
            console.log('[WS] Conectado ao servidor de eventos.');
        }, 1000);

        // Simula alertas de prazo vindos do servidor aleatoriamente
        const alertInterval = setInterval(() => {
            // Check settings
            if (!settingsRef.current.enabled) return;

            // Check time
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            if (currentTime < settingsRef.current.start_time || currentTime > settingsRef.current.end_time) return;

            // Check frequency limit
            if (notificationsShown.current >= settingsRef.current.frequency_limit) return;

            // 20% de chance a cada 30s de receber um alerta
            if (Math.random() > 0.8) {
                notificationsShown.current += 1;
                dispatch('alerta-prazo', {
                    id: Date.now(),
                    title: '🚨 Prazo Crítico',
                    message: 'O Edital Lei Paulo Gustavo encerra em menos de 2 horas!',
                    type: 'urgent'
                });
            }
        }, 30000);

        return () => {
            clearTimeout(timer);
            clearInterval(alertInterval);
            supabase.removeChannel(channel);
        };
    }, []);

    const dispatch = (event: string, data: any) => {
        if (listeners.current[event]) {
            listeners.current[event].forEach(cb => cb(data));
        }
    };

    const emit = (event: string, data: any) => {
        console.log(`[WS] Emitting ${event}:`, data);

        // Simula delay de rede e broadcast
        setTimeout(() => {
            if (event === 'completar-tarefa') {
                // Ecoa o evento de volta como 'missao-atualizada'
                dispatch('missao-atualizada', {
                    user: 'Você',
                    action: 'completou uma tarefa',
                    progressDelta: 10,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        }, 600);
    };

    const on = (event: string, callback: Listener) => {
        if (!listeners.current[event]) listeners.current[event] = [];
        listeners.current[event].push(callback);
    };

    const off = (event: string, callback: Listener) => {
        if (!listeners.current[event]) return;
        listeners.current[event] = listeners.current[event].filter(cb => cb !== callback);
    };

    const joinRoom = (roomId: string) => {
        if (activeRooms.current.has(roomId)) return;

        console.log(`[WS] Entrou na sala: ${roomId}`);
        activeRooms.current.add(roomId);

        // Simula atividade de outros usuários na sala
        if (roomId.includes('mission')) {
            setTimeout(() => {
                dispatch('missao-atualizada', {
                    user: 'Ana (Equipe)',
                    action: 'anexou Documento RG',
                    progressDelta: 5,
                    timestamp: new Date().toLocaleTimeString()
                });
            }, 5000);

            setTimeout(() => {
                dispatch('missao-atualizada', {
                    user: 'Carlos (Financeiro)',
                    action: 'aprovou o orçamento preliminar',
                    progressDelta: 8,
                    timestamp: new Date().toLocaleTimeString()
                });
            }, 12000);
        }
    };

    const leaveRoom = (roomId: string) => {
        console.log(`[WS] Saiu da sala: ${roomId}`);
        activeRooms.current.delete(roomId);
    };

    return (
        <RealTimeContext.Provider value={{ isConnected, joinRoom, leaveRoom, emit, on, off }}>
            {children}
        </RealTimeContext.Provider>
    );
};