import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, BookOpen, Smartphone, Sparkles, Check, AlertOctagon, HelpCircle } from "lucide-react";
import WalletDemo from "./WalletDemo";
import DeFiSwapDemo from "./DeFiSwapDemo";
import GlossaryTooltip from "./GlossaryTooltip";

const MODULES = [
  {
    id: "blockchain",
    title: "1. What is a Blockchain?",
    description: "Think of it as a shared Google Doc that everyone can see, but no one can edit or delete past entries. It only allows adding new rows of data.",
    concept: "Decentralized Ledger",
    badge: "Core Concept",
    emoji: "🔗",
    color: "indigo"
  },
  {
    id: "wallets",
    title: "2. Crypto Wallets 101",
    description: "A wallet doesn't actually hold your coins. It holds your Private Key (your master password) and Public Key (your address for receiving funds).",
    concept: "Asymmetric Cryptography",
    badge: "Identity",
    emoji: "🔑",
    color: "amber"
  },
  {
    id: "defi",
    title: "3. DeFi Explained",
    description: "Decentralized Finance replaces traditional banks with smart contracts (automated code) that handle loans, trading, and interest without middlemen.",
    concept: "Smart Contracts",
    badge: "Finance",
    emoji: "🦄",
    color: "emerald"
  },
  {
    id: "security",
    title: "4. Web3 Security Tips",
    description: "Rule #1: Never type your seed phrase anywhere. Rule #2: Customer support will never DM you first. If it sounds too good to be true, it is malware.",
    concept: "Self-Custody Safety",
    badge: "Critical",
    emoji: "🛡️",
    color: "rose"
  }
];

interface ScamScenario {
  id: number;
  sender: string;
  message: string;
  explanation: string;
  isScam: boolean;
}

const SCAM_SCENARIOS: ScamScenario[] = [
  {
    id: 1,
    sender: "MetaMask-Support99 (Telegram DM)",
    message: "Hi, I am from MetaMask Support. There is a critical security vulnerability on your account. Please visit MetaMask-Recovery-v4.io and paste your 12-word seed phrase to secure your assets.",
    explanation: "This is a classical phishing attack! Customer support teams from wallets will NEVER DM you, nor do they ever have access to or ask for your 12-word recovery phrase. Keep that phrase offline!",
    isScam: true
  },
  {
    id: 2,
    sender: "Etherscan Tracker (System Alert)",
    message: "Your pending transaction of 0.05 ETH has been confirmed. You paid 0.002 ETH in gas fees to validators. View complete details on the block explorer.",
    explanation: "This is legitimate! Block explorers like Etherscan display public, immutable blockchain entries and receipts. Gas fees are standard on-chain payments to network operators.",
    isScam: false
  },
  {
    id: 3,
    sender: "Discord Bot - Verse Airdrop (DM)",
    message: "🎉 CONGRATULATIONS! You won 10,000 $VERSE tokens! Connect your wallet at verse-claim-airdrop-rewards.com and sign the approvals to claim right now!",
    explanation: "This is a dangerous malicious contract scam. Connecting your wallet and signing unverified contract approval permissions allows malicious code to drain/sweep all funds. If it sounds too good to be true, it is!",
    isScam: true
  }
];

