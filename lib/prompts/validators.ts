export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
}

export function validatePromptQuality(prompt: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check minimum length
  if (prompt.length < 20) {
    issues.push({
      severity: 'error',
      category: 'Length',
      message: 'Prompt is too short to be effective'
    });
    score -= 30;
  }

  // Check for vague language
  const vagueTerms = ['good', 'nice', 'better', 'improve', 'help me'];
  const foundVagueTerms = vagueTerms.filter(term =>
    prompt.toLowerCase().includes(term)
  );

  if (foundVagueTerms.length > 2) {
    issues.push({
      severity: 'warning',
      category: 'Clarity',
      message: `Contains vague terms: ${foundVagueTerms.join(', ')}`
    });
    suggestions.push('Replace vague terms with specific requirements');
    score -= 10;
  }

  // Check for output format specification
  const hasOutputFormat = /format|structure|output|return|provide/i.test(prompt);
  if (!hasOutputFormat && prompt.length > 50) {
    issues.push({
      severity: 'info',
      category: 'Structure',
      message: 'No explicit output format specified'
    });
    suggestions.push('Consider specifying the desired output format');
    score -= 5;
  }

  // Check for context
  const hasContext = prompt.length > 100 && /context|background|situation|scenario/i.test(prompt);
  if (!hasContext && prompt.length > 50) {
    suggestions.push('Adding context can improve response quality');
  }

  // Check for constraints
  const hasConstraints = /must|should|limit|maximum|minimum|only|never/i.test(prompt);
  if (!hasConstraints && prompt.length > 100) {
    suggestions.push('Consider adding constraints to guide the output');
  }

  // Check for examples
  const hasExamples = /example|for instance|such as|like/i.test(prompt);
  if (!hasExamples && prompt.length > 150) {
    suggestions.push('Examples can clarify expectations');
  }

  return {
    isValid: score >= 50,
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions: suggestions.slice(0, 3) // Limit to top 3 suggestions
  };
}

export function analyzePromptComplexity(prompt: string): 'simple' | 'moderate' | 'complex' {
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = prompt.split(/\s+/).length;
  const hasStructure = /\d+\.|step|first|then|finally/i.test(prompt);
  const hasMultipleTasks = (prompt.match(/and|also|additionally/gi) || []).length > 2;

  if (words < 30 && sentences.length <= 2) {
    return 'simple';
  }

  if (words > 100 || sentences.length > 5 || hasMultipleTasks) {
    return 'complex';
  }

  return 'moderate';
}
