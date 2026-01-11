'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Check } from 'lucide-react';
import { toast } from 'sonner';

// Available Claude models
const CLAUDE_MODELS = [
    { id: 'claude-sonnet-4-5-20250929', label: 'Sonnet 4.5 (Latest)', family: 'sonnet' },
    { id: 'claude-sonnet-4-1-20250805', label: 'Sonnet 4', family: 'sonnet' },
    { id: 'claude-3-5-sonnet-20241022', label: 'Sonnet 3.5', family: 'sonnet' },
    { id: 'claude-opus-4-5-20251101', label: 'Opus 4.5 (Latest)', family: 'opus' },
    { id: 'claude-opus-4-1-20250805', label: 'Opus 4.1', family: 'opus' },
    { id: 'claude-3-opus-20240229', label: 'Opus 3', family: 'opus' },
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 (Latest)', family: 'haiku' },
    { id: 'claude-3-5-haiku-20241022', label: 'Haiku 3.5', family: 'haiku' },
];

// Supported AI sites
const AI_SITES = [
    { id: 'chatgpt.com', label: 'ChatGPT', icon: '🤖' },
    { id: 'claude.ai', label: 'Claude', icon: '🧠' },
    { id: 'gemini.google.com', label: 'Gemini', icon: '✨' },
    { id: 'notebooklm.google.com', label: 'NotebookLM', icon: '📓' },
];

interface Settings {
    defaultModel: string;
    defaultLevel: string;
    enabledSites: string[];
}

export default function SettingsPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [settings, setSettings] = useState<Settings>({
        defaultModel: 'claude-sonnet-4-5-20250929',
        defaultLevel: 'standard',
        enabledSites: ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'notebooklm.google.com'],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load settings
    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await fetch('/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded) {
            loadSettings();
        }
    }, [isLoaded]);

    // Save settings
    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setSaved(true);
                toast.success('Settings saved!');
                setTimeout(() => setSaved(false), 2000);
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    // Toggle site
    const toggleSite = (siteId: string) => {
        setSettings(prev => ({
            ...prev,
            enabledSites: prev.enabledSites.includes(siteId)
                ? prev.enabledSites.filter(s => s !== siteId)
                : [...prev.enabledSites, siteId],
        }));
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Navigation />
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Navigation />
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Settings</h1>
                        <p className="text-slate-400">Please sign in to manage your settings.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Navigation />
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

                    {/* Default Enhancement Options */}
                    <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Default Enhancement Options</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            These settings are used when you enhance prompts via the browser extension.
                        </p>

                        {/* Enhancement Level */}
                        <div className="mb-6">
                            <Label className="text-slate-300 font-medium mb-3 block">Enhancement Level</Label>
                            <RadioGroup
                                value={settings.defaultLevel}
                                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultLevel: value }))}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                            >
                                {[
                                    { value: 'light', label: 'Light', desc: 'Basic fixes' },
                                    { value: 'standard', label: 'Standard', desc: 'Balanced' },
                                    { value: 'comprehensive', label: 'Comprehensive', desc: 'Maximum' },
                                ].map((level) => (
                                    <div key={level.value}>
                                        <Label
                                            htmlFor={level.value}
                                            className={`
                        flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${settings.defaultLevel === level.value
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                                                }
                      `}
                                        >
                                            <RadioGroupItem value={level.value} id={level.value} className="mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-white">{level.label}</div>
                                                <div className="text-xs text-slate-400">{level.desc}</div>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Default Model */}
                        <div>
                            <Label className="text-slate-300 font-medium mb-3 block">Default Model</Label>
                            <Select
                                value={settings.defaultModel}
                                onValueChange={(value) => setSettings(prev => ({ ...prev, defaultModel: value }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="claude-sonnet-4-5-20250929">Sonnet 4.5 (Recommended)</SelectItem>
                                    <SelectItem value="claude-sonnet-4-1-20250805">Sonnet 4</SelectItem>
                                    <SelectItem value="claude-3-5-sonnet-20241022">Sonnet 3.5</SelectItem>
                                    <SelectItem value="claude-opus-4-5-20251101">Opus 4.5 (Most capable)</SelectItem>
                                    <SelectItem value="claude-haiku-4-5-20251001">Haiku 4.5 (Fastest)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Enabled Sites */}
                    <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Extension Widget Sites</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Choose which AI sites show the floating enhancement widget.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {AI_SITES.map((site) => (
                                <label
                                    key={site.id}
                                    className={`
                    flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${settings.enabledSites.includes(site.id)
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                                        }
                  `}
                                >
                                    <Checkbox
                                        checked={settings.enabledSites.includes(site.id)}
                                        onCheckedChange={() => toggleSite(site.id)}
                                        className="mr-3"
                                    />
                                    <span className="text-xl mr-3">{site.icon}</span>
                                    <span className="text-white font-medium">{site.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
