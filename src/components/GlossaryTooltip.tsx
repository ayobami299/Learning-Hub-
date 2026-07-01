import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, Sparkles, AlertCircle } from "lucide-react";

interface GlossaryItem {
  term: string;
  definition: string;
  analogy: string;
  category: "core" | "identity" | "finance" | "security";
}

const GLOSSARY_DICTIONARY: Record<string, GlossaryItem> = {
  "decentralized ledger": {
    term: "Decentralized Ledger",
    definition: "A digital ledger/database shared across a global network of computers. Every computer keeps an identical copy, so no single company or entity can change or fake history.",
    analogy: "Like a shared Google Doc that is visible to everyone, but once a line is added, it can never be deleted or modified by anyone.",
    category: "core"
  },
  "asymmetric cryptography": {
    term: "Asymmetric Cryptography",
    definition: "A cryptographic system using pairs of keys: a Public Key (to receive data/funds) and a Private Key (to unlock and authorize transactions).",
    analogy: "Like a physical mailbox. Anyone can slide letters into the public slot (Public Key), but only you have the physical key to open it and take them out (Private Key).",
    category: "identity"
  },
  "smart contracts": {
    term: "Smart Contracts",
    definition: "Self-executing computer code stored on a blockchain that automatically executes agreements when pre-defined conditions are met.",
    analogy: "Like a digital vending machine. You insert the right money (input), and it instantly and unconditionally releases your soda (output) without a middleman.",
    category: "finance"
  },
  "self-custody safety": {
    term: "Self-Custody Safety",
    definition: "Being fully responsible for storing your own digital assets and access keys without relying on banks or intermediaries.",
    analogy: "Like keeping gold in a high-security home vault instead of a commercial bank. You have complete freedom, but there's no bank manager to reset your password if you forget the combination.",
    category: "security"
  },
  "private key": {
    term: "Private Key",
    definition: "A secret, mathematical string of numbers/letters that acts as your master password and digital signature to authorize blockchain transactions.",
    analogy: "Like your banking PIN or master password. If anyone sees your Private Key, they can instantly take all of your assets.",
    category: "identity"
  },
  "public key": {
    term: "Public Key",
    definition: "A cryptographic address that uniquely identifies your wallet on the blockchain. It is public and safe to share with others.",
    analogy: "Like your email address or bank account IBAN. Anyone can look it up to send you assets, but they cannot access your account with it.",
    category: "identity"
  },
  "seed phrase": {
    term: "Seed Phrase",
    definition: "A human-readable sequence of 12 or 24 random words used to generate and restore your private keys and wallet data.",
    analogy: "Like a physical master recovery card. If your phone or computer breaks, typing these words into any new wallet instantly restores all your coins.",
    category: "security"
  },
  "defi": {
    term: "DeFi (Decentralized Finance)",
    definition: "A movement to replace traditional financial intermediaries (banks, brokers) with open, autonomous smart contract protocols.",
    analogy: "Like an automatic banking system that operates 24/7. Anyone in the world can borrow or swap assets instantly without credit checks or approvals.",
    category: "finance"
  },
  "gas fee": {
    term: "Gas Fee",
    definition: "A transaction fee paid by users to network validators/miners to compensate for the electrical power and computing resources needed to process transactions.",
    analogy: "Like paying a toll to drive on a highway. When the highway gets congested, the toll rises (surge pricing) to keep the system moving smoothly.",
    category: "core"
  },
  "liquidity pool": {
    term: "Liquidity Pool",
    definition: "A crowdsourced pool of tokens locked in a smart contract that allows users to trade assets with the contract pool instead of directly matching with other buyers/sellers.",
    analogy: "Like a self-operating coin exchanger. It holds a fixed ratio of tokens so you can swap instantly, rather than waiting for an actual buyer to arrive.",
    category: "finance"
  },
  "constant product formula": {
    term: "Constant Product Formula",
    definition: "The core mathematical equation (x × y = k) used by decentralized exchanges to determine asset prices autonomously without an order book.",
    analogy: "Ensures the total multiplied value of both assets remains equal. As you buy more of token 'X', there are fewer left, making 'X' exponentially scarcer and more expensive.",
    category: "finance"
  },
  "price impact": {
    term: "Price Impact",
    definition: "The change in an asset's price caused directly by your trade size relative to the total quantity of tokens available in the liquidity pool.",
    analogy: "If you buy 1 gallon of milk from a grocery store, the price is unchanged. If you try to buy 10,000 gallons at once, the store will hike the price of the remaining bottles.",
    category: "finance"
  },
  "proof of work": {
    term: "Proof of Work",
    definition: "A security and consensus mechanism where mining computers compete to solve complex mathematical puzzles in order to validate transactions and add new blocks.",
    analogy: "Like an intense math competition where the first person to solve a complex equation gets to lock the current page of the ledger and receive a coin reward.",
    category: "core"
  },
  "genesis block": {
    term: "Genesis Block",
    definition: "The first physical block of data (Block #1) ever recorded on a blockchain network.",
    analogy: "The solid foundation stone laid at the very bottom of a skyscraper. It anchors everything that is built on top of it.",
    category: "core"
  },
  "hash": {
    term: "Hash",
    definition: "A unique, fixed-length alphanumeric string generated by passing data through a cryptographic hashing function.",
    analogy: "Like a digital fingerprint. If you change even a single character or comma in the entire block, the fingerprint changes completely, alerting the network of a hack.",
    category: "core"
  }
};

