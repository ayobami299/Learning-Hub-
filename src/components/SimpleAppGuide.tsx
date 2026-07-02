import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, X, BookOpen, Cpu, Shield, GraduationCap, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function SimpleAppGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);

  // Check if user has closed the initial welcome guide before
  useEffect(() => {
    const closed = localStorage.getItem("verse_guide_banner_closed");
    if (closed === "true") {
      setIsBannerCollapsed(true);
    }
  }, []);

  const handleCloseBanner = () => {
    setIsBannerCollapsed(true);
    localStorage.setItem("verse_guide_banner_closed", "true");
  };

  const handleResetGuide = () => {
    setIsBannerCollapsed(false);
    localStorage.removeItem("verse_guide_banner_closed");
  };

  const guideSteps = [
    {
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      title: "1. Choose Your Learning Track",
      desc: "Select between Blockchain, Wallets, DeFi, or Security cards. This instantly loads matching simulations and lessons below."
    },
    {
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      title: "2. Mine & Tamper in the Sandbox",
      desc: "Use the live Blockchain Simulator to add custom transactions, mine new blocks, or tamper with data to watch hash connections break in real-time."
    },
    {
      icon: <Shield className="w-4 h-4 text-indigo-400" />,
      title: "3. Connect Your Sim Wallet",
      desc: "Click 'Connect Wallet' at the top right. This simulates secure Web3 signature requests and issues you a test VERSE currency balance."
    },
    {
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
      title: "4. Claim Your Verifiable Badge",
      desc: "Test your skills with the interactive Quiz at the bottom, achieve a perfect score, and design a customized Completion Badge to share!"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Interactive Banner Guide */}
      <AnimatePresence>
        {!isBannerCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Quick Start Guide
                </h3>
              </div>
              
              <button
                onClick={handleCloseBanner}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Dismiss Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Welcome to the interactive Verse Web3 Hub! This educational playground makes complex cryptographic ledger mechanics easy to understand. Follow these steps to maximize your learning:
            </p>

            {/* Quick Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {guideSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl space-y-2 hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Tip bubble */}
            <div className="mt-4 flex items-center gap-2 bg-indigo-950/20 border border-indigo-900/30 p-2.5 rounded-xl text-[11px] text-indigo-300">
              <span className="font-extrabold uppercase text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-sm">💡 Tip</span>
              <span>Notice terms with dashed underlines like <span className="underline decoration-indigo-400/50 decoration-dashed underline-offset-2 font-medium text-slate-200">Decentralized Ledger</span>? Hover over them anytime to reveal visual analogies in Plain English!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floater triggering button at the bottom-right screen corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isBannerCollapsed && (
          <button
            onClick={handleResetGuide}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white font-medium py-1.5 px-3 rounded-full shadow-lg border border-slate-800 flex items-center gap-1.5 transition-all text-[10px] cursor-pointer"
          >
            Show Quick Start Banner
          </button>
        )}
        
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-full shadow-2xl border border-indigo-500/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 group text-xs cursor-pointer"
          title="Open Simple App User Guide"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>User Guide</span>
        </button>
      </div>

      {/* Guide Dialog Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-3xl space-y-5 text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900/40">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    How to Use Verse Web3 Hub
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Guide Contents */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Verse Web3 Hub is structured so you can learn theory alongside functional simulations. Follow this recommended flow:
                </p>

                <div className="space-y-3.5">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Select a Learning Module</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        At the top of the hub, click on cards like <strong>Blockchain Basics</strong> or <strong>Wallets & Keys</strong>. Each card introduces you to key concepts with a simple, hands-on analogy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Interact with the Ledger</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Scroll to the <strong>Interactive Blockchain Simulator</strong>. This live model shows blocks linked by cryptographic hashes. Try editing data in Block #2 and watch how Block #3 turns red because its reference hash is broken! Mine it to re-establish trust.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Simulate Wallet Activity</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Click <strong>Connect Wallet</strong> to practice browser wallet interactions. See your test wallet address and watch your simulated VERSE token balance update. You can use these simulated funds to pay mining reward gas fees in the simulator.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Complete the Verification Challenge</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Challenge yourself in the <strong>Web3 Knowledge Challenge</strong>. Answering all questions correctly unlocks a gorgeous collectible badge which you can customize and dynamically sign!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Interactive Glossary Enabled
                  </div>
                  <p className="leading-relaxed">
                    Look for words with dotted lines throughout the app. Simply hover or tap them to see our human-friendly definitions with memorable analogies.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800/60 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
                >
                  Got It, Thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
