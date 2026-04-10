'use client';
import { Header } from '@/components/Header';
import { PlanningGraph, Task, MOCK_PLAN } from '@/components/PlanningGraph';
import { AgentTerminal, INITIAL_LOGS, LogItem } from '@/components/AgentTerminal';
import { Sparkles, ArrowRight, FileText, X, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type InteractionPhase = 'idle' | 'clarifying' | 'planning' | 'executing' | 'complete';

export default function Home() {
  const [objective, setObjective] = useState('');
  const [phase, setPhase] = useState<InteractionPhase>('idle');
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<Task[]>(MOCK_PLAN);
  const [terminalLogs, setTerminalLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  const startClarification = async () => {
    if (!objective) return;
    setPhase('clarifying');
    setResponses({});
    setTerminalLogs((prev) => [...prev, { id: Date.now(), type: 'thought', agent: 'Orchestrator', text: `Analyzing objective: "${objective}"` }]);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Discovery failed');
      setQuestions(data.questions || []);
    } catch {
      setPhase('idle');
    }
  };

  const generateRoadmap = async () => {
    setPhase('planning');
    setTerminalLogs((prev) => [...prev, { id: Date.now(), type: 'info', agent: 'Orchestrator', text: 'Discovery complete. Synthesizing full implementation roadmap...' }]);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, responses }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Roadmap generation failed');
      
      const finalTasks = data.tasks || data.plan || (Array.isArray(data) ? data : [data]);
      setTasks(finalTasks);
      setPhase('executing');
      startExecutionSimulation(finalTasks);
    } catch {
      setPhase('clarifying');
    }
  };

  const startExecutionSimulation = (currentTasks: Task[]) => {
    let delay = 2000;
    currentTasks.forEach((task, index) => {
      setTimeout(() => {
        setTasks(prev => {
          const updated = [...prev];
          if (updated[index]) updated[index] = { ...updated[index], status: 'in-progress' };
          return updated;
        });
        setTerminalLogs((prev) => [...prev, { id: Date.now(), type: 'info', agent: task.agent || 'Agent', text: `Executing: ${task.title}` }]);
      }, delay);
      delay += 2500;
      setTimeout(() => {
        setTasks(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], status: 'completed' };
            if (updated[index].children) {
              updated[index].children = updated[index].children.map(c => ({ ...c, status: 'completed' }));
            }
          }
          return updated;
        });
        if (index === currentTasks.length - 1) setPhase('complete');
      }, delay);
      delay += 1000;
    });
  };

  const exportPRD = () => {
    const content = `# Traycer Architectural Export\n\nObjective: ${objective}\n\n## Technical Context\n` + 
      Object.entries(responses).map(([q, a]) => `**Q: ${q}**\n*A: ${a}*\n`).join('\n') +
      `\n## Technical Plan\n` + 
      tasks.map(t => `### ${t.title} (${t.agent})\n${t.description}\n`).join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `traycer-arch.md`; a.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden">
      <main className="w-full flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full space-y-12 pb-32">
          
          {/* Phase 1: Objective Definition */}
          <section className="space-y-6">
             <div className="flex items-center gap-2.5">
                <Sparkles size={16} className={`${phase !== 'idle' ? 'text-zinc-600' : 'text-primary'}`} />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Discovery Intent</h3>
             </div>
             <div className={`p-1 flex border rounded-xl shadow-lg transition-all duration-300 ${phase === 'idle' ? 'bg-zinc-900 border-zinc-800' : 'bg-transparent border-zinc-800 opacity-60'}`}>
                <input 
                  disabled={phase !== 'idle'}
                  className="flex-1 bg-transparent px-5 py-3 outline-none text-base placeholder:text-zinc-600 text-zinc-100 disabled:cursor-not-allowed"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What are we building today?"
                />
                {phase === 'idle' && (
                  <button onClick={startClarification} className="flex items-center gap-2 px-6 bg-zinc-50 text-zinc-950 font-bold rounded-lg hover:bg-white transition-all text-sm">
                    Start <ArrowRight size={16} />
                  </button>
                )}
             </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-8">
               <AnimatePresence mode="wait">
                  {/* Phase 2: Clarification Discovery */}
                  {phase === 'clarifying' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                       <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
                          <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg"><MessageSquare size={20} /></div>
                          <div>
                             <h2 className="text-lg font-bold">Project Discovery</h2>
                             <p className="text-xs text-zinc-500">Help the architect understand your vision before synthesizing the plan.</p>
                          </div>
                       </div>
                       
                       <div className="space-y-10">
                          {questions.length > 0 ? (
                            questions.map((q, i) => (
                              <div key={i} className="space-y-4">
                                 <label className="text-sm font-bold text-zinc-100 flex items-center gap-3">
                                    <span className="text-indigo-500 font-mono text-xs">0{i+1}</span> {q}
                                 </label>
                                 <input 
                                   className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:border-indigo-500 outline-none transition-all"
                                   placeholder="Your preference..."
                                   value={responses[q] || ''}
                                   onChange={(e) => setResponses(prev => ({ ...prev, [q]: e.target.value }))}
                                 />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Asking Questions...</div>
                          )}
                          <button onClick={generateRoadmap} className="w-full py-4 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 shadow-lg shadow-indigo-500/10 transition-all">
                             Create My Roadmap
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {/* Phase 3 & 4: Planning & Execution */}
                  {(phase === 'executing' || phase === 'planning' || phase === 'complete') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-zinc-800/50">
                           <h2 className="text-base font-bold tracking-tight">Active Roadmap</h2>
                           <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified</div>
                              <div className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${phase === 'executing' ? 'bg-primary' : 'bg-zinc-700'}`} /> Active</div>
                           </div>
                        </div>
                        <PlanningGraph tasks={tasks} onTaskClick={setSelectedTask} />
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Side Intelligence - Logs Only */}
            <div className="lg:col-span-4 flex flex-col gap-10">
                <div className="space-y-4">
                   <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Live Synthesis Engine</h3>
                   <AgentTerminal logs={terminalLogs} />
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Task Verification Detail Overlay */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden shadow-black/80">
               <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                  <h3 className="text-sm font-bold tracking-tight">Architectural Verification</h3>
                  <button onClick={() => setSelectedTask(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
               </div>
               <div className="p-8 space-y-8">
                  <DetailSection label="Technical Specification" value={selectedTask.title} />
                  <DetailSection label="Validation Script" value={selectedTask.description} />
                  <div className="px-5 py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500 font-bold text-xs text-center tracking-wide uppercase">
                     Verification Integrity: [CLEARED]
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Handoff Toast */}
      <AnimatePresence>
        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-8 right-8 w-[360px] p-1 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-2xl shadow-2xl z-[110]">
            <div className="bg-zinc-950 rounded-[14px] p-6 space-y-5">
              <div className="flex gap-4">
                 <div className="bg-indigo-500/10 text-indigo-400 p-2 rounded-xl h-fit"><FileText size={20} /></div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-100">Spec Ready for Handoff</h4>
                    <p className="text-xs text-zinc-500 leading-normal">Planning discovery and synthesis complete. PRD-V1 generated.</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={exportPRD} className="py-2.5 bg-zinc-50 text-zinc-950 rounded-lg text-xs font-bold hover:bg-white active:scale-[0.98] transition-all">Download PRD</button>
                 <button onClick={() => setPhase('idle')} className="py-2.5 bg-zinc-900 text-zinc-400 rounded-lg text-xs font-bold hover:text-white border border-zinc-800 transition-all">Reset</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



function DetailSection({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{label}</div>
      <div className="text-sm text-zinc-300 leading-relaxed font-medium">{value}</div>
    </div>
  );
}
