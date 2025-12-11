"use client";

import { useState, useCallback } from "react";
import { Reel } from "./Reel";
import { BetSelector } from "./BetSelector";
import { Button } from "@/components/ui/button";
import { SlotSymbol, SYMBOLS } from "@/lib/games/slots/logic";
import { useBalance } from "@/hooks/useBalance";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function SlotMachine() {
  const { balance, updateBalanceOptimistically, refreshBalance } = useBalance();
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<(SlotSymbol | null)[]>([null, null, null]); // Start with no symbols locked
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track finished reels to know when to unlock state
  const [finishedReels, setFinishedReels] = useState(0);

  const handleSpinFn = async () => {
    if (isSpinning || bet > balance) return;
    
    setIsSpinning(true);
    setLastWin(null);
    setError(null);
    setFinishedReels(0);
    setReels([null, null, null]); // Reset reels to spinning state

    try {
      // API Call
      const res = await fetch("/api/games/slots/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ betAmount: bet }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Spin failed");
      }

      // Optimistic Balance Update (Deduct bet)
      // data.balance has the correct new balance, but we might want to delay showing it until spin ends?
      // Actually usually better to show deduction immediately, then win addition.
      // But for now, let's trust the server response for final balance after animation.
      
      // Store the result symbols
      // We need to map the symbol IDs back to full objects
      // data.reels comes back as objects from server anyway in our implementation
      const resultReels = data.reels as SlotSymbol[];
      
      // We set the targets but keep spinning true. 
      // The Reel components will see 'finalSymbol' prop and start stopping sequence.
      // We'll reveal them one by one.
      
      // Trigger stop sequence
      setReels(resultReels);
      setLastWin(data.winAmount); // Store pending win
      setIsSpinning(false); // <--- Triggers the stop animation in Reels

      // Note: We don't update balance here yet, we wait for visual completion
      
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setIsSpinning(false);
    }
  };

  const handleReelComplete = useCallback(() => {
    setFinishedReels(prev => {
      const newVal = prev + 1;
      if (newVal === 3) {
        // All reels stopped
        setIsSpinning(false);
        if (lastWin && lastWin > 0) {
          confetti({
             particleCount: 150,
             spread: 70,
             origin: { y: 0.6 }
          });
          // Update balance now that user sees the win
          // We can use refreshBalance to sync with server
          refreshBalance();
        } else {
            // Just sync to ensure accuracy
            refreshBalance();
        }
      }
      return newVal;
    });
  }, [lastWin, refreshBalance]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
      {/* Slot Machine Display */}
      <div className="relative p-8 bg-ink-black-950 rounded-3xl border-4 border-ink-black-800 shadow-2xl w-full">
        {/* Decorative Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink-black-900 px-6 py-2 rounded-full border border-ink-black-700 shadow-xl z-20">
          <span className="text-xl font-bold bg-gradient-to-r from-tropical-teal-400 to-cerulean-400 bg-clip-text text-transparent tracking-widest">
            NEON SLOTS
          </span>
        </div>

        {/* Reels Container */}
        <div className="flex gap-2 sm:gap-4 justify-center bg-black/50 p-4 rounded-xl border border-ink-black-800 inset-shadow-lg">
           <Reel 
             isSpinning={isSpinning} 
             finalSymbol={reels[0]} 
             delay={0}
             onSpinComplete={handleReelComplete}
             className="rounded-lg"
           />
           <Reel 
             isSpinning={isSpinning} 
             finalSymbol={reels[1]} 
             delay={0.2} // 200ms delay
             onSpinComplete={handleReelComplete}
             className="rounded-lg"
           />
           <Reel 
             isSpinning={isSpinning} 
             finalSymbol={reels[2]} 
             delay={0.4} // 400ms delay
             onSpinComplete={handleReelComplete}
             className="rounded-lg"
           />
        </div>

        {/* Win Display Overlay (Now a badge below) */}
        {lastWin !== null && !isSpinning && lastWin > 0 && (
           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
             <div className="bg-gradient-to-r from-tropical-teal-500 to-cerulean-500 px-8 py-3 rounded-full shadow-lg shadow-tropical-teal-500/20 border-2 border-white animate-in zoom-in duration-300 flex items-center gap-2 whitespace-nowrap">
                <span className="text-ink-black-950 font-bold uppercase tracking-wider text-sm">Win</span>
                <span className="text-2xl font-black text-white text-shadow-sm">
                  {formatCurrency(lastWin)}
                </span>
             </div>
           </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-6 w-full">
        <BetSelector 
          currentBet={bet} 
          balance={balance} 
          onBetChange={setBet} 
          disabled={isSpinning}
        />

        {error && (
            <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>
        )}

        <Button
          size="lg"
          onClick={handleSpinFn}
          disabled={isSpinning || balance < bet}
          className="w-full max-w-xs h-20 text-2xl font-black uppercase tracking-widest rounded-full shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)] hover:shadow-[0_0_60px_-10px_rgba(45,212,191,0.8)] transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-b from-tropical-teal-400 to-cerulean-600 border-t border-white/20"
        >
          {isSpinning ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            "SPIN"
          )}
        </Button>
      </div>
    </div>
  );
}
