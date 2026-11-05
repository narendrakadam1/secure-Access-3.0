import React from 'react';
import { ArrowLeft, Shield, Sun, Moon, Laptop, Terminal, Layers, Cpu, Database, FileText, CheckCircle2 } from 'lucide-react';

export default function ArchitecturePage({ onBack, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              title="Return to Assessment Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Scanner Dashboard</span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>SECUREASSESS Architecture & Pipeline Specification</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    SIH 2026 PS 26163 (NTRO)
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">
                  Autonomous Web & Source Code Security Assessment Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right: Theme Toggle & Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Full-Page Architecture View</span>
            </div>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border text-slate-300 hover:text-amber-400 bg-slate-800 border-slate-700 transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-300" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Full-Area Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-8">
        
        {/* Banner */}
        <div className="rounded-xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                End-to-End System Blueprint
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                High-Definition Specification
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Dual-modality pipeline integrating Frontend (React), Orchestrator (FastAPI), 5-Agent Sequential State Machine, SecureCore Model Gateway, and Sandboxed Multi-Tool Execution.
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
          >
            ← Return to Scanner Dashboard
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FULL-WIDTH HD ARCHITECTURE DIAGRAM CONTAINER                       */}
        {/* ------------------------------------------------------------------ */}
        <section className="rounded-2xl border-2 border-slate-700/80 bg-[#0f172a] shadow-2xl overflow-hidden p-2 sm:p-4">
          <div className="mb-3 px-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              System Architecture Diagram (Dual-Modality DAST & SAST Pipeline)
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              HD High-Fidelity Rendering
            </span>
          </div>

          {/* Diagram Canvas: crisp white background card inside dark frame */}
          <div className="w-full bg-white rounded-xl p-2 sm:p-4 shadow-inner overflow-hidden flex items-center justify-center">
            <img
              src="/architecture.jpg"
              alt="SECUREASSESS HD System Architecture Diagram"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-sm"
              style={{ imageRendering: 'high-quality' }}
            />
          </div>

          <p className="mt-3 text-center text-[11px] text-slate-400">
            Figure: SECUREASSESS End-to-End Architecture — Frontend Web UI, FastAPI Orchestrator, 5-Agent Pipeline, Kali Sandbox, SecureCore Model Provider, and SQLite Shared Memory.
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* COMPONENT ARCHITECTURE SPECIFICATION CARDS                        */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Architecture Breakdown & Technical Flow</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Box 1: Frontend */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Laptop className="w-4 h-4" />
                <h3>1. User & Frontend Dashboard</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                React 18 + Vite + Tailwind CSS dashboard providing target input (GitHub repository URL), live 5-phase execution stepper, real-time streaming audit console, CVSS metric cards, and downloadable JSON/HTML/PDF reports.
              </p>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                POST /scan (target) → GET /scan/{'{id}'}/status (poll 2s)
              </div>
            </div>

            {/* Box 2: FastAPI Backend */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <h3>2. Backend Orchestrator</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                FastAPI (Python 3.11) managing the Pre-Packet Allowlist Gate (RFC1918 / Loopback / Allowlist), single-scan concurrency lock (Constraint #6), asynchronous background tasks, and tamper-evident audit logging.
              </p>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                Enforces safety gate before any packet leaves
              </div>
            </div>

            {/* Box 3: 5-Agent Sequential State Machine */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Layers className="w-4 h-4" />
                <h3>3. 5-Agent Sequential Pipeline</h3>
              </div>
              <ul className="text-slate-400 space-y-1 list-disc list-inside leading-relaxed">
                <li><strong className="text-slate-200">Recon:</strong> HTTP probes, banner inspection, Nmap.</li>
                <li><strong className="text-slate-200">Scanning:</strong> Semgrep AST, Gitleaks secrets, Nikto.</li>
                <li><strong className="text-slate-200">Analysis:</strong> Deduplication, PTFusion schema, CVSS v3.1.</li>
                <li><strong className="text-slate-200">Validation:</strong> Non-destructive HTTP proof verification.</li>
                <li><strong className="text-slate-200">Reporting:</strong> Normalized JSON and executive PDF.</li>
              </ul>
            </div>

            {/* Box 4: Model Provider SecureCore */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Cpu className="w-4 h-4" />
                <h3>4. Model Provider SecureCore</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Dual-intelligence architecture: Local on-premise Ollama models (Qwen 3.5, Gemma 2) for air-gapped confidential defense environments, plus an Autonomous Deterministic Rule Engine for instant, zero-latency judging.
              </p>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                Zero telemetry leakage to third-party clouds
              </div>
            </div>

            {/* Box 5: Sandboxed Toolchain */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                <h3>5. Sandboxed Tool Execution</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Isolated sandbox execution for Semgrep static AST engine, Gitleaks secret detector, Nikto web scanner, and Nmap utilities. Streams stdout lines directly into structured JSON artifacts in ephemeral workspaces.
              </p>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                /tmp/workspace ephemeral mount + zero pub ports
              </div>
            </div>

            {/* Box 6: SQLite Shared Memory */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Database className="w-4 h-4" />
                <h3>6. SQLite Shared Memory Store</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Hermes/OpenClaw-style shared memory architecture solving LLM context window exhaustion (Research Gap #1 / #17 AutoPT). Agents read and write isolated state slices without carrying megabytes of raw scanner output in LLM context.
              </p>
              <div className="text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                scan_state • tool_outputs • findings • agent_log
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] py-4 text-center text-xs text-slate-500">
        <p>SECUREASSESS Architecture Hub • Smart India Hackathon 2026 (Problem Statement ID: 26163 - NTRO)</p>
      </footer>

    </div>
  );
}

