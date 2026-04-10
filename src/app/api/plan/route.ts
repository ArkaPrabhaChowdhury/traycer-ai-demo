import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { objective, responses } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        error: 'Groq API key not found in .env.local',
        suggestion: "Please add your GROQ_API_KEY to proceed with AI planning." 
      }, { status: 400 });
    }

    // PHASE 1: Generate Clarifying Questions
    if (!responses) {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are Traycer Orchestrator. 
            Before generating a technical roadmap, you MUST ask 3 simple, non-technical questions to understand the user's goals and preferences.
            Do NOT ask about architecture, scaling, or code. 
            Ask about:
            - The primary purpose of the project.
            - Essential features they want to see.
            - Visual preferences or the 'vibe' (e.g. minimalist, professional, colorful).
            Return ONLY a valid JSON array of 3 strings.`
          },
          {
            role: 'user',
            content: `Objective: ${objective}`
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        // In case the model returns an object like { "questions": [...] }
        const questions = Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed)[0]);
        return NextResponse.json({ questions });
      } catch {
        return NextResponse.json({ error: 'Failed to generate clarifying questions' }, { status: 500 });
      }
    }

    // PHASE 2: Generate Full Roadmap using Objective + Responses
    const fullContext = `
      Objective: ${objective}
      Developer Clarifications:
      ${Object.entries(responses).map(([q, a]) => `- Q: ${q}\n  - A: ${a}`).join('\n')}
    `;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are Traycer Orchestrator, an AI architect that generates technical plans for coding agents.
          Current codebase: Next.js 14, TypeScript, Prisma, TailwindCSS.
          
          Based on the objective and the user's technical clarifications, generate a structured JSON plan.
          The plan must be an array of tasks. Each task should have:
          - id: string (unique)
          - title: string
          - description: detailed instructions for a coding agent
          - agent: e.g. "Architect-1", "Designer-2", "Refactor-Bot", "Security-Validator"
          - status: "pending"
          - children: optional sub-tasks array
          
          Return ONLY a JSON object with this structure: { "tasks": [...] }`
        },
        {
          role: 'user',
          content: fullContext
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ error: 'AI returned invalid JSON state' }, { status: 500 });
    }

  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