interface GlossaryTooltipProps {
  term: string;
  children?: ReactNode;
  align?: "left" | "right" | "center";
}

export default function GlossaryTooltip({ term, children, align = "center" }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  const searchKey = term.trim().toLowerCase();
  const info = GLOSSARY_DICTIONARY[searchKey] || {
    term,
    definition: "A technical Web3 term representing a decentralized, cryptographic, or financial concept.",
    analogy: "No specific analogy is available, but this term is critical for secure on-chain operations.",
    category: "core"
  };

  // Close when clicking outside (extremely helpful on mobile taps)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "identity":
        return "text-amber-400 bg-amber-950/40 border-amber-900/30";
      case "finance":
        return "text-emerald-400 bg-emerald-950/40 border-emerald-900/30";
      case "security":
        return "text-rose-400 bg-rose-950/40 border-rose-900/30";
      default:
        return "text-indigo-400 bg-indigo-950/40 border-indigo-900/30";
    }
  };

  const getAlignClass = () => {
    if (align === "left") return "left-0 origin-top-left";
    if (align === "right") return "right-0 origin-top-right";
    return "left-1/2 -translate-x-1/2 origin-top";
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-block z-10"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }
        }}
        className="border-b border-dashed border-indigo-400/85 hover:border-indigo-300 hover:text-indigo-300 cursor-help transition-colors inline-flex items-center gap-0.5 font-semibold text-left focus:outline-none select-none"
      >
        {children || term}
        <HelpCircle className="w-3 h-3 text-indigo-400/60 inline shrink-0" />
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute bottom-full mb-2.5 w-72 sm:w-80 bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-2xl z-50 pointer-events-auto block ${getAlignClass()}`}
          >
            {/* Header / Category Badge */}
            <span className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold text-sm text-white tracking-tight">
                {info.term}
              </span>
              <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${getCategoryColor(info.category)}`}>
                {info.category}
              </span>
            </span>

            {/* Main definition */}
            <span className="block text-slate-300 text-xs leading-relaxed mb-2.5 text-left">
              {info.definition}
            </span>

            {/* Analogy bubble */}
            <span className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-lg flex items-start gap-2 text-[11px] text-slate-400 text-left">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span className="block leading-relaxed">
                <span className="font-semibold text-slate-300">Plain English:</span> {info.analogy}
              </span>
            </span>

            {/* Small arrow tooltip indicator */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-[6px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
