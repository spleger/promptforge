'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Copy, Check, ChevronDown, ChevronUp, Lightbulb, Loader2 } from 'lucide-react';
import { EnhancementResult } from '@/lib/types';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';

interface PromptOutputProps {
  result: EnhancementResult | null;
  isLoading: boolean;
}

export function PromptOutput({ result, isLoading }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const handleCopy = async () => {
    if (!result?.enhanced_prompt) return;

    const success = await copyToClipboard(result.enhanced_prompt);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'complex':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center py-6 sm:py-8 gap-3">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
            <span className="text-slate-400 text-sm sm:text-base text-center">Analyzing and enhancing your prompt...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Enhanced Prompt Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
              Enhanced Prompt
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className={`${getComplexityColor(result.analysis.complexity)} text-xs`}>
                      {result.analysis.complexity}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Detected complexity level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <CardDescription className="text-slate-400 text-sm mt-2">
            {result.explanation}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="bg-slate-900/70 rounded-lg p-3 sm:p-4 border border-slate-700">
            <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-200 font-mono leading-relaxed overflow-x-auto">
              {result.enhanced_prompt}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Collapsible open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <Card className="bg-slate-800/50 border-slate-700">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors rounded-t-lg p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                  <span className="hidden xs:inline">Analysis &</span> Techniques
                  <Badge variant="secondary" className="bg-slate-700 text-xs">
                    {result.analysis.techniques_applied.length}
                  </Badge>
                </CardTitle>
                {analysisOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
              {/* Intent & Domain */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2">Detected Intent</h4>
                  <p className="text-white text-sm sm:text-base">{result.analysis.detected_intent}</p>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-400 mb-1 sm:mb-2">Domain</h4>
                  <p className="text-white text-sm sm:text-base">{result.analysis.domain}</p>
                </div>
              </div>

              {/* Applied Techniques */}
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-slate-400 mb-2">Applied Techniques</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {result.analysis.techniques_applied.map((technique, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs"
                    >
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Elements */}
              {result.analysis.missing_elements.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-slate-400 mb-2">Missing Elements</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                    {result.analysis.missing_elements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Suggestions Section */}
      {result.suggestions.length > 0 && (
        <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
          <Card className="bg-slate-800/50 border-slate-700">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-slate-700/30 transition-colors rounded-t-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 flex-shrink-0" />
                    <span className="hidden xs:inline">Further</span> Improvements
                    <Badge variant="secondary" className="bg-slate-700 text-xs">
                      {result.suggestions.length}
                    </Badge>
                  </CardTitle>
                  {suggestionsOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </div>
  );
}
