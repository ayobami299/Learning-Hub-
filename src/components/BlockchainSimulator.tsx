import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link2, AlertTriangle, Hammer, Trash2, Plus, RefreshCw, Lock, Unlock, CheckCircle2 } from "lucide-react";
import { Block } from "../types";
import GlossaryTooltip from "./GlossaryTooltip";

// Fast, deterministic hash function that produces a realistic 32-character hexadecimal string.
// If difficultyPrefix is provided, we can simulate hashing until the prefix matches.
function calculateBlockHash(id: number, prevHash: string, data: string, nonce: number): string {
  const str = `${id}|${prevHash}|${data}|${nonce}`;
  let h1 = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h1 ^= str.charCodeAt(i);
    h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24);
  }
  const hex = (h1 >>> 0).toString(16).padStart(8, "0");
  
  // Produce a full 32-char hex string
  let h2 = 0x55555555;
  for (let i = 0; i < hex.length; i++) {
    h2 ^= hex.charCodeAt(i);
    h2 = Math.imul(h2, 0x5bd1e995);
    h2 ^= h2 >>> 15;
  }
  const hex2 = (h2 >>> 0).toString(16).padStart(8, "0");
  
  return (hex + hex2 + "abcde1234567890f").substring(0, 32);
}

// A simple Proof of Work miner that finds a nonce where hash starts with "00"
function mineBlockSync(id: number, prevHash: string, data: string): { nonce: number; hash: string } {
  let nonce = 0;
  let hash = "";
  while (true) {
    hash = calculateBlockHash(id, prevHash, data, nonce);
    if (hash.startsWith("00")) {
      return { nonce, hash };
    }
    nonce++;
    if (nonce > 100000) {
      // Fail-safe
      return { nonce, hash: "00" + hash.substring(2) };
    }
  }
}

