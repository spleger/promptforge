export const PROMPT_PATTERNS = {
  chainOfThought: {
    name: "Chain-of-Thought",
    description: "Encourages step-by-step reasoning",
    template: "Let's approach this step by step:\n\n1. First, [initial step]\n2. Then, [next step]\n3. Finally, [conclusion]",
    useCases: ["reasoning", "problem-solving", "analysis", "calculations"]
  },

  fewShot: {
    name: "Few-Shot Learning",
    description: "Provides examples to guide output format",
    template: "Here are some examples:\n\nExample 1:\nInput: [example input 1]\nOutput: [example output 1]\n\nExample 2:\nInput: [example input 2]\nOutput: [example output 2]\n\nNow for:\nInput: [actual input]",
    useCases: ["formatting", "style-matching", "pattern-recognition"]
  },

  persona: {
    name: "Role/Persona",
    description: "Assigns an expert identity to the AI",
    template: "You are a [specific expert role] with [X years/credentials]. You specialize in [domain].",
    useCases: ["creative-writing", "expert-advice", "technical-analysis"]
  },

  constrainedOutput: {
    name: "Constrained Output",
    description: "Sets specific boundaries and requirements",
    template: "Your response must:\n- [constraint 1]\n- [constraint 2]\n- Be no longer than [X] words/lines\n- Use [specific format]",
    useCases: ["formatting", "brevity", "structure", "quality-control"]
  },

  reflexion: {
    name: "Self-Reflection",
    description: "Encourages the model to check its own work",
    template: "After completing the task, review your output and:\n1. Verify [criterion 1]\n2. Check for [potential issue]\n3. Improve [specific aspect]",
    useCases: ["quality-assurance", "error-checking", "refinement"]
  },

  decomposition: {
    name: "Task Decomposition",
    description: "Breaks complex tasks into subtasks",
    template: "Break this task into smaller steps:\n\nStep 1: [subtask 1]\nStep 2: [subtask 2]\nStep 3: [subtask 3]\n\nComplete each step sequentially.",
    useCases: ["complex-tasks", "multi-step-processes", "planning"]
  }
};

export type PromptPattern = keyof typeof PROMPT_PATTERNS;

export function getRecommendedPatterns(intent: string, complexity: string): PromptPattern[] {
  const patterns: PromptPattern[] = [];

  if (complexity === 'complex') {
    patterns.push('chainOfThought', 'decomposition');
  }

  if (intent.includes('code') || intent.includes('review')) {
    patterns.push('persona', 'constrainedOutput');
  }

  if (intent.includes('write') || intent.includes('creative')) {
    patterns.push('persona', 'fewShot');
  }

  if (intent.includes('analyze') || intent.includes('reason')) {
    patterns.push('chainOfThought', 'reflexion');
  }

  return patterns;
}
