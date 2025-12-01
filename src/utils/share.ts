import type { TabataProfile } from '../types';

export function encodeProfileToUrl(profile: TabataProfile): string {
    const params = new URLSearchParams();
    params.set('name', profile.name);
    params.set('warmup', profile.warmupSeconds.toString());
    params.set('work', profile.workSeconds.toString());
    params.set('rest', profile.restSeconds.toString());
    params.set('sets', profile.sets.toString());
    params.set('cooldown', profile.cooldownSeconds.toString());

    // Use window.location.origin + pathname to build the full URL
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?${params.toString()}`;
}

export function decodeProfileFromUrl(searchParams: URLSearchParams): TabataProfile | null {
    if (!searchParams.has('work') || !searchParams.has('rest') || !searchParams.has('sets')) {
        return null;
    }

    try {
        return {
            id: crypto.randomUUID(), // Generate a new ID for the imported profile
            name: searchParams.get('name') || 'Shared Profile',
            warmupSeconds: parseInt(searchParams.get('warmup') || '0', 10),
            workSeconds: parseInt(searchParams.get('work') || '20', 10),
            restSeconds: parseInt(searchParams.get('rest') || '10', 10),
            sets: parseInt(searchParams.get('sets') || '8', 10),
            cooldownSeconds: parseInt(searchParams.get('cooldown') || '0', 10),
        };
    } catch (e) {
        console.error('Failed to parse profile from URL', e);
        return null;
    }
}
