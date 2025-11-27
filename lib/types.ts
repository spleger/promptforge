export interface EnhancementOptions {
  targetModel: string; // Full Claude model ID (e.g., claude-sonnet-4-5-20250929)
  enhancementLevel: 'light' | 'standard' | 'comprehensive';
}

export interface PromptAnalysis {
  detected_intent: string;
  domain: string;
  complexity: 'simple' | 'moderate' | 'complex';
  missing_elements: string[];
  techniques_applied: string[];
}

export interface EnhancementResult {
  analysis: PromptAnalysis;
  enhanced_prompt: string;
  explanation: string;
  suggestions: string[];
}

export interface HistoryItem {
  input: string;
  output: EnhancementResult;
  timestamp: number;
}
