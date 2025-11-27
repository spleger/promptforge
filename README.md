# ⚡ PromptForge

Transform your casual descriptions into powerful, optimized AI prompts using advanced prompt engineering techniques.

![PromptForge](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Anthropic Claude](https://img.shields.io/badge/Claude-Sonnet%204.5-purple)

## 🌟 Features

- **Intelligent Prompt Enhancement**: Transforms casual descriptions into structured, effective prompts
- **Advanced Analysis**: Detects intent, domain, complexity, and missing elements
- **Multiple Enhancement Levels**: Light, Standard, and Comprehensive options
- **Target Model Optimization**: Optimize prompts for Claude, GPT-4, or general use
- **Real-time Streaming**: See results as they're generated
- **Beautiful Dark UI**: Modern, responsive design with smooth animations
- **Copy with One Click**: Easily copy enhanced prompts to clipboard
- **Detailed Analysis**: See applied techniques, missing elements, and suggestions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd promptforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **LLM Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) with [@ai-sdk/anthropic](https://www.npmjs.com/package/@ai-sdk/anthropic)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🏗️ Project Structure

```
promptforge/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main application page
│   ├── globals.css          # Global styles and theme
│   └── api/
│       └── enhance/
│           └── route.ts     # API route for prompt enhancement
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   ├── collapsible.tsx
│   │   ├── label.tsx
│   │   └── radio-group.tsx
│   ├── prompt-input.tsx     # Prompt input component
│   ├── prompt-output.tsx    # Enhanced prompt display
│   └── enhancement-options.tsx  # Options selector
├── lib/
│   ├── prompts/
│   │   ├── meta-prompt.ts   # Core enhancement prompt
│   │   ├── patterns.ts      # Prompt patterns library
│   │   └── validators.ts    # Quality validators
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
├── .env.local.example       # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎯 How It Works

1. **Input Analysis**: The system analyzes your casual description to understand intent, domain, and missing elements

2. **Enhancement**: Applies prompt engineering techniques:
   - Adds clear structure and formatting
   - Includes relevant persona/role
   - Specifies output format
   - Adds examples where beneficial
   - Handles edge cases
   - Applies chain-of-thought for reasoning tasks

3. **Output**: Returns a structured JSON response with:
   - Enhanced prompt (ready to use)
   - Analysis of detected intent and complexity
   - List of applied techniques
   - Suggestions for further improvements

## 💡 Usage Examples

### Example 1: Simple Request
**Input**: `help me write a cover letter`

**Output**: A comprehensive prompt that includes career coach persona, structured format, tone guidance, and discovery questions.

### Example 2: Technical Request
**Input**: `code review this`

**Output**: A detailed code review prompt with categorized analysis (bugs, security, performance, readability), severity ratings, and specific fix requests.

### Example 3: Content Request
**Input**: `summarize this article`

**Output**: A structured summarization prompt with clear format, key points extraction, and length constraints.

## 🎨 Customization

### Modifying Enhancement Levels

Edit `lib/prompts/meta-prompt.ts` to adjust the enhancement levels:

```typescript
export const ENHANCEMENT_LEVELS = {
  light: "Your custom description",
  standard: "Your custom description",
  comprehensive: "Your custom description"
} as const;
```

### Adding New Target Models

1. Update `lib/types.ts`:
   ```typescript
   export interface EnhancementOptions {
     targetModel: 'claude' | 'gpt4' | 'general' | 'your-model';
     // ...
   }
   ```

2. Update `components/enhancement-options.tsx` to add UI controls

### Customizing the Meta-Prompt

The core enhancement logic is in `lib/prompts/meta-prompt.ts`. You can:
- Add new enhancement strategies
- Modify the output format
- Add more examples
- Adjust quality standards

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   ```bash
   npx vercel
   ```

   Or connect your GitHub repository in the [Vercel Dashboard](https://vercel.com/dashboard)

3. **Add environment variables**

   In Vercel project settings, add:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```

4. **Deploy**

   Vercel will automatically deploy on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## 📝 API Documentation

### POST `/api/enhance`

Enhances a prompt based on user input and options.

**Request Body**:
```json
{
  "input": "your casual description here",
  "targetModel": "general" | "claude" | "gpt4",
  "enhancementLevel": "light" | "standard" | "comprehensive"
}
```

**Response**: Streams a JSON object:
```json
{
  "analysis": {
    "detected_intent": "string",
    "domain": "string",
    "complexity": "simple" | "moderate" | "complex",
    "missing_elements": ["string"],
    "techniques_applied": ["string"]
  },
  "enhanced_prompt": "string",
  "explanation": "string",
  "suggestions": ["string"]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Claude](https://www.anthropic.com/claude) by Anthropic
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js and Claude**
