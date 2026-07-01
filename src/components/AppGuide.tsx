import { useState, useEffect, useRef, CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ArrowLeft, X, Play, HelpCircle } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  targetId?: string;
  position: "center" | "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Verse Web3 Hub! 🚀",
    description: "This interactive hub is built to demystify how blockchains, cryptography, and decentralized applications work. Instead of boring walls of text, you will learn using live hands-on sandboxes. Let's take a quick 1-minute guided tour!",
    position: "center"
  },
  {
    title: "The Core Curriculum 📚",
    description: "These are your fundamental learning blocks: Blockchain, Wallets, DeFi, and Security. Click any of these cards to instantly switch the active simulator below and practice the concepts in real time.",
    targetId: "tracks",
    position: "bottom"
  },
  {
    title: "Interactive Plain English Glossary 💡",
    description: "Notice terms with dashed underlines like 'Decentralized Ledger'? Hover over them (or tap them on mobile) anytime to reveal human-friendly real-world analogies and clear, simple definitions.",
    targetId: "tracks", // Pointing here to highlight where the terms are easily found
    position: "bottom"
  },
  {
    title: "Interactive Blockchain Sandbox 🛠️",
    description: "Here you can physically build a live cryptographic ledger. Add custom transactions, mine blocks to satisfy Proof of Work, or 'tamper' with previous blocks to watch how cryptographic hash links instantly break!",
    targetId: "blockchain-simulator",
    position: "top"
  },
  {
    title: "Simulate Wallet Connections 🔑",
    description: "Try clicking 'Connect Wallet' in the header. It simulates a browser-based Web3 signature, provisioning mock VERSE balances to power transaction fee operations across the interactive sandbox.",
    targetId: "wallet-connect-btn",
    position: "bottom"
  },
  {
    title: "Prove Your Knowledge & Claim Your Badge 🎓",
    description: "Ready to test what you've learned? Complete the short Web3 Quiz to unlock, customize, and secure your verifiable Completion Badge as proof of your newly minted on-chain knowledge!",
    targetId: "quiz-section",
    position: "top"
  }
];

export default function AppGuide() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState<CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  // Check localStorage on mount to launch automatically for new users
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("verse_tour_completed");
    if (!hasSeenTour) {
      // Start the tour automatically for new users after a small delays to let the app settle
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setIsActive(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling outside the guided tour container
  };

  const endTour = () => {
    setIsActive(false);
    localStorage.setItem("verse_tour_completed", "true");
    document.body.style.overflow = ""; // Restore scrolling
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Track the bounding box of the highlighted element
  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStep];
    if (!step.targetId) {
      setHighlightStyle({});
      return;
    }

    const updateHighlight = () => {
      const element = document.getElementById(step.targetId!);
      if (element) {
        // Scroll the element into view smoothly so the highlight aligns perfectly
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });

        // Small timeout to allow smooth scroll to finish before calculating bounding box
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

          setHighlightStyle({
            top: rect.top + scrollTop - 8,
            left: rect.left + scrollLeft - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            opacity: 1,
          });
        }, 300);
      } else {
        setHighlightStyle({});
      }
    };

    updateHighlight();

    // Listen to window changes
    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight);

    return () => {
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight);
    };
  }, [currentStep, isActive]);

  if (!isActive) {
    // Show a small beautiful trigger button so users can always replay the tour
    return (
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-full shadow-2xl border border-indigo-500/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 group text-xs cursor-pointer"
        title="Start Interactive User Guide"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
        <span>How to Use</span>
      </button>
    );
  }

  const currentStepData = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-slate-950/80 backdrop-blur-xs select-none flex items-center justify-center p-4">
      
      {/* Target Spotlight Highlight Ring */}
      {currentStepData.targetId && highlightStyle.top !== undefined && (
        <motion.div
          layoutId="spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={highlightStyle}
          className="absolute border-2 border-indigo-500 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.4)] pointer-events-none z-50 bg-indigo-500/5"
        />
      )}

      {/* Guide Card Dialog */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.25 }}
          ref={cardRef}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-6 sm:p-7 rounded-2xl shadow-3xl z-50 text-left space-y-5"
        >
          {/* Header indicator */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                Verse Hub Tour
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          {/* Guide Title and Description */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentStepData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 py-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-800"
                }`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
            <button
              onClick={endTour}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold cursor-pointer transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>Get Started <X className="w-3.5 h-3.5 ml-0.5" /></>
                ) : (
                  <>Next <ArrowRight className="w-3.5 h-3.5 ml-0.5" /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
