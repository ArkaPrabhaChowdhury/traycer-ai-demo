'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Circle } from 'lucide-react';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  agent?: string;
  children?: Task[];
}

export const MOCK_PLAN: Task[] = [
  {
    id: '1',
    title: 'Baseline Infrastructure',
    description: 'Establish the core project structure, linting rules, and build pipeline.',
    status: 'completed',
    agent: 'Architect-1',
    children: [
      { id: '1.1', title: 'Linting & Formatting', description: 'Configure ESLint and Prettier for strict TypeScript adherence.', status: 'completed' },
      { id: '1.2', title: 'CI/CD Pipeline', description: 'Initial GitHub Actions workflow setup.', status: 'completed' }
    ]
  },
  {
    id: '2',
    title: 'Core Orchestration',
    description: 'The central engine for managing task state and agent handovers.',
    status: 'in-progress',
    agent: 'Engine-Master',
    children: [
      { id: '2.1', title: 'Task State Machine', description: 'Implementing the transition logic for task status.', status: 'in-progress' },
      { id: '2.2', title: 'Event Bus', description: 'Cross-agent messaging system.', status: 'pending' }
    ]
  }
];

export function PlanningGraph({ tasks = MOCK_PLAN, onTaskClick }: { tasks?: Task[], onTaskClick?: (task: Task) => void }) {
  return (
    <div className="flex flex-col gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} depth={0} onTaskClick={onTaskClick} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function TaskRow({ task, depth, onTaskClick }: { task: Task, depth: number, onTaskClick?: (task: Task) => void }) {
  return (
    <div className="bg-zinc-950/20 backdrop-blur-sm group">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => onTaskClick?.(task)}
        className={`
          flex items-center p-4 cursor-pointer transition-all duration-150 relative gap-4 border-b border-zinc-800/60
          hover:bg-zinc-900 group-last:border-b-0
          ${task.status === 'in-progress' ? 'bg-primary/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary' : ''}
        `}
        style={{ paddingLeft: `${16 + depth * 32}px` }}
      >
        <div className="w-4 flex justify-center shrink-0">
            {task.status === 'completed' && <Check size={14} className="text-emerald-500 bg-emerald-500/10 rounded-full p-0.5" />}
            {task.status === 'in-progress' && <Loader2 size={14} className="text-primary spin-slow" />}
            {task.status === 'pending' && <Circle size={10} className="text-zinc-700" />}
        </div>

        <div className="flex-1 min-w-0">
           <div className="flex items-center gap-3">
              <span className="font-semibold text-sm tracking-tight text-zinc-100 truncate">{task.title}</span>
              {task.agent && (
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {task.agent}
                </span>
              )}
           </div>
           <p className="text-[11px] mt-1 text-zinc-500 truncate group-hover:text-zinc-400 transition-colors">{task.description}</p>
        </div>

        {task.status === 'completed' && (
           <div className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
             Verified
           </div>
        )}
      </motion.div>

      {task.children && task.children.map((child) => (
        <TaskRow key={child.id} task={child} depth={depth + 1} onTaskClick={onTaskClick} />
      ))}
    </div>
  );
}
