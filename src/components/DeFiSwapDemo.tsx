import { useState, useEffect } from "react";
import { ArrowUpDown, RefreshCw, Info, InfoIcon, Coins, TrendingUp } from "lucide-react";

export default function DeFiSwapDemo() {
  // Constant Product Formula State
  // Initial Pool: 1,000 VERSE and 2,000 USDC
  const [versePool, setVersePool] = useState(1000);
  const [usdcPool, setUsdcPool] = useState(2000);
  const k = 1000 * 2000; // 2,000,000 constant

  const [fromToken, setFromToken] = useState<"VERSE" | "USDC">("VERSE");
  const [inputAmount, setInputAmount] = useState<string>("10");
  const [outputAmount, setOutputAmount] = useState<number>(0);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    calculateSwap();
  }, [inputAmount, fromToken, versePool, usdcPool]);

  const calculateSwap = () => {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      setOutputAmount(0);
      setPriceImpact(0);
      return;
    }

    if (fromToken === "VERSE") {
      // Swapping VERSE for USDC
      const newVersePool = versePool + amount;
      const newUsdcPool = k / newVersePool;
      const usdcOut = usdcPool - newUsdcPool;

      // Current spot price = usdcPool / versePool
      const spotPrice = usdcPool / versePool;
      // Effective price paid = usdcOut / amount
      const effectivePrice = usdcOut / amount;
      // Price impact
      const impact = ((spotPrice - effectivePrice) / spotPrice) * 100;

      setOutputAmount(parseFloat(usdcOut.toFixed(4)));
      setPriceImpact(parseFloat(Math.max(0, impact).toFixed(2)));
      setExplanation(
        `You add ${amount} VERSE into the pool, bringing the VERSE balance to ${newVersePool.toFixed(0)}. To keep the constant product (x × y = k) at ${k.toLocaleString()}, the USDC balance must decrease to ${newUsdcPool.toFixed(0)}, releasing the remaining USDC to you.`
      );
    } else {
      // Swapping USDC for VERSE
      const newUsdcPool = usdcPool + amount;
      const newVersePool = k / newUsdcPool;
      const verseOut = versePool - newVersePool;

      // Current spot price = versePool / usdcPool
      const spotPrice = versePool / usdcPool;
      // Effective price
      const effectivePrice = verseOut / amount;
      const impact = ((spotPrice - effectivePrice) / spotPrice) * 100;

      setOutputAmount(parseFloat(verseOut.toFixed(4)));
      setPriceImpact(parseFloat(Math.max(0, impact).toFixed(2)));
      setExplanation(
        `You add ${amount} USDC into the pool, bringing the USDC balance to ${newUsdcPool.toFixed(0)}. To maintain the constant (x × y = k) at ${k.toLocaleString()}, the VERSE balance drops to ${newVersePool.toFixed(0)}, payout the difference in VERSE.`
      );
    }
  };

  const handleSwapTokens = () => {
    setFromToken(fromToken === "VERSE" ? "USDC" : "VERSE");
    setInputAmount(outputAmount > 0 ? outputAmount.toFixed(2) : "10");
  };

  const handleResetPool = () => {
    setVersePool(1000);
    setUsdcPool(2000);
    setInputAmount("10");
  };

  const toToken = fromToken === "VERSE" ? "USDC" : "VERSE";
  const currentSpotPrice = (usdcPool / versePool).toFixed(4);

  return (
    <div id="defi-swap-demo" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">DeFi Automated Swaps</h3>
          <p className="text-sm text-slate-400 mt-1">
            Swap assets directly with an autonomous mathematical pool instead of an order book.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SWAP CARD */}
        <div className="lg:col-span-6 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Swap assets instantly</span>
              <button
                onClick={handleResetPool}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Reset Pool
              </button>
            </div>

            {/* Input Box */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>You Sell</span>
                <span>Balance: Simulated</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-transparent text-lg md:text-xl font-bold text-white focus:outline-none w-2/3"
                />
                <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm font-bold text-slate-200">
                  {fromToken}
                </span>
              </div>
            </div>

            {/* Swap Button Icon */}
            <div className="flex justify-center -my-2">
              <button
                onClick={handleSwapTokens}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Output Box */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>You Buy (Estimated)</span>
                <span>Rate: Guaranteed</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-lg md:text-xl font-bold text-emerald-400">
                  {outputAmount > 0 ? outputAmount.toLocaleString() : "0.00"}
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-sm font-bold text-slate-200">
                  {toToken}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-3 text-xs space-y-2 mt-4">
            <div className="flex justify-between text-slate-400">
              <span>Spot exchange rate:</span>
              <span className="font-mono text-white">1 VERSE = {currentSpotPrice} USDC</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Price Impact:</span>
              <span className={`font-semibold ${priceImpact > 10 ? "text-red-400" : priceImpact > 3 ? "text-amber-400" : "text-emerald-400"}`}>
                {priceImpact > 0 ? `${priceImpact}%` : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* POOL VISUALIZER */}
        <div className="lg:col-span-6 bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Liquidity Pool Equation (x × y = k)</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-normal">
              Smart contracts lock reserves of both tokens. Swapping adds one token type to the reserve, meaning you must pull some of the other out so that the formula product remains identical.
            </p>

            {/* Formula display */}
            <div className="flex items-center justify-center gap-2 py-3 bg-slate-950/80 border border-slate-800 rounded-lg font-mono text-center">
              <div className="text-xs">
                <span className="text-indigo-400 font-bold block">VERSE (x)</span>
                <span className="text-white text-sm">{versePool.toLocaleString()}</span>
              </div>
              <span className="text-slate-600">×</span>
              <div className="text-xs">
                <span className="text-emerald-400 font-bold block">USDC (y)</span>
                <span className="text-white text-sm">{usdcPool.toLocaleString()}</span>
              </div>
              <span className="text-slate-600">=</span>
              <div className="text-xs">
                <span className="text-slate-400 font-bold block">Constant (k)</span>
                <span className="text-amber-400 text-sm font-semibold">{k.toLocaleString()}</span>
              </div>
            </div>

            {/* Slippage & impact analogy */}
            {parseFloat(inputAmount) > 0 && outputAmount > 0 && (
              <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 flex gap-2.5 items-start">
                <InfoIcon className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {explanation}{" "}
                  {priceImpact > 5 && (
                    <span className="text-amber-400 font-medium block mt-1">
                      ⚠️ Note high price impact! Large trades relative to pool size make the price exponentially worse.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
            <span>DeFi Core Analogy</span>
            <span className="text-indigo-400 font-medium">Automatic Vending Machine</span>
          </div>
        </div>

      </div>
    </div>
  );
}
