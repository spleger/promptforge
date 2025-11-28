'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Describe what you want... e.g., 'help me write better emails' or 'analyze my code for bugs'"
}: PromptInputProps) {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const event = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
      }
    }
  };

  const isOverLimit = charCount > maxChars;
  const isNearLimit = charCount > maxChars * 0.9;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="min-h-[100px] sm:min-h-[120px] resize-y bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 text-sm sm:text-base"
          maxLength={maxChars}
        />

        {/* Character Counter */}
        <div className="absolute bottom-2 right-2 text-xs">
          <span
            className={`
              ${isOverLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-slate-500'}
              font-mono
            `}
          >
            {charCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3 xs:gap-4">
        <p className="text-xs text-slate-500 text-center xs:text-left">
          <span className="hidden sm:inline">Press </span>
          <kbd className="px-1 sm:px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">⌘</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1 sm:px-1.5 py-0.5 bg-slate-700 rounded text-slate-300 text-xs">Enter</kbd>
          <span className="hidden sm:inline"> to submit</span>
        </p>

        <Button
          type="submit"
          disabled={isLoading || !value.trim() || isOverLimit}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full xs:w-auto text-sm sm:text-base py-2 sm:py-2.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="hidden xs:inline">Enhancing...</span>
              <span className="xs:hidden">Wait...</span>
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Enhance Prompt</span>
              <span className="xs:hidden">Enhance</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
