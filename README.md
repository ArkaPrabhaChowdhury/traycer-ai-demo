# Traycer Core
> **Architectural Planning & Verification Layer for AI Coding Agents**

Traycer Core is a high-fidelity planning engine designed to bridge the gap between high-level user objectives and actionable, verified technical roadmaps. It implements an "Architect-in-the-loop" workflow to ensure that AI agents have the precision and context required for complex software development.

## 🚀 Key Features

- **Architect-in-the-Loop Discovery**: A multi-phase workflow where the AI clarifies non-technical requirements before generating a plan.
- **Roadmap Synthesis**: Automatically generates a structured technical graph representing the implementation path.
- **Live Verification**: A simulated synthesis engine that verifies technical specifications in real-time.
- **Spec Export**: Export architectural decisions and roadmaps as production-ready PRDs (Markdown).
- **Premium UI**: A sleek, "Surgical" aesthetic built with specialized dark mode themes and smooth motion transitions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Modern CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **LLM Context**: Optimized for high-performance inference (Groq/Llama 3)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / pnpm / yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArkaPrabhaChowdhury/traycer-ai-demo.git
   cd traycer-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root and add your API keys:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📐 Architecture

Traycer operates on a sequence of cognitive phases:
1. **Analyze**: Deconstructs the initial prompt into technical components.
2. **Clarify**: Asks clarifying questions to narrow down implementation details.
3. **Synthesize**: Builds a visual dependency graph of tasks.
4. **Verify**: Simulates structural checks to ensure architectural integrity.

