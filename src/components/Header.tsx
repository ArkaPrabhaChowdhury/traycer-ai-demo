'use client';
import { ChevronRight, Activity, Share2, MoreHorizontal } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b border-zinc-800 flex items-center px-6 justify-between bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 text-zinc-500 font-medium text-xs">
        <span className="hover:text-zinc-300 transition-colors cursor-pointer">Workspace</span>
        <ChevronRight size={12} className="opacity-40" />
        <span className="text-zinc-100 font-semibold tracking-tight">Project Orbit</span>
      </div>

      <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800/50 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span>Engine Online</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800/50 rounded-full">
                  <Activity size={10} className="text-primary" />
                  <span>Agent Concurrency: 12</span>
              </div>
          </div>

          <div className="h-5 w-px bg-zinc-800"></div>

          <div className="flex gap-1">
             <button className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
               <Share2 size={14} />
             </button>
             <button className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
               <MoreHorizontal size={14} />
             </button>
          </div>
      </div>
    </header>
  );
}
