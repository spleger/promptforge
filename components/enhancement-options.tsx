'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { EnhancementOptions } from '@/lib/types';
import { useState } from 'react';

interface EnhancementOptionsProps {
  options: EnhancementOptions;
  onChange: (options: EnhancementOptions) => void;
}

// Available Claude models with their versions
const CLAUDE_MODELS = {
  opus: [
    { id: 'claude-opus-4-5-20251101', label: 'Opus 4.5 (Latest)', version: '4.5' },
    { id: 'claude-opus-4-1-20250805', label: 'Opus 4.1', version: '4.1' },
    { id: 'claude-3-opus-20240229', label: 'Opus 3', version: '3.0' },
  ],
  sonnet: [
    { id: 'claude-sonnet-4-5-20250929', label: 'Sonnet 4.5 (Latest)', version: '4.5' },
    { id: 'claude-3-5-sonnet-20241022', label: 'Sonnet 3.5', version: '3.5' },
  ],
  haiku: [
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 (Latest)', version: '4.5' },
    { id: 'claude-3-5-haiku-20241022', label: 'Haiku 3.5', version: '3.5' },
    { id: 'claude-3-haiku-20240307', label: 'Haiku 3', version: '3.0' },
  ],
};

// Determine model family from model ID
function getModelFamily(modelId: string): 'opus' | 'sonnet' | 'haiku' {
  if (modelId.includes('opus')) return 'opus';
  if (modelId.includes('sonnet')) return 'sonnet';
  return 'haiku';
}

export function EnhancementOptionsComponent({ options, onChange }: EnhancementOptionsProps) {
  const [modelFamily, setModelFamily] = useState<'opus' | 'sonnet' | 'haiku'>(
    getModelFamily(options.targetModel)
  );

  const handleFamilyChange = (family: 'opus' | 'sonnet' | 'haiku') => {
    setModelFamily(family);
    // Set to the latest version of the selected family
    const latestModel = CLAUDE_MODELS[family][0].id;
    onChange({
      ...options,
      targetModel: latestModel,
    });
  };

  const handleVersionChange = (modelId: string) => {
    onChange({
      ...options,
      targetModel: modelId,
    });
  };

  return (
    <div className="mt-4 space-y-4 pt-4 border-t border-slate-700">
      {/* Enhancement Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 font-medium text-sm sm:text-base">Enhancement Level</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Controls how much detail and structure is added to your prompt
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <RadioGroup
          value={options.enhancementLevel}
          onValueChange={(value) =>
            onChange({
              ...options,
              enhancementLevel: value as EnhancementOptions['enhancementLevel'],
            })
          }
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div>
            <Label
              htmlFor="light"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${options.enhancementLevel === 'light'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="light" id="light" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Light</div>
                  <div className="text-xs text-slate-400">Basic fixes</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="standard"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${options.enhancementLevel === 'standard'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Standard</div>
                  <div className="text-xs text-slate-400">Balanced</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="comprehensive"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${options.enhancementLevel === 'comprehensive'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Comprehensive</div>
                  <div className="text-xs text-slate-400">Maximum</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Claude Model Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 font-medium text-sm sm:text-base">Claude Model</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Choose which Claude model to use. Opus is most capable, Sonnet is balanced, and Haiku is fastest.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Model Family Selection */}
        <RadioGroup
          value={modelFamily}
          onValueChange={handleFamilyChange}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div>
            <Label
              htmlFor="opus"
              className={`
                flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                ${modelFamily === 'opus'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="opus" id="opus" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Opus</div>
                  <div className="text-xs text-slate-400">Most capable</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="sonnet"
              className={`
                flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                ${modelFamily === 'sonnet'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="sonnet" id="sonnet" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Sonnet</div>
                  <div className="text-xs text-slate-400">Balanced</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="haiku"
              className={`
                flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                ${modelFamily === 'haiku'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <RadioGroupItem value="haiku" id="haiku" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Haiku</div>
                  <div className="text-xs text-slate-400">Fast</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Model Version Selection */}
        <div className="space-y-2">
          <Label className="text-slate-400 text-xs sm:text-sm">Model Version</Label>
          <Select value={options.targetModel} onValueChange={handleVersionChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {CLAUDE_MODELS[modelFamily].map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-sm">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
