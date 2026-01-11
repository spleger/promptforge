'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, Copy, Check } from 'lucide-react';
import { Prompt } from '@prisma/client';

export default function HistoryPage() {
    const { isLoaded, userId } = useAuth();
    const router = useRouter();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && !userId) {
            router.push('/');
        } else if (isLoaded && userId) {
            fetchHistory();
        }
    }, [isLoaded, userId, router]);

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/history');
            if (response.ok) {
                const data = await response.json();
                setPrompts(data);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <Navigation />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Navigation />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
                <h1 className="text-3xl font-bold text-white mb-8">Your Prompt History</h1>

                {prompts.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                        <p className="text-slate-400 text-lg">No prompts found yet. Start generating!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {prompts.map((prompt) => (
                            <div key={prompt.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(prompt.createdAt).toLocaleDateString()}
                                    </div>
                                    <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                                        {prompt.modelUsed}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Original Input</h3>
                                        <p className="text-slate-300 bg-slate-900/50 p-3 rounded-lg text-sm line-clamp-3">
                                            {prompt.originalInput}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Enhanced Version</h3>
                                            <button
                                                onClick={() => handleCopy(prompt.enhancedOutput, prompt.id)}
                                                className="text-slate-400 hover:text-white transition-colors"
                                                title="Copy enhanced prompt"
                                            >
                                                {copiedId === prompt.id ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-slate-100 bg-slate-900/50 p-3 rounded-lg text-sm line-clamp-3 font-mono">
                                            {(() => {
                                                try {
                                                    const parsed = JSON.parse(prompt.enhancedOutput);
                                                    return parsed.text || parsed.prompt || prompt.enhancedOutput;
                                                } catch {
                                                    return prompt.enhancedOutput;
                                                }
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
