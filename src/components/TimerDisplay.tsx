import type { TimerState } from '../types';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

interface TimerDisplayProps {
    status: TimerState;
    timeLeft: number;
    currentSet: number;
    totalSets: number;
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
}

const PHASE_COLORS: Record<TimerState, string> = {
    IDLE: 'bg-gray-800 text-gray-100',
    WARMUP: 'bg-yellow-600 text-white',
    WORK: 'bg-green-600 text-white',
    REST: 'bg-red-600 text-white',
    COOLDOWN: 'bg-blue-600 text-white',
    FINISHED: 'bg-purple-600 text-white',
};

const PHASE_LABELS: Record<TimerState, string> = {
    IDLE: 'Ready',
    WARMUP: 'Warm Up',
    WORK: 'Work',
    REST: 'Rest',
    COOLDOWN: 'Cool Down',
    FINISHED: 'Complete!',
};

export function TimerDisplay({
    status,
    timeLeft,
    currentSet,
    totalSets,
    isRunning,
    onStart,
    onPause,
    onReset,
    onSkip,
}: TimerDisplayProps) {

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={clsx(
            'flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-3xl transition-colors duration-500 p-8 shadow-2xl',
            PHASE_COLORS[status]
        )}>
            <div className="text-2xl font-medium tracking-wider uppercase opacity-90 mb-4">
                {PHASE_LABELS[status]}
            </div>

            <div className="text-9xl font-bold tabular-nums tracking-tight mb-8">
                {formatTime(timeLeft)}
            </div>

            {status !== 'IDLE' && status !== 'FINISHED' && (
                <div className="flex items-center gap-2 text-xl font-medium opacity-80 mb-12">
                    <span>Set</span>
                    <span className="text-3xl">{currentSet}</span>
                    <span>/</span>
                    <span>{totalSets}</span>
                </div>
            )}

            <div className="flex items-center gap-6 mt-auto">
                {status === 'IDLE' || status === 'FINISHED' ? (
                    <button
                        onClick={onStart}
                        className="p-6 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all active:scale-95"
                    >
                        <Play size={48} fill="currentColor" />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={onReset}
                            className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all active:scale-95"
                            title="Reset"
                        >
                            <RotateCcw size={24} />
                        </button>

                        <button
                            onClick={isRunning ? onPause : onStart}
                            className="p-6 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all active:scale-95"
                        >
                            {isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
                        </button>

                        <button
                            onClick={onSkip}
                            className="p-4 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all active:scale-95"
                            title="Skip Phase"
                        >
                            <SkipForward size={24} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
