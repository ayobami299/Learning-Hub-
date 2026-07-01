import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, Shield, RefreshCw, Copy, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import GlossaryTooltip from "./GlossaryTooltip";

const SEED_PHRASE_WORDS = [
  "apple", "banana", "galaxy", "pioneer", "orbital", "canvas",
  "vintage", "spark", "quantum", "gravity", "anchor", "shadow",
  "matrix", "breeze", "ocean", "copper", "timber", "summit",
  "harvest", "pinnacle", "beacon", "crypto", "vertex", "horizon"
];

export default function WalletDemo() {
  const [userName, setUserName] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedText, setCopiedText] = useState<"public" | "seed" | null>(null);

  const generateWallet = () => {
    if (!userName.trim()) return;
    
    // Select 12 random words deterministically based on input or just randomly
    const shuffled = [...SEED_PHRASE_WORDS].sort(() => 0.5 - Math.random());
    const phrase = shuffled.slice(0, 12);
    setSeedPhrase(phrase);

    // Create a mock public address and private key
    const hashHex = Array.from(userName)
      .reduce<string>((acc: string, char: string) => acc + char.charCodeAt(0).toString(16), "")
      .padEnd(10, "9");
    
    const derivedPublic = `0x${hashHex.slice(0, 6)}...${hashHex.slice(-4)}`;
    const derivedPrivate = `pv_key_0x${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 6)}`;

    setPublicKey(derivedPublic);
    setPrivateKey(derivedPrivate);
    setIsGenerated(true);
    setShowSeed(false);
    setShowPrivateKey(false);
  };

  const copyToClipboard = (text: string, type: "public" | "seed") => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div id="wallet-demo" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
          <Key className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Crypto Wallets 101</h3>
          <p className="text-sm text-slate-400 mt-1">
            Generate your own mock wallet and see how <GlossaryTooltip term="Asymmetric Cryptography" /> works.
          </p>
        </div>
      </div>

      {!isGenerated ? (
        <div className="space-y-4">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 text-sm text-slate-300">
            <p className="leading-relaxed">
              🔑 <strong className="text-indigo-400">Concept:</strong> A wallet doesn't store coins. It's just a key pair generator. Your <span className="text-emerald-400 font-semibold"><GlossaryTooltip term="Public Key" /></span> is like your public email address, and your <span className="text-amber-400 font-semibold"><GlossaryTooltip term="Seed Phrase" /></span> is your master password to unlock it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter a username (e.g., Alice)"
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
            />
            <button
              onClick={generateWallet}
              disabled={!userName.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
            >
              Generate Keypair <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Public Key Display */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/30">
                  <GlossaryTooltip term="Public Key">Public Key</GlossaryTooltip> (Your Address)
                </span>
                <span className="text-[10px] text-slate-500">Like your email address</span>
              </div>
              <p className="text-slate-400 text-xs">Share this with anyone to receive crypto. It is safe to reveal.</p>
              <div className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-lg mt-2 border border-slate-800/80">
                <code className="text-emerald-400 font-mono text-sm">{publicKey}</code>
                <button
                  onClick={() => copyToClipboard(publicKey, "public")}
                  className="p-1 hover:text-white text-slate-500 transition-colors"
                >
                  {copiedText === "public" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Private Key Display */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/30">
                  <GlossaryTooltip term="Private Key">Private Key</GlossaryTooltip> (Signing Key)
                </span>
                <span className="text-[10px] text-slate-500">Like your banking password</span>
              </div>
              <p className="text-slate-400 text-xs">Used to sign transactions. NEVER share this. It can sweep your wallet.</p>
              <div className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-lg mt-2 border border-slate-800/80">
                <code className="text-amber-500 font-mono text-xs select-all">
                  {showPrivateKey ? privateKey : "••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="p-1 hover:text-white text-slate-500 transition-colors"
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Seed Phrase Master Backup */}
          <div className="p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">Your 12-Word <GlossaryTooltip term="Seed Phrase" /> (Mnemonic)</span>
              </div>
              <button
                onClick={() => setShowSeed(!showSeed)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center gap-1.5"
              >
                {showSeed ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hide Phrase
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Reveal Phrase
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              A human-friendly backup of your cryptographic keys. Lose this, and you lose access to your funds forever.
            </p>

            <div className="relative">
              <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 transition-all duration-300 ${!showSeed ? "blur-md select-none pointer-events-none" : ""}`}>
                {seedPhrase.map((word, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800/80 rounded-lg p-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-indigo-400/60 font-mono font-semibold">{(i + 1).toString().padStart(2, "0")}</span>
                    <span className="text-slate-300 text-xs font-medium">{word}</span>
                  </div>
                ))}
              </div>
              
              {!showSeed && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 rounded-xl">
                  <button
                    onClick={() => setShowSeed(true)}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium shadow-md shadow-indigo-900/40 transition-colors"
                  >
                    Reveal Backup Seed Phrase
                  </button>
                </div>
              )}
            </div>

            {showSeed && (
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-amber-400/80 flex items-center gap-1 font-semibold">
                  ⚠️ Never share this seed phrase with anyone!
                </span>
                <button
                  onClick={() => copyToClipboard(seedPhrase.join(" "), "seed")}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedText === "seed" ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied!
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Phrase
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setIsGenerated(false);
                setUserName("");
              }}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Create another wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
