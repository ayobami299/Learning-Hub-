import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ShieldCheck, HelpCircle, Award, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";
import { QuizQuestion } from "../types";

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Who ultimately controls your crypto wallet assets?",
    analogy: "Imagine you lose access to your favorite wallet software interface, but you safely wrote down your 12-word seed phrase on paper. What happens to your coins?",
    options: [
      { key: "A", text: "The assets are lost forever because the wallet app broke down or went out of business." },
      { key: "B", text: "Nothing! You can restore your backup seed phrase into any compliant wallet software to access your coins." },
      { key: "C", text: "The government or the wallet company can recover it for you if you show them your ID." }
    ],
    correctAnswer: "B",
    explanation: "Your assets do not live 'inside' the wallet software. They reside decentralized on the global blockchain ledger. The seed phrase is the ultimate master key. Anyone with those 12 words has full ownership of your funds, and no customer support can ever recover them if lost!"
  },
  {
    id: 2,
    question: "What is a blockchain 'gas fee' (or transaction fee)?",
    analogy: "Whenever you send funds or interact with a smart contract, you must pay a small fee. Why?",
    options: [
      { key: "A", text: "It is a monthly software fee paid to the developers who designed the blockchain wallet." },
      { key: "B", text: "It is a payment to reward network validators/miners for computing power used to process and secure your transaction." },
      { key: "C", text: "It is an environmental carbon offset tax mandated by international financial regulators." }
    ],
    correctAnswer: "B",
    explanation: "Gas fees are a basic anti-spam and incentive mechanism. Since computing resources on a decentralized network are scarce, users pay validators small amounts to execute their transactions. If transaction demand is high, gas prices rise, just like Uber surge pricing!"
  },
  {
    id: 3,
    question: "What is a Smart Contract?",
    analogy: "Instead of dealing with intermediate lawyers, clerks, or bankers, Web3 introduces programmable agreements.",
    options: [
      { key: "A", text: "An AI-powered document that automatically negotiates pricing with counterparties." },
      { key: "B", text: "An automated PDF file that requires an electronic signature (like DocuSign) to activate." },
      { key: "C", text: "Self-executing code stored on the blockchain that automatically performs actions when preset terms are met." }
    ],
    correctAnswer: "C",
    explanation: "Think of a smart contract like a blockchain-based vending machine. If you insert 1.0 ETH, it instantly triggers code to release a digital asset. No middleman, no trust needed, and the transaction is entirely public and immutable!"
  }
];

export default function Web3Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (key: string) => {
    if (isAnswered) return;
    setSelectedKey(key);
  };

  const handleSubmitAnswer = () => {
    if (!selectedKey || isAnswered) return;

    setIsAnswered(true);
    if (selectedKey === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedKey(null);
    setIsAnswered(false);
    
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedKey(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div id="quiz-section" className="max-w-2xl mx-auto p-8 rounded-2xl bg-slate-950 border border-indigo-900/30 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative badge */}
      <div className="absolute -top-3 left-6 px-4 py-1 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full uppercase tracking-widest shadow-md shadow-indigo-650/40">
        Verse Challenge
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Question Counter / Progress bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                Stage {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Title & Analogy description */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white leading-snug">
                {currentQuestion.question}
              </h3>
              <p className="text-slate-400 text-sm italic border-l-2 border-indigo-500/40 pl-3 py-0.5">
                💡 <span className="font-semibold text-indigo-300">Scenario:</span> {currentQuestion.analogy}
              </p>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedKey === option.key;
                const isCorrect = option.key === currentQuestion.correctAnswer;
                
                let optionStyle = "border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-300";
                
                if (isAnswered) {
                  if (isSelected && isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-200";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-red-500 bg-red-950/20 text-red-200";
                  } else if (isCorrect) {
                    optionStyle = "border-emerald-500/50 bg-emerald-950/10 text-emerald-300";
                  } else {
                    optionStyle = "border-slate-900/80 bg-slate-950/30 text-slate-600 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "border-indigo-500 bg-indigo-950/30 text-indigo-200 ring-1 ring-indigo-500/25";
                }

                return (
                  <button
                    key={option.key}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-start gap-3 group relative cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 mt-0.5 ${
                      isSelected && isAnswered && isCorrect
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : isSelected && isAnswered && !isCorrect
                        ? "bg-red-500 border-red-400 text-white"
                        : isSelected
                        ? "bg-indigo-600 border-indigo-400 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-500 group-hover:border-slate-600"
                    }`}>
                      {option.key}
                    </span>
                    <span className="leading-relaxed">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Submission feedback explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-xs sm:text-sm border leading-relaxed space-y-1.5 ${
                  selectedKey === currentQuestion.correctAnswer
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                    : "bg-red-950/20 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {selectedKey === currentQuestion.correctAnswer ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Correct! Excellent work.
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-400" /> Incorrect option.
                    </>
                  )}
                </div>
                <p>{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              {!isAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedKey}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View Final Score <Award className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* QUIZ COMPLETE STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-6"
          >
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 relative">
              <Award className="w-10 h-10" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border border-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Challenge Completed!</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You scored <strong className="text-indigo-400">{score} out of {QUIZ_QUESTIONS.length}</strong>!
                {score === QUIZ_QUESTIONS.length
                  ? " Outstanding! You have a crystal-clear understanding of Web3 core principles."
                  : " Great attempt! Refresh your knowledge with our curriculums to score a perfect 100%."}
              </p>
            </div>

            {/* Cert Badge presentation */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 max-w-sm mx-auto text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                  Ecosystem Verified
                </span>
                <h4 className="text-base font-bold text-white mt-1">Web3 Safety Pioneer</h4>
                <p className="text-slate-500 text-[10px] mt-0.5">Verified on-chain via Verse Hub</p>
              </div>
            </div>

            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Challenge
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
