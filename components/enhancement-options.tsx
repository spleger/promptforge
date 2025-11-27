'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { EnhancementOptions } from '@/lib/types';

interface EnhancementOptionsProps {
  options: EnhancementOptions;
  onChange: (options: EnhancementOptions) => void;
}

export function EnhancementOptionsComponent({ options, onChange }: EnhancementOptionsProps) {
  return (
    <div className="mt-4 space-y-4 pt-4 border-t border-slate-700">
      {/* Enhancement Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 font-medium">Enhancement Level</Label>
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
          className="grid grid-cols-3 gap-3"
        >
          <div>
            <Label
              htmlFor="light"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  options.enhancementLevel === 'light'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="light" id="light" />
                <div>
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
                ${
                  options.enhancementLevel === 'standard'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="standard" id="standard" />
                <div>
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
                ${
                  options.enhancementLevel === 'comprehensive'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="comprehensive" id="comprehensive" />
                <div>
                  <div className="text-sm font-medium text-white">Comprehensive</div>
                  <div className="text-xs text-slate-400">Maximum</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Target Model */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-slate-300 font-medium">Claude Model</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-slate-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Choose which Claude model to use for enhancement. Opus is most capable, Sonnet is balanced, and Haiku is fastest.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <RadioGroup
          value={options.targetModel}
          onValueChange={(value) =>
            onChange({
              ...options,
              targetModel: value as EnhancementOptions['targetModel'],
            })
          }
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <div>
            <Label
              htmlFor="general"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  options.targetModel === 'general'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="general" id="general" />
                <div>
                  <div className="text-sm font-medium text-white">General</div>
                  <div className="text-xs text-slate-400">Sonnet 3.5</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="claude-opus"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  options.targetModel === 'claude-opus'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="claude-opus" id="claude-opus" />
                <div>
                  <div className="text-sm font-medium text-white">Opus</div>
                  <div className="text-xs text-slate-400">Most capable</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="claude-sonnet"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  options.targetModel === 'claude-sonnet'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="claude-sonnet" id="claude-sonnet" />
                <div>
                  <div className="text-sm font-medium text-white">Sonnet</div>
                  <div className="text-xs text-slate-400">Balanced</div>
                </div>
              </div>
            </Label>
          </div>

          <div>
            <Label
              htmlFor="claude-haiku"
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  options.targetModel === 'claude-haiku'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-900/30 hover:border-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="claude-haiku" id="claude-haiku" />
                <div>
                  <div className="text-sm font-medium text-white">Haiku</div>
                  <div className="text-xs text-slate-400">Fast</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
