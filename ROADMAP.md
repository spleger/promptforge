# PromptForge Roadmap

## Planned Features

### 1. Research Mode (Pre-Enhancement Context Gathering)
Add an optional "Research" step before enhancement that helps gather context about the user's prompt topic.

**Concept:**
- Toggle option: "Research before enhancing"
- Uses Perplexity API to search for relevant context about the prompt topic
- Gathers domain-specific knowledge, best practices, and current information
- Feeds research results into the enhancement process for better context-aware prompts

**Implementation Ideas:**
- Add checkbox/toggle in EnhancementOptions: "Enable Research Mode"
- New API endpoint `/api/research` that calls Perplexity
- Research results displayed in a collapsible section before the enhanced prompt
- Research context passed to Claude for more informed enhancement

**Benefits:**
- More accurate domain-specific prompts
- Up-to-date information incorporated into prompts
- Better understanding of technical/specialized topics

---

### 2. [Add your next idea here]

---

## Completed Features
- [x] Mobile responsive design (Nov 2024)
- [x] Browser extension (Chrome/Edge)
- [x] Multiple Claude model support (Opus, Sonnet, Haiku)
- [x] Three enhancement levels (Light, Standard, Comprehensive)
- [x] Real-time streaming responses
- [x] Copy to clipboard functionality
- [x] Analysis & techniques breakdown

---

## Technical Notes

### Perplexity API Integration
- API Docs: https://docs.perplexity.ai/
- Model options: `llama-3.1-sonar-small-128k-online`, `llama-3.1-sonar-large-128k-online`
- Supports web search with citations
- Could use for gathering context before enhancement
