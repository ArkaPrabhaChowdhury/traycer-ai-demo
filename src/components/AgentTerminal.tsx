'use client';
import { Terminal as TerminalIcon, Shield, Activity, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const INITIAL_LOGS = [
  { id: 1, type: 'info', icon: <Info size={12} />, agent: 'System', text: 'Initializing planning engine v2.4.0...' },
  { id: 2, type: 'success', icon: <Shield size={12} />, agent: 'Guardian', text: 'Codebase security policies loaded successfully.' },
  { id: 3, type: 'thought', icon: <Activity size={12} />, agent: 'Architect', text: 'Analyzing dependency tree for Next.js 14 API routes.' },
];

export type LogItem = { id: number; type: string; agent: string; text: string; icon?: React.ReactNode };
export function AgentTerminal({ logs = INITIAL_LOGS }: { logs?: LogItem[] }) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 font-mono text-[11px] rounded-lg overflow-hidden flex flex-col h-[400px] shadow-2xl">
      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-primary opacity-80" />
          <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-[0.1em]">Agent Shell v1.0.4</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-zinc-600 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
            <span>SHELL_ACTIVE</span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-1.5 selection:bg-primary/30 selection:text-white">
        {logs.map((log: LogItem, i: number) => (
          <motion.div 
            key={`${log.id}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 leading-relaxed"
          >
            <div className="min-w-[80px] shrink-0 text-zinc-600 font-bold opacity-70">[{log.agent}]</div>
            <div className={`
              ${log.type === 'thought' ? 'text-primary' : 
                log.type === 'warning' ? 'text-amber-500' : 
                log.type === 'success' ? 'text-emerald-500' : 'text-zinc-200'}
            `}>
                {log.text}
            </div>
          </motion.div>
        ))}
         <motion.div 
            animate={{ opacity: [0, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-zinc-600 flex items-center gap-1 font-bold pt-2 border-t border-zinc-900 mt-4"
        >
            <span className="text-primary">$</span>
            <span>_</span>
            <span className="text-[9px] uppercase tracking-widest pl-2">Standby: Listening for handshake</span>
        </motion.div>
      </div>
    </div>
  );
}
