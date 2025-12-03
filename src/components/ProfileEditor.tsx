import { useState } from 'react';
import type { TabataProfile } from '../types';
import { Share2, Trash2, Plus } from 'lucide-react';
import { encodeProfileToUrl } from '../utils/share';

interface ProfileEditorProps {
    profile: TabataProfile;
    profiles: TabataProfile[];
    onUpdate: (profile: TabataProfile) => void;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export function ProfileEditor({
    profile,
    profiles,
    onUpdate,
    onDelete,
    onSelect,
    onAdd,
}: ProfileEditorProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const url = encodeProfileToUrl(profile);
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (field: keyof TabataProfile, value: string | number) => {
        onUpdate({ ...profile, [field]: value });
    };

    const totalDuration =
        profile.warmupSeconds +
        (profile.workSeconds + profile.restSeconds) * profile.sets +
        profile.cooldownSeconds;

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const TimeInput = ({ label, seconds, onChange }: { label: string, seconds: number, onChange: (val: number) => void }) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;

        const updateTime = (newM: number, newS: number) => {
            onChange(newM * 60 + newS);
        };

        return (
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                        <input
                            type="number"
                            min="0"
                            value={m}
                            onChange={(e) => updateTime(parseInt(e.target.value) || 0, s)}
                            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-16 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="text-[10px] text-center text-gray-500">min</span>
                    </div>
                    <span className="text-gray-500 font-bold">:</span>
                    <div className="flex flex-col">
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={s}
                            onChange={(e) => updateTime(m, parseInt(e.target.value) || 0)}
                            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-16 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="text-[10px] text-center text-gray-500">sec</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-900 p-6 rounded-3xl shadow-xl w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Configuration</h2>
                <div className="flex gap-2">
                    <select
                        value={profile.id}
                        onChange={(e) => onSelect(e.target.value)}
                        className="bg-gray-800 text-white text-sm rounded-lg block p-2.5 border-none focus:ring-2 focus:ring-blue-500"
                    >
                        {profiles.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button onClick={onAdd} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors" title="New Profile">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Profile Name</label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <TimeInput
                        label="Warm Up"
                        seconds={profile.warmupSeconds}
                        onChange={(val) => handleChange('warmupSeconds', val)}
                    />
                    <TimeInput
                        label="Cool Down"
                        seconds={profile.cooldownSeconds}
                        onChange={(val) => handleChange('cooldownSeconds', val)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <TimeInput
                        label="Work"
                        seconds={profile.workSeconds}
                        onChange={(val) => handleChange('workSeconds', val)}
                    />
                    <TimeInput
                        label="Rest"
                        seconds={profile.restSeconds}
                        onChange={(val) => handleChange('restSeconds', val)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-baseline">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Sets</label>
                        <span className="text-xs text-blue-400 font-medium">Total: {formatDuration(totalDuration)}</span>
                    </div>
                    <input
                        type="number"
                        min="1"
                        value={profile.sets}
                        onChange={(e) => handleChange('sets', parseInt(e.target.value) || 1)}
                        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none text-white"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                    <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-blue-400 font-medium"
                    >
                        <Share2 size={18} />
                        {copied ? 'Copied!' : 'Share'}
                    </button>

                    {profiles.length > 1 && (
                        <button
                            onClick={() => onDelete(profile.id)}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-red-900/30 rounded-xl transition-colors text-red-400 font-medium"
                            title="Delete Profile"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
