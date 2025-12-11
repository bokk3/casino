"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetSelectorProps {
  currentBet: number;
  minBet?: number;
  maxBet?: number;
  balance: number;
  onBetChange: (bet: number) => void;
  disabled?: boolean;
}

const BET_INCREMENTS = [10, 25, 50, 100, 250, 500];

export function BetSelector({
  currentBet,
  minBet = 10,
  maxBet = 1000,
  balance,
  onBetChange,
  disabled
}: BetSelectorProps) {

  const increaseBet = () => {
    // Find next higher increment
    const next = BET_INCREMENTS.find(b => b > currentBet) || currentBet + 50;
    if (next <= maxBet) onBetChange(next);
  };

  const decreaseBet = () => {
    // Find next lower increment
    const reversed = [...BET_INCREMENTS].reverse();
    const prev = reversed.find(b => b < currentBet) || currentBet - 50;
    if (prev >= minBet) onBetChange(prev);
  };

  const setMaxBet = () => {
    const maxAffordable = Math.min(maxBet, balance);
    // Find highest increment that is affordable
    const bestBet = [...BET_INCREMENTS].reverse().find(b => b <= maxAffordable) || minBet;
    onBetChange(bestBet);
  };

  return (
    <div className="flex flex-col items-center gap-2 bg-ink-black-900/80 p-4 rounded-xl border border-ink-black-700 w-full max-w-md">
      <div className="text-ink-black-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
        <Coins className="w-4 h-4 text-tropical-teal-500" />
        Bet Amount
      </div>
      
      <div className="flex items-center gap-4 w-full justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseBet}
          disabled={disabled || currentBet <= minBet}
          className="h-10 w-10 border-ink-black-600 bg-ink-black-800 hover:bg-ink-black-700"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="flex flex-col items-center min-w-[100px]">
          <span className={cn(
            "text-2xl font-bold font-mono transition-colors",
            currentBet > balance ? "text-red-400" : "text-cornsilk-100"
          )}>
            {formatCurrency(currentBet)}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={increaseBet}
          disabled={disabled || currentBet >= maxBet}
          className="h-10 w-10 border-ink-black-600 bg-ink-black-800 hover:bg-ink-black-700"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 w-full justify-center mt-2">
        {BET_INCREMENTS.slice(0, 4).map((amount) => (
           <Button
             key={amount}
             variant="ghost"
             size="sm"
             onClick={() => onBetChange(amount)}
             disabled={disabled}
             className={cn(
               "text-xs px-2 h-7",
               currentBet === amount ? "bg-tropical-teal-500/20 text-tropical-teal-400" : "text-ink-black-500 hover:text-ink-black-300"
             )}
           >
             {amount}
           </Button>
        ))}
      </div>
    </div>
  );
}
