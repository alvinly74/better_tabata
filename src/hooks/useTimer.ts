import { useState, useEffect, useRef, useCallback } from 'react';
import type { TabataProfile, TimerState } from '../types';
import { playBeep } from '../utils/sound';

export function useTimer(profile: TabataProfile) {
    const [status, setStatus] = useState<TimerState>('IDLE');
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isRunning, setIsRunning] = useState(false);

    // Use a ref for the interval to clear it easily
    const intervalRef = useRef<number | null>(null);

    // Sound effect refs (placeholders for now)
    // const playBeep = () => { /* TODO: Implement sound */ };

    const start = useCallback(() => {
        if (status === 'IDLE' || status === 'FINISHED') {
            setStatus('WARMUP');
            setTimeLeft(profile.warmupSeconds);
            setCurrentSet(1);
        }
        setIsRunning(true);
    }, [status, profile]);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setStatus('IDLE');
        setTimeLeft(0);
        setCurrentSet(1);
    }, []);

    const skip = useCallback(() => {
        // Force transition to next state
        setTimeLeft(0);
        // The effect will handle the transition on next tick or we can force it immediately.
        // Setting timeLeft to 0 relies on the effect running.
    }, []);

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1) {
                    // Play beep at 3, 2, 1
                    if (prev <= 4 && prev > 1) {
                        playBeep(880, 0.1, 'sine', 0.2);
                    }
                    return prev - 1;
                }

                // Time is up (prev === 1, so next is 0), transition needed
                // We return 0 here, and let the effect below handle the state change
                // Or handle it right here. Handling it here avoids a render cycle with 0.

                // Let's handle transition logic here for atomicity
                handleTransition();
                return 0; // This value might be overridden by handleTransition's state updates if we were using a reducer, 
                // but with multiple useState, we need to be careful.
                // Actually, it's better to use a reducer for complex state machines, but let's stick to this for simplicity if possible.
                // To avoid "0" flash, we can set the new time immediately.

                return 0;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, status, currentSet, profile]); // Dependencies need to be correct

    // Helper to handle state transitions
    // We need to access the latest state, so we might need refs or functional updates.
    // Since we are inside the effect, we have closure access to 'status' and 'currentSet' 
    // BUT they might be stale if the effect doesn't re-run.
    // The effect depends on them, so it re-runs when they change.

    const handleTransition = () => {
        // Play "Go" sound for new phase
        playBeep(1200, 0.3, 'sine', 0.3);

        // Determine next state based on current state
        switch (status) {
            case 'WARMUP':
                setStatus('WORK');
                setTimeLeft(profile.workSeconds);
                break;
            case 'WORK':
                if (currentSet < profile.sets) {
                    setStatus('REST');
                    setTimeLeft(profile.restSeconds);
                } else {
                    setStatus('COOLDOWN');
                    setTimeLeft(profile.cooldownSeconds);
                }
                break;
            case 'REST':
                setStatus('WORK');
                setTimeLeft(profile.workSeconds);
                setCurrentSet((prev) => prev + 1);
                break;
            case 'COOLDOWN':
                setStatus('FINISHED');
                setIsRunning(false);
                break;
            default:
                break;
        }
    };

    // Problem: handleTransition is called inside the interval callback.
    // The interval callback is defined in the effect.
    // The effect closes over 'status' and 'currentSet'.
    // When 'status' changes, the effect cleans up and restarts.
    // This is fine, but 'setTimeLeft(0)' in the interval might conflict with 'setTimeLeft(newTime)' in handleTransition.
    // If we call handleTransition, it calls setStatus and setTimeLeft.
    // The setTimeLeft(0) from the interval return value is ignored? No, it's the return value of the updater.

    // Refactored approach for stability:
    // Use a useEffect to watch 'timeLeft'. When it hits 0, transition.

    useEffect(() => {
        if (timeLeft === 0 && isRunning && status !== 'IDLE' && status !== 'FINISHED') {
            handleTransition();
        }
    }, [timeLeft, isRunning, status]);
    // Note: handleTransition needs to be stable or its dependencies included.
    // If we define handleTransition outside, it depends on state.

    // Let's redefine handleTransition inside the component scope (which it is)
    // and use it in the effect.

    return {
        status,
        timeLeft,
        currentSet,
        totalSets: profile.sets,
        isRunning,
        start,
        pause,
        reset,
        skip
    };
}
