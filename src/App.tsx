/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Wallet, ShieldCheck, Cpu, HelpCircle, GraduationCap, ChevronRight, Sparkles, BookOpen, ExternalLink, HelpCircleIcon } from "lucide-react";
import LearnModules from "./components/LearnModules";
import BlockchainSimulator from "./components/BlockchainSimulator";
import Web3Quiz from "./components/Web3Quiz";
import { WalletState } from "./types";

export default function App() {
  // Simulated Web3 Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: "0.00",
    network: "Verse Testnet"
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleWalletConnection = () => {
    if (wallet.connected) {
      // Disconnect
      setWallet({
        connected: false,
        address: null,
        balance: "0.00",
        network: "Verse Testnet"
      });
    } else {
      // Connect
      setIsConnecting(true);
      setTimeout(() => {
        setWallet({
          connected: true,
          address: "0x7f3e...b4a1",
          balance: "250.00 VERSE",
          network: "Verse Mainnet"
        });
        setIsConnecting(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative pb-16">
      
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER / NAVIGATION */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/20">
              V
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              VERSE <span className="text-indigo-400 font-medium text-xs border border-indigo-500/30 px-2 py-0.5 rounded-full ml-1.5 bg-indigo-950/40">LEARN WEB3</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8 text-xs font-semibold text-slate-400 tracking-wide uppercase">
            <a href="#tracks" className="hover:text-white transition-colors">Learning Tracks</a>
            <a href="#blockchain-simulator" className="hover:text-white transition-colors">Blockchain Simulator</a>
            <a href="#quiz-section" className="hover:text-white transition-colors">Knowledge Challenge</a>
          </nav>

          <div className="flex items-center gap-3">
            {wallet.connected && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-900/30 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono text-xs font-bold">{wallet.balance}</span>
              </div>
            )}
            
            <button
              onClick={toggleWalletConnection}
              disabled={isConnecting}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                wallet.connected
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700"
                  : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/15"
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              {isConnecting ? (
                <span>Connecting...</span>
              ) : wallet.connected ? (
                <span className="font-mono">{wallet.address}</span>
              ) : (
                <span>Connect Wallet</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-24">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Beginner-Friendly Hub
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            Demystifying the <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Internet of Value</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-medium">
            Welcome to the <strong className="text-indigo-300 font-semibold">Verse Learning Hub</strong>. No complex formulas, no extreme computer-science jargon. Just clear analogies and real-time simulators designed to take you from curious explorer to confident native.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="#tracks"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/10 flex items-center gap-1"
            >
              Start Learning <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#blockchain-simulator"
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" /> Sandbox Simulator
            </a>
          </div>
        </section>

        {/* SECTION 1: CORE MODULES */}
        <hr className="border-slate-900" />
        <LearnModules />

        {/* SECTION 2: LIVE SIMULATOR */}
        <hr className="border-slate-900" />
        <BlockchainSimulator />

        {/* SECTION 3: KNOWLEDGE CHECK */}
        <hr className="border-slate-900" />
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              Assess Your Progress
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Test your grasp on crucial concepts like transaction fees, self-custody keys, and consensus.
            </p>
          </div>
          <Web3Quiz />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Powered by Verse Ecosystem. Submission for Design vs Coding Challenge.</p>
        <div className="flex items-center gap-4">
          <a href="#tracks" className="hover:text-slate-300 transition-colors">Curriculums</a>
          <a href="#blockchain-simulator" className="hover:text-slate-300 transition-colors">Simulator</a>
          <a href="#quiz-section" className="hover:text-slate-300 transition-colors">Quiz Challenge</a>
        </div>
      </footer>
    </div>
  );
}
