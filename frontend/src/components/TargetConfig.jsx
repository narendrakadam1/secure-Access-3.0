import React, { useState, useEffect } from 'react';
import { Play, Globe, Code, AlertTriangle, Cpu, Sparkles, RefreshCw, XCircle, Zap, Shield, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { getModels, selectModel } from '../api';

export default function TargetConfig({ onStartScan, onCancelScan, isScanning, currentTarget, currentMode, error: serverError }) {
  // Default to SAST mode with a clean public security benchmark repo (NO port numbers)
  const [target, setTarget] = useState(currentTarget && !currentTarget.includes('localhost') ? currentTarget : 'https://github.com/OWASP/NodeGoat');
  const [mode, setMode] = useState(currentMode || 'sast');
  const [dastError, setDastError] = useState(null);

  // AI Model Selection & Engine State
  const [modelCatalog, setModelCatalog] = useState(null);
  const [selectedModel, setSelectedModel] = useState('instant');
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Fetch installed models on mount
  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const data = await getModels();
      setModelCatalog(data);
      if (data.active_model) {
        setSelectedModel(data.active_model);
      }
    } catch (err) {
      console.warn('Failed to fetch installed models:', err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleModelChange = async (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    try {
      await selectModel(newModel);
    } catch (err) {
      console.error('Failed to update active model on backend:', err);
    }
  };

  const handleSelectMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'dast') {
      setDastError('DAST Scanning is offline in cloud deployment: Dynamic Application Security Testing requires a locally running project and an on-premise deployed port number (e.g. localhost:3000 in Docker). Please switch to SAST (Code) mode to evaluate public GitHub repositories.');
    } else {
      setDastError(null);
      if (!target || target.includes('localhost') || target.includes('3000')) {
        setTarget('https://github.com/OWASP/NodeGoat');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isScanning) return;

    // Block DAST in cloud deployment and give clear error
    if (mode === 'dast') {
      setDastError('DAST assessment is disabled in cloud deployment. DAST requires a locally running project and an on-premise deployed port number (e.g., http://localhost:3000). Please switch to SAST Mode to test live repository scanning.');
      return;
    }

    if (!target.trim()) return;
    setDastError(null);
    onStartScan(target.trim(), 'sast', selectedModel);
  };

  const handleQuickSastRun = (repoUrl) => {
    setMode('sast');
    setDastError(null);
    setTarget(repoUrl);
    onStartScan(repoUrl, 'sast', 'instant');
  };

  const switchToSast = () => {
    setMode('sast');
    setDastError(null);
    setTarget('https://github.com/OWASP/NodeGoat');
  };

  // Find capabilities for currently selected model
  const activeInstalledModel = modelCatalog?.installed_models?.find(
    (m) => m.name === selectedModel
  );

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyber-border rounded-xl p-5 shadow-sm dark:shadow-xl transition-colors duration-200 space-y-4">
      
      {/* ---------------------------------------------------------------------- */}
      {/* EVALUATION GUIDE BANNER FOR JUDGES                                     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/60 dark:border-purple-900/40 dark:bg-purple-950/20 p-3.5 text-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-600/10 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <span>Cloud Evaluation Mode: SAST Repository Scanner Active</span>
              <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-300 dark:border-purple-700/50">
                Zero Configuration
              </span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              Live AST analysis & secret detection against public GitHub repositories. (DAST web scanning operates offline as it requires a locally deployed on-premise port).
            </p>
          </div>
        </div>

        {/* 1-Click Launch Button for Judges */}
        <button
          type="button"
          onClick={() => handleQuickSastRun('https://github.com/OWASP/NodeGoat')}
          disabled={isScanning}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>⚡ Run 1-Click Assessment (NodeGoat)</span>
        </button>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* TARGET CONFIGURATION FORM                                              */}
      {/* ---------------------------------------------------------------------- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Top Controls row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Target Input */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {mode === 'sast' ? (
                  <>
                    <Code className="w-3.5 h-3.5 text-purple-500" />
                    <span>Target Repository (Public GitHub Link)</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-red-500" />
                    <span>Target Port (Local Deployment Only)</span>
                  </>
                )}
              </label>

              {/* SAST Presets (Clean GitHub links, zero ports) */}
              {mode === 'sast' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setTarget('https://github.com/OWASP/NodeGoat')}
                    disabled={isScanning}
                    className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800/50 px-2 py-0.5 rounded transition-colors disabled:opacity-40 font-medium"
                  >
                    OWASP NodeGoat
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget('https://github.com/juice-shop/juice-shop')}
                    disabled={isScanning}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-2 py-0.5 rounded transition-colors disabled:opacity-40 font-medium"
                  >
                    OWASP Juice Shop
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarget('https://github.com/OWASP-Benchmark/BenchmarkJava')}
                    disabled={isScanning}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 px-2 py-0.5 rounded transition-colors disabled:opacity-40 font-medium hidden sm:inline-block"
                  >
                    Java Benchmark
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={mode === 'dast' ? 'Offline: Requires locally deployed port number' : target}
              onChange={(e) => mode === 'sast' && setTarget(e.target.value)}
              disabled={isScanning || mode === 'dast'}
              placeholder="e.g. https://github.com/OWASP/NodeGoat"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm font-mono transition-all ${
                mode === 'dast'
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 cursor-not-allowed opacity-80'
                  : 'bg-slate-50 dark:bg-[#0b1120] border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400'
              }`}
            />

            {/* Subtitle explaining mode */}
            <div className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              {mode === 'sast' ? (
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>SAST shallow-clones the public repository into an isolated sandbox to run Semgrep AST analysis and Gitleaks secrets detection.</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>DAST web application scanning requires a local listening port in an on-premise environment.</span>
                </span>
              )}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="w-full lg:w-80">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Assessment Pipeline Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-[#0b1120] p-1 rounded-lg border border-slate-300 dark:border-slate-700">
              
              {/* SAST (Active / Recommended) */}
              <button
                type="button"
                onClick={() => handleSelectMode('sast')}
                disabled={isScanning}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
                  mode === 'sast'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                } disabled:opacity-50`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>SAST (Code Analysis)</span>
              </button>

              {/* DAST (Requires Local Port) */}
              <button
                type="button"
                onClick={() => handleSelectMode('dast')}
                disabled={isScanning}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
                  mode === 'dast'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                    : 'text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400'
                } disabled:opacity-50`}
                title="DAST is offline in cloud deployment (requires local deployed port)"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>DAST (Local Only)</span>
              </button>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 justify-end">
            {isScanning ? (
              <button
                type="button"
                onClick={onCancelScan}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/30 active:scale-[0.98] transition-all cursor-pointer"
                title="Cancel active assessment immediately"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Assessment</span>
              </button>
            ) : mode === 'dast' ? (
              <button
                type="button"
                onClick={switchToSast}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all cursor-pointer"
              >
                <span>Switch to SAST Mode</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!target.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch SAST Assessment</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* EXPLICIT DAST OFFLINE ERROR BANNER (When DAST is selected)            */}
        {/* -------------------------------------------------------------------- */}
        {dastError && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 text-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-900 dark:text-red-200 font-bold mb-0.5">
                  ⛔ DAST Scanning Disabled in Cloud Environment
                </strong>
                <p className="leading-relaxed">
                  Dynamic Application Security Testing (DAST) requires an on-premise daemon and a locally running web application port (e.g. <code>localhost:3000</code>) inside an internal network. In this cloud-hosted demo, local socket probing is restricted. Please switch to <strong>SAST (Code) Mode</strong> to evaluate public GitHub repositories.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={switchToSast}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
            >
              Switch to SAST Mode
            </button>
          </div>
        )}

        {/* Server Error notification banner if any */}
        {serverError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* AI Model Intelligence Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <Cpu className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>AI Intelligence Engine:</span>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={handleModelChange}
                disabled={isScanning}
                className="bg-slate-100 dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all disabled:opacity-50 cursor-pointer"
              >
                {/* Autonomous Rule Engine Option */}
                <optgroup label="Recommended for Review">
                  <option value="instant">⚡ Autonomous Rule Engine (Deterministic / Instant)</option>
                </optgroup>

                {/* Installed Local Ollama Models */}
                {modelCatalog?.installed_models && modelCatalog.installed_models.length > 0 ? (
                  <optgroup label="Local Air-Gapped Models (Ollama)">
                    {modelCatalog.installed_models.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} {m.parameter_size ? `(${m.parameter_size})` : ''} - {m.size_gb}GB
                        {m.capabilities?.includes('thinking') ? ' ★ Thinking' : ''}
                      </option>
                    ))}
                  </optgroup>
                ) : (
                  <optgroup label="Local Air-Gapped Models (Ollama On-Premise)">
                    <option value="qwen3.5:4b">qwen3.5:4b (4.7B 3.4GB) ★ Local Intelligence</option>
                    <option value="gemma2:9b">gemma2:9b (9.2B 5.4GB)</option>
                  </optgroup>
                )}

                {/* Cloud Models */}
                <optgroup label="Cloud Models (Online Fallback)">
                  {modelCatalog?.cloud_models?.map((cm) => (
                    <option key={cm.name} value={cm.name}>
                      {cm.display_name} {modelCatalog?.cloud_ready ? '🟢' : '🔑 Key Needed'}
                    </option>
                  )) || (
                    <>
                      <option value="cloud:minimaxai/minimax-m3.1-flash">NVIDIA NIM: minimax-m3.1-flash (Ultra-Fast ⚡) 🟢</option>
                      <option value="cloud:nvidia/nemotron-3.5-lightning-30b-a3b">NVIDIA NIM: nemotron-3.5-lightning-30b (Reasoning 🧠) 🟢</option>
                    </>
                  )}
                </optgroup>
              </select>
            </div>

            {/* Refresh installed models button */}
            <button
              type="button"
              onClick={fetchModels}
              disabled={isLoadingModels || isScanning}
              className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded transition-colors disabled:opacity-40"
              title="Refresh installed Ollama models"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? 'animate-spin' : ''}`} />
            </button>

            {/* Badge */}
            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded-md font-medium text-[11px]">
              <Sparkles className="w-3 h-3 text-purple-500" />
              Automated Deduction Active
            </span>
          </div>

          {/* Right Status Pill */}
          <div className="flex items-center gap-2">
            {modelCatalog?.ollama_online ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ollama: Connected (Local)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Local Ollama: Standby (Using Rule Engine)</span>
              </span>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
