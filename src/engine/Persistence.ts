import type { MemoryGraphData } from './types';

const STORAGE_KEY = 'intentos_memory_v1';

const DEFAULT_MEMORY: MemoryGraphData = {
    transitions: [],
    policyScores: [],
    totalSessions: 0
};

export class Persistence {
    public static load(): MemoryGraphData {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return DEFAULT_MEMORY;
            return JSON.parse(raw) as MemoryGraphData;
        } catch (e) {
            console.error("Failed to load IntentOS memory", e);
            return DEFAULT_MEMORY;
        }
    }

    public static save(data: MemoryGraphData): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save IntentOS memory", e);
        }
    }

    public static clear(): void {
        localStorage.removeItem(STORAGE_KEY);
    }
}