export default function BlockchainSimulator() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inputData, setInputData] = useState("");
  const [miningId, setMiningId] = useState<number | null>(null);

  // Initialize with a proper, mined Genesis block
  useEffect(() => {
    const genesisData = "Genesis Block: Verse Network Launched";
    const mined = mineBlockSync(1, "00000000000000000000000000000000", genesisData);
    
    setBlocks([
      {
        id: 1,
        timestamp: new Date().toLocaleTimeString(),
        data: genesisData,
        hash: mined.hash,
        prevHash: "00000000000000000000000000000000",
        nonce: mined.nonce,
        isTampered: false,
      },
    ]);
  }, []);

  // Recalculate block validity dynamically across the chain
  const getChainState = () => {
    let currentPrevHash = "00000000000000000000000000000000";
    const validatedBlocks = blocks.map((block, index) => {
      // Re-calculate hash using current local block state
      const actualHash = calculateBlockHash(block.id, block.prevHash, block.data, block.nonce);
      const isHashCorrect = actualHash === block.hash;
      const isPrevHashMatching = block.prevHash === currentPrevHash;
      const isPoWValid = actualHash.startsWith("00");

      const isValid = isHashCorrect && isPrevHashMatching && isPoWValid;
      currentPrevHash = block.hash; // update for next iteration

      return {
        ...block,
        calculatedHash: actualHash,
        isValid,
        isPrevHashMatching,
        isPoWValid,
      };
    });

    return validatedBlocks;
  };

  const validatedChain = getChainState();

  // Add block to the chain
  const handleMineBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;

    const nextId = blocks.length + 1;
    const lastBlock = validatedChain[validatedChain.length - 1];
    const prevHash = lastBlock ? lastBlock.hash : "00000000000000000000000000000000";

    setMiningId(nextId);

    // Simulate short network delay for mining feel
    setTimeout(() => {
      const { nonce, hash } = mineBlockSync(nextId, prevHash, inputData);
      
      setBlocks((prev) => [
        ...prev,
        {
          id: nextId,
          timestamp: new Date().toLocaleTimeString(),
          data: inputData,
          hash,
          prevHash,
          nonce,
          isTampered: false,
        },
      ]);
      
      setInputData("");
      setMiningId(null);
    }, 800);
  };

  // Modify block data (tamper)
  const handleTamperData = (id: number, newData: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          // Instantly update block data. We DO NOT automatically update hash here,
          // which represents altering history without computing a valid PoW!
          return {
            ...b,
            data: newData,
            isTampered: true,
          };
        }
        return b;
      })
    );
  };

  // Repair a tampered block (re-mine it)
  const handleRepairBlock = (id: number) => {
    setMiningId(id);

    setTimeout(() => {
      setBlocks((prev) => {
        const blockIndex = prev.findIndex((b) => b.id === id);
        if (blockIndex === -1) return prev;

        // Get the real current state of previous hashes up to this block
        const prevBlock = blockIndex > 0 ? prev[blockIndex - 1] : null;
        const correctPrevHash = prevBlock ? prevBlock.hash : "00000000000000000000000000000000";

        const currentBlock = prev[blockIndex];
        const { nonce, hash } = mineBlockSync(id, correctPrevHash, currentBlock.data);

        const updated = [...prev];
        updated[blockIndex] = {
          ...currentBlock,
          prevHash: correctPrevHash,
          nonce,
          hash,
          isTampered: false,
        };

        // Also trickle down previous hashes to next blocks to show they are still broken until re-mined
        for (let i = blockIndex + 1; i < updated.length; i++) {
          updated[i] = {
            ...updated[i],
            prevHash: updated[i - 1].hash, // update pointing prevHash, but do NOT auto-mine subsequent blocks
          };
        }

        return updated;
      });
      setMiningId(null);
    }, 700);
  };

  // Reset chain
  const handleResetChain = () => {
    const genesisData = "Genesis Block: Verse Network Launched";
    const mined = mineBlockSync(1, "00000000000000000000000000000000", genesisData);
    
    setBlocks([
      {
        id: 1,
        timestamp: new Date().toLocaleTimeString(),
        data: genesisData,
        hash: mined.hash,
        prevHash: "00000000000000000000000000000000",
        nonce: mined.nonce,
        isTampered: false,
      },
    ]);
  };

  return (
    <div id="blockchain-simulator" className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            Interactive Blockchain Builder
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Build, tamper, and secure a live <GlossaryTooltip term="Decentralized Ledger">cryptographic ledger</GlossaryTooltip>. See how hacking one block breaks the entire history.
          </p>
        </div>

        <button
          onClick={handleResetChain}
          className="self-start md:self-auto px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Chain
        </button>
      </div>

      {/* WORKBENCH AND TRANS FORMS */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-6">
        <form onSubmit={handleMineBlock} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            disabled={miningId !== null}
            placeholder="Write transaction details (e.g., Bob sends Eve 1.2 BTC)"
            className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors text-white"
          />
          <button
            type="submit"
            disabled={!inputData.trim() || miningId !== null}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {miningId === blocks.length + 1 ? (
              <>
                <Hammer className="w-4 h-4 animate-spin text-indigo-200" /> Mining Block...
              </>
            ) : (
              <>
                <Plus className="w-4.5 h-4.5" /> Mine New Block
              </>
            )}
          </button>
        </form>

        {/* Visualizing the Chain */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {validatedChain.map((block, idx) => {
              const isBlockMinedState = miningId === block.id;
              
              return (
                <React.Fragment key={block.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`w-full lg:w-80 p-5 rounded-2xl border transition-all relative flex-shrink-0 flex flex-col justify-between ${
                      block.isValid
                        ? "bg-slate-950/90 border-slate-800 hover:border-slate-700 shadow-xl"
                        : "bg-red-950/15 border-red-500/40 hover:border-red-500/60 shadow-2xl shadow-red-950/20"
                    }`}
                  >
                    {/* Top glow indicator */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        block.isValid
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                          : "bg-red-500"
                      }`}
                    />

                    {/* Block Info Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold font-mono ${block.isValid ? "text-indigo-400" : "text-red-400"}`}>
                          BLOCK #{block.id}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-900/30 font-medium">
                            <GlossaryTooltip term="Genesis Block">Genesis</GlossaryTooltip>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {block.timestamp}
                      </span>
                    </div>

                    {/* Data / Payload Input */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">
                          Data (Click to Tamper)
                        </span>
                        <input
                          type="text"
                          value={block.data}
                          onChange={(e) => handleTamperData(block.id, e.target.value)}
                          placeholder="Empty Block Data"
                          className={`w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900/80 focus:outline-none transition-colors border font-medium ${
                            block.isTampered
                              ? "text-amber-300 border-amber-500/40 bg-amber-950/10"
                              : block.isValid
                              ? "text-slate-200 border-slate-800/80 focus:border-indigo-500/50"
                              : "text-red-300 border-red-500/20 bg-red-950/10"
                          }`}
                        />
                      </div>

                      {/* Cryptography Hash Details */}
                      <div className="space-y-2 text-[11px] bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/30 font-mono">
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-0.5">
                            <span>Previous <GlossaryTooltip term="Hash" /></span>
                            {!block.isPrevHashMatching && idx > 0 && (
                              <span className="text-red-400 flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Mismatch
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 truncate bg-slate-950/80 px-1.5 py-1 rounded border border-slate-900/60">
                            {block.prevHash}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase mb-0.5">
                            <span>Current <GlossaryTooltip term="Hash" /></span>
                            {!block.isValid && !block.isPoWValid && (
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <Unlock className="w-3 h-3" /> No PoW
                              </span>
                            )}
                          </div>
                          <p className={`truncate px-1.5 py-1 rounded border ${
                            block.isValid 
                              ? "text-emerald-400 bg-slate-950/80 border-slate-900/60" 
                              : "text-red-400 bg-red-950/20 border-red-900/30"
                          }`}>
                            {block.calculatedHash}
                          </p>
                        </div>

                        {/* Nonce Proof Display */}
                        <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500">
                          <span><GlossaryTooltip term="Proof of Work">Mining Nonce (PoW)</GlossaryTooltip>:</span>
                          <span className="text-indigo-300 font-bold bg-indigo-950/40 border border-indigo-900/40 px-1.5 py-0.5 rounded-md">
                            {block.nonce}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions / Validation Msg */}
                    <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                      {block.isValid ? (
                        <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-900/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Block Secured
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRepairBlock(block.id)}
                          disabled={miningId !== null}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-md shadow-red-900/20"
                        >
                          {isBlockMinedState ? (
                            <>
                              <Hammer className="w-3 h-3 animate-spin" /> Mining...
                            </>
                          ) : (
                            <>
                              <Hammer className="w-3 h-3" /> Re-mine Block
                            </>
                          )}
                        </button>
                      )}

                      {block.isTampered && (
                        <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-950/30 border border-amber-900/20 px-2 py-1 rounded-lg">
                          Tampered
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Cryptographic Link Arrows between Blocks */}
                  {idx < validatedChain.length - 1 && (
                    <div className="flex flex-col items-center justify-center py-2 lg:py-0 select-none">
                      <div className={`flex items-center justify-center gap-1 text-xs font-bold font-mono transition-colors ${
                        validatedChain[idx + 1].isPrevHashMatching 
                          ? "text-indigo-500" 
                          : "text-red-500"
                      }`}>
                        {validatedChain[idx + 1].isPrevHashMatching ? (
                          <>
                            <span className="hidden lg:inline">──</span>
                            <div className="p-1.5 bg-indigo-950/50 border border-indigo-900/40 rounded-full">
                              <Lock className="w-3.5 h-3.5 text-indigo-400" />
                            </div>
                            <span className="hidden lg:inline">──▶</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden lg:inline">──</span>
                            <div className="p-1.5 bg-red-950/50 border border-red-900/40 rounded-full animate-bounce">
                              <Unlock className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <span className="hidden lg:inline">──▶</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
