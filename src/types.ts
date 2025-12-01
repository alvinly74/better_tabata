export interface TabataProfile {
    id: string;
    name: string;
    warmupSeconds: number;
    workSeconds: number;
    restSeconds: number;
    sets: number;
    cooldownSeconds: number;
}

export const DEFAULT_PROFILE: TabataProfile = {
    id: 'default',
    name: 'Classic Tabata',
    warmupSeconds: 120, // 2 minutes
    workSeconds: 20,
    restSeconds: 10,
    sets: 8,
    cooldownSeconds: 120, // 2 minutes
};

export type TimerState = 'IDLE' | 'WARMUP' | 'WORK' | 'REST' | 'COOLDOWN' | 'FINISHED';
