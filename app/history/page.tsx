'use client';

import { Suspense, useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Calendar, Copy, Check, ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { Prompt } from '@prisma/client';

// Define extended type for Prompt with relations
type HistoryItem = Prompt & { children?: Prompt[] };

function HistoryContent() {
    const { isLoaded, userId } = useAuth();
    const router = useRouter();
    const [prompts, setPrompts] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [copiedState, setCopiedState] = useState<{ id: string, type: 'original' | 'enhanced' } | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Grouping state
    const [groups, setGroups] = useState<Record<string, HistoryItem[]>>({});
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    // Improvement expansion state
    const [expandedImprovements, setExpandedImprovements] = useState<Record<string, boolean>>({});

    // URL params for highlighting
    const searchParams = useSearchParams();
    const highlightId = searchParams.get('highlight');

    // Auto-expand improvements for highlighted item
    useEffect(() => {
        if (highlightId && prompts.length > 0) {
            setExpandedImprovements(prev => ({
                ...prev,
                [highlightId]: true
            }));
            // Scroll to the highlighted item
            setTimeout(() => {
                const element = document.getElementById(`prompt-${highlightId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [highlightId, prompts]);

    useEffect(() => {
        if (isLoaded && !userId) {
            router.push('/');
        } else if (isLoaded && userId) {
            fetchHistory(1); // Initial fetch
        }
    }, [isLoaded, userId, router]);

    const fetchHistory = async (pageNum: number) => {
        try {
            if (pageNum === 1) setIsLoading(true);
            else setIsLoadingMore(true);

            const response = await fetch(`/api/history?page=${pageNum}&limit=20`);
            if (response.ok) {
                const data = await response.json();
                const newItems = data.items as HistoryItem[];

                setPrompts(prev => {
                    const combined = pageNum === 1 ? newItems : [...prev, ...newItems];
                    return combined;
                });
                setHasMore(data.hasMore);

                // Update groups via effect
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Effect to group prompts when prompts array changes
    useEffect(() => {
        const newGroups: Record<string, HistoryItem[]> = {};

        prompts.forEach(prompt => {
            const date = new Date(prompt.createdAt);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let key = date.toLocaleDateString();

            if (date.toDateString() === today.toDateString()) {
                key = "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                key = "Yesterday";
            }

            if (!newGroups[key]) {
                newGroups[key] = [];
            }
            newGroups[key].push(prompt);
        });

        setGroups(newGroups);

        if (page === 1) {
            setOpenGroups(prev => {
                const next = { ...prev };
                Object.keys(newGroups).forEach(k => {
                    if (next[k] === undefined) next[k] = true;
                });
                return next;
            });
        }
    }, [prompts, page]);

    const toggleGroup = (group: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHistory(nextPage);
    };

    const handleCopy = (text: string, id: string, type: 'original' | 'enhanced') => {
        navigator.clipboard.writeText(text);
        setCopiedState({ id, type });
        setTimeout(() => setCopiedState(null), 2000);
    };

    const toggleImprovements = (id: string) => {
        setExpandedImprovements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Helper to get improvement_plan from enhancement field
    const getImprovementPlan = (enhancement: string) => {
        try {
            const enhData = typeof enhancement === 'string' ? JSON.parse(enhancement) : enhancement;
            return enhData?.improvement_plan || null;
        } catch {
            return null;
        }
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

                {Object.keys(groups).length === 0 && !isLoading ? (
                    <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                        <p className="text-slate-400 text-lg">No prompts found yet. Start generating!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.keys(groups).map((dateGroup) => (
                            <div key={dateGroup} className="space-y-2">
                                <button
                                    onClick={() => toggleGroup(dateGroup)}
                                    className="flex items-center text-slate-300 font-semibold text-lg hover:text-white transition-colors w-full text-left"
                                >
                                    {openGroups[dateGroup] ? (
                                        <ChevronDown className="w-5 h-5 mr-2" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 mr-2" />
                                    )}
                                    {dateGroup}
                                    <span className="ml-2 text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                                        {groups[dateGroup].length}
                                    </span>
                                </button>

                                {openGroups[dateGroup] && (
                                    <div className="grid gap-6 pl-2 sm:pl-4 border-l-2 border-slate-800 ml-2.5">
                                        {groups[dateGroup].map((prompt) => {
                                            const latestVersion = (prompt.children && prompt.children.length > 0) ? prompt.children[0] : prompt;
                                            const isEdited = prompt.children && prompt.children.length > 0;

                                            const getContent = (p: Prompt) => {
                                                let raw = p.enhancedOutput;
                                                try {
                                                    // Handle Vercel AI SDK streaming format (0:"...", 0:"...", etc)
                                                    if (raw.includes('0:"')) {
                                                        // Remove the "0:" prefixes and reconstruct
                                                        let cleaned = raw.replace(/^\d+:/gm, '');
                                                        // Parse and concatenate the JSON string chunks
                                                        const lines = cleaned.split('\n').filter(line => line.trim());
                                                        let reconstructed = '';
                                                        for (const line of lines) {
                                                            if (line.startsWith('e:') || line.startsWith('d:')) continue;
                                                            try {
                                                                if (line.startsWith('"') && line.endsWith('"')) {
                                                                    reconstructed += JSON.parse(line);
                                                                } else {
                                                                    reconstructed += line;
                                                                }
                                                            } catch {
                                                                reconstructed += line;
                                                            }
                                                        }
                                                        raw = reconstructed;
                                                    }

                                                    // Check for markdown code blocks
                                                    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                                                    const jsonStr = (match && match[1]) ? match[1] : raw;

                                                    // Try to parse as JSON
                                                    let parsed;
                                                    try {
                                                        parsed = JSON.parse(jsonStr);
                                                    } catch {
                                                        // Try extracting JSON object from the string
                                                        const firstOpen = jsonStr.indexOf('{');
                                                        const lastClose = jsonStr.lastIndexOf('}');
                                                        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
                                                            parsed = JSON.parse(jsonStr.substring(firstOpen, lastClose + 1));
                                                        }
                                                    }

                                                    if (parsed) {
                                                        return parsed.enhanced_prompt || parsed.text || parsed.prompt || raw;
                                                    }
                                                    return raw;
                                                } catch {
                                                    return raw;
                                                }
                                            };

                                            const displayContent = getContent(latestVersion);

                                            return (
                                                <div key={prompt.id} id={`prompt-${prompt.id}`} className={`bg-slate-800/50 rounded-xl p-6 border transition-colors ${highlightId === prompt.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700 hover:border-blue-500/30'}`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center text-slate-400 text-sm">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {new Date(prompt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {(() => {
                                                                // Try to parse enhancement level from the enhancement field
                                                                try {
                                                                    const enhData = typeof prompt.enhancement === 'string'
                                                                        ? JSON.parse(prompt.enhancement)
                                                                        : prompt.enhancement;
                                                                    const level = enhData?.enhancementLevel || enhData?.level;
                                                                    if (level) {
                                                                        const levelColors: Record<string, string> = {
                                                                            light: 'bg-green-500/20 text-green-400',
                                                                            standard: 'bg-blue-500/20 text-blue-400',
                                                                            comprehensive: 'bg-purple-500/20 text-purple-400',
                                                                        };
                                                                        return (
                                                                            <span className={`text-xs px-2 py-1 rounded ${levelColors[level] || 'bg-slate-600 text-slate-300'}`}>
                                                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                                                            </span>
                                                                        );
                                                                    }
                                                                } catch {
                                                                    // Enhancement field not valid JSON
                                                                }
                                                                return null;
                                                            })()}
                                                            <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                                                                {prompt.modelUsed}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Original Input</h3>
                                                                <button
                                                                    onClick={() => handleCopy(prompt.originalInput, prompt.id, 'original')}
                                                                    className="text-slate-400 hover:text-white transition-colors"
                                                                    title="Copy original prompt"
                                                                >
                                                                    {copiedState?.id === prompt.id && copiedState?.type === 'original' ? (
                                                                        <Check className="w-4 h-4 text-green-400" />
                                                                    ) : (
                                                                        <Copy className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="text-slate-300 bg-slate-900/50 p-3 rounded-lg text-sm max-h-[200px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                                {prompt.originalInput}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                                                                    {isEdited ? 'Latest Version' : 'Enhanced Version'}
                                                                </h3>
                                                                <button
                                                                    onClick={() => handleCopy(displayContent, prompt.id, 'enhanced')}
                                                                    className="text-slate-400 hover:text-white transition-colors"
                                                                    title="Copy enhanced prompt"
                                                                >
                                                                    {copiedState?.id === prompt.id && copiedState?.type === 'enhanced' ? (
                                                                        <Check className="w-4 h-4 text-green-400" />
                                                                    ) : (
                                                                        <Copy className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="text-slate-100 bg-slate-900/50 p-3 rounded-lg text-sm font-mono max-h-[200px] overflow-y-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                                {displayContent}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isEdited && (
                                                        <div className="mt-3 flex justify-end">
                                                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full flex items-center">
                                                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                                                                Edited
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Improvement Plan Section */}
                                                    {(() => {
                                                        const improvementPlan = getImprovementPlan(prompt.enhancement);
                                                        if (!improvementPlan) return null;

                                                        const criticality = improvementPlan.criticality || 'moderate';
                                                        const criticalityColors: Record<string, string> = {
                                                            minor: 'text-green-400 border-green-500/30 bg-green-500/10',
                                                            moderate: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
                                                            critical: 'text-red-400 border-red-500/30 bg-red-500/10'
                                                        };
                                                        const iconColors: Record<string, string> = {
                                                            minor: 'text-green-400',
                                                            moderate: 'text-orange-400',
                                                            critical: 'text-red-400'
                                                        };

                                                        return (
                                                            <div className="mt-4 border-t border-slate-700 pt-4">
                                                                <button
                                                                    onClick={() => toggleImprovements(prompt.id)}
                                                                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg border transition-colors ${criticalityColors[criticality] || criticalityColors.moderate}`}
                                                                >
                                                                    <Lightbulb className={`w-5 h-5 ${iconColors[criticality] || iconColors.moderate}`} />
                                                                    <span className="flex-1 text-sm font-medium">
                                                                        {improvementPlan.summary || '3 Ways to Improve This Prompt'}
                                                                    </span>
                                                                    {expandedImprovements[prompt.id] ? (
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    )}
                                                                </button>

                                                                {expandedImprovements[prompt.id] && improvementPlan.items && (
                                                                    <div className="mt-3 space-y-3">
                                                                        {improvementPlan.items.map((item: { title: string; description: string; example_change?: string }, idx: number) => (
                                                                            <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                                                                <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                                                                                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                                                                                        {idx + 1}
                                                                                    </span>
                                                                                    {item.title}
                                                                                </h4>
                                                                                <p className="text-sm text-slate-400 mb-2">{item.description}</p>
                                                                                {item.example_change && item.example_change !== 'N/A - requires user-specific info' && (
                                                                                    <div className="bg-slate-800 rounded p-2 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                                                                                        {item.example_change}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {hasMore && (
                            <div className="flex justify-center pt-8 pb-4">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// Wrapper component with Suspense boundary for useSearchParams
export default function HistoryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <Navigation />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
            </div>
        }>
            <HistoryContent />
        </Suspense>
    );
}