export default function LearnModules() {
  const [activeTab, setActiveTab] = useState("blockchain");
  const [scamIndex, setScamIndex] = useState(0);
  const [scamAnswer, setScamAnswer] = useState<boolean | null>(null);
  const [scamResult, setScamResult] = useState<string | null>(null);

  const handleScamCheck = (userChoiceIsScam: boolean) => {
    const scenario = SCAM_SCENARIOS[scamIndex];
    const correct = userChoiceIsScam === scenario.isScam;
    setScamAnswer(correct);
    setScamResult(scenario.explanation);
  };

  const handleNextScenario = () => {
    setScamAnswer(null);
    setScamResult(null);
    setScamIndex((prev) => (prev + 1) % SCAM_SCENARIOS.length);
  };

  const activeModule = MODULES.find((m) => m.id === activeTab);

  return (
    <div id="tracks" className="space-y-10">
      
      {/* SECTION HEADER */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          The Core Curriculum
        </h2>
        <p className="text-sm text-slate-400">
          Click any module card below to dive into key plain-English concepts and interact with its live simulator tool.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODULES.map((mod) => {
          const isActive = activeTab === mod.id;
          
          let borderStyle = "border-slate-800 hover:border-slate-700 bg-slate-900/40";
          if (isActive) {
            if (mod.color === "indigo") borderStyle = "border-indigo-500 bg-indigo-950/20 shadow-indigo-900/10";
            if (mod.color === "amber") borderStyle = "border-amber-500 bg-amber-950/20 shadow-amber-900/10";
            if (mod.color === "emerald") borderStyle = "border-emerald-500 bg-emerald-950/20 shadow-emerald-900/10";
            if (mod.color === "rose") borderStyle = "border-rose-500 bg-rose-950/20 shadow-rose-900/10";
          }

          return (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${borderStyle} group relative`}
            >
              {isActive && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                  mod.color === "indigo" ? "bg-indigo-500" :
                  mod.color === "amber" ? "bg-amber-500" :
                  mod.color === "emerald" ? "bg-emerald-500" : "bg-rose-500"
                }`} />
              )}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[18px]">{mod.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    mod.color === "indigo" ? "bg-indigo-950/60 text-indigo-400 border border-indigo-900/30" :
                    mod.color === "amber" ? "bg-amber-950/60 text-amber-400 border border-amber-900/30" :
                    mod.color === "emerald" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30" :
                    "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                  }`}>
                    {mod.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-slate-200 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-normal mt-1.5 font-medium">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900/80 text-[10px] text-slate-500 flex items-center justify-between w-full">
                <span>Concept:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  <GlossaryTooltip term={mod.concept} align={mod.id === "security" ? "right" : "center"} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC COMPONENT PANEL BASED ON ACTIVE TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "blockchain" && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm space-y-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Interactive Ledger sandbox</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    See the blockchain in full action below.
                  </p>
                </div>
              </div>
              <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 space-y-4 max-w-2xl">
                <p className="text-sm text-slate-300 leading-relaxed">
                  🔗 <strong>How it works:</strong> Blocks store transaction payloads. Each block contains the cryptographic <strong>hash</strong> (fingerprint) of the previous block. If anyone changes block data, that block's hash changes instantly, disconnecting the rest of the chain!
                </p>
                <div className="pt-2">
                  <a
                    href="#blockchain-simulator"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                  >
                    Go directly to the Live Blockchain Builder below &darr;
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "wallets" && <WalletDemo />}

          {activeTab === "defi" && <DeFiSwapDemo />}

          {activeTab === "security" && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Security Audit Sandbox</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Identify Web3 threats, scams, or authentic notifications in real-time.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Scenario Display */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Review Incoming Event</span>
                      <span className="font-mono text-[10px]">Scenario {scamIndex + 1} of {SCAM_SCENARIOS.length}</span>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold font-mono uppercase bg-rose-950/20 border border-rose-900/30 px-2 py-0.5 rounded self-start">
                        Sender: {SCAM_SCENARIOS[scamIndex].sender}
                      </div>
                      <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed italic bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                        "{SCAM_SCENARIOS[scamIndex].message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleScamCheck(true)}
                      disabled={scamAnswer !== null}
                      className="flex-1 py-2.5 rounded-xl border border-rose-600/50 bg-rose-950/10 hover:bg-rose-950/30 text-rose-300 disabled:opacity-40 text-xs font-bold transition-all"
                    >
                      ⚠️ Phishing Scam / Block
                    </button>
                    <button
                      onClick={() => handleScamCheck(false)}
                      disabled={scamAnswer !== null}
                      className="flex-1 py-2.5 rounded-xl border border-emerald-600/50 bg-emerald-950/10 hover:bg-emerald-950/30 text-emerald-300 disabled:opacity-40 text-xs font-bold transition-all"
                    >
                      ✅ Legit / Safe Interaction
                    </button>
                  </div>
                </div>

                {/* Audit Feedback */}
                <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {scamAnswer !== null ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 h-full flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-sm font-extrabold">
                            {scamAnswer ? (
                              <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-900/30">
                                <Check className="w-4 h-4" /> Correct Audit!
                              </span>
                            ) : (
                              <span className="text-rose-400 flex items-center gap-1 bg-rose-950/50 px-2 py-1 rounded-lg border border-rose-900/30 animate-pulse">
                                <AlertOctagon className="w-4 h-4" /> Threat Warning!
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                            {scamResult}
                          </p>
                        </div>

                        <button
                          onClick={handleNextScenario}
                          className="w-full text-center py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 rounded-xl text-xs font-semibold transition-all mt-4"
                        >
                          Next Audit Case
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 space-y-3 h-full">
                        <HelpCircle className="w-10 h-10 text-slate-600" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Audit Pending
                          </h4>
                          <p className="text-slate-500 text-xs mt-1 max-w-xs">
                            Select either scam or legit on the left card to complete the security analysis audit.
                          </p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
