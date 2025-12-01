import { useState, useEffect } from 'react';
import type { TabataProfile } from '../types';
import { DEFAULT_PROFILE } from '../types';
import { decodeProfileFromUrl } from '../utils/share';

const STORAGE_KEY = 'better_tabata_profiles';

export function useProfiles() {
    const [profiles, setProfiles] = useState<TabataProfile[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [DEFAULT_PROFILE];
    });

    const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0].id);

    // Save to localStorage whenever profiles change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }, [profiles]);

    // Check for shared profile in URL on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sharedProfile = decodeProfileFromUrl(params);

        if (sharedProfile) {
            // Check if we already have this profile (simple duplicate check by name/values could be added, but for now just add it)
            // Actually, let's ask the user or just add it. For simplicity, we'll add it if it doesn't exist.
            // But since ID is random, we can't easily check existence. 
            // Let's just append it and select it.

            // To avoid adding it on every reload, we should probably clear the URL or check if we just added it.
            // But clearing URL might be annoying if they want to bookmark it.
            // Alternative: The shared link IS the profile.
            // But the requirement says "save customized profiles".

            // Let's append it to the list if the user confirms? 
            // For now, let's just add it to the list and select it, 
            // but maybe we should only do this if the user explicitly clicks a "Import" button?
            // The requirement: "Opening the link will load that workout configuration."

            // Let's add it to the profiles list, but maybe mark it or something.
            // To prevent duplicates on reload, we can check if a profile with the same name and values exists.

            const isDuplicate = profiles.some(p =>
                p.name === sharedProfile.name &&
                p.workSeconds === sharedProfile.workSeconds &&
                p.restSeconds === sharedProfile.restSeconds &&
                p.sets === sharedProfile.sets
            );

            if (!isDuplicate) {
                setProfiles(prev => [...prev, sharedProfile]);
                setActiveProfileId(sharedProfile.id);
                // Optional: Clean URL
                window.history.replaceState({}, '', window.location.pathname);
            } else {
                // If duplicate exists, just select the existing one
                const existing = profiles.find(p =>
                    p.name === sharedProfile.name &&
                    p.workSeconds === sharedProfile.workSeconds &&
                    p.restSeconds === sharedProfile.restSeconds &&
                    p.sets === sharedProfile.sets
                );
                if (existing) setActiveProfileId(existing.id);
            }
        }
    }, []);

    const addProfile = (profile: TabataProfile) => {
        setProfiles(prev => [...prev, profile]);
        setActiveProfileId(profile.id);
    };

    const updateProfile = (updatedProfile: TabataProfile) => {
        setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    };

    const deleteProfile = (id: string) => {
        setProfiles(prev => {
            const newProfiles = prev.filter(p => p.id !== id);
            if (activeProfileId === id && newProfiles.length > 0) {
                setActiveProfileId(newProfiles[0].id);
            }
            return newProfiles;
        });
    };

    const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

    return {
        profiles,
        activeProfile,
        setActiveProfileId,
        addProfile,
        updateProfile,
        deleteProfile
    };
}
