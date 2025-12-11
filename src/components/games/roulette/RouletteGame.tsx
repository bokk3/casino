"use client";

import { useState } from "react";
import { RouletteWheel } from "./RouletteWheel";
import { BettingTable } from "./BettingTable";
import { Button } from "@/components/ui/button";
import { useBalance } from "@/hooks/useBalance";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

export function RouletteGame() {
    const { balance, refreshBalance } = useBalance();
    const [bets, setBets] = useState<Record<string, number>>({});
    const [chipValue, setChipValue] = useState(10);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winningNumber, setWinningNumber] = useState<number | null>(null);
    const [lastWin, setLastWin] = useState(0);

    const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);

    const handlePlaceBet = (betId: string) => {
        if (isSpinning) return;
        if (totalBet + chipValue > balance) {
            toast.error("Insufficient balance");
            return;
        }
        
        setBets(prev => ({
            ...prev,
            [betId]: (prev[betId] || 0) + chipValue
        }));
    };

    const clearBets = () => {
        if (isSpinning) return;
        setBets({});
    };

    const handleSpin = async () => {
        if (totalBet === 0) return;
        setIsSpinning(true);
        setWinningNumber(null);
        setLastWin(0);

        try {
            const res = await fetch("/api/games/roulette/spin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bets })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setWinningNumber(data.winningNumber);
            setLastWin(data.winAmount);
            
            // Wait for visual spin complete in child component to refresh balance
            
        } catch (error: any) {
            toast.error(error.message);
            setIsSpinning(false);
        }
    };
    
    const onSpinComplete = () => {
        setIsSpinning(false);
        refreshBalance();
        
        if (lastWin > 0) {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
            toast.success(`You won ${formatCurrency(lastWin)}!`);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
            {/* Upper Area: Wheel & Info */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                 <RouletteWheel 
                    winningNumber={winningNumber} 
                    isSpinning={isSpinning}
                    onSpinComplete={onSpinComplete}
                 />
                 
                 <div className="flex flex-col gap-4 min-w-[200px] text-center">
                     <div className="bg-ink-black-900/50 p-4 rounded-xl border border-ink-black-800">
                         <p className="text-ink-black-400 text-sm uppercase">Total Bet</p>
                         <p className="text-2xl font-bold text-white">{formatCurrency(totalBet)}</p>
                     </div>
                     
                     <div className="grid grid-cols-3 gap-2">
                         {[10, 50, 100, 500, 1000].map(val => (
                             <button
                                key={val}
                                onClick={() => setChipValue(val)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-lg transition-transform hover:scale-110 ${val === chipValue ? 'ring-2 ring-white scale-110' : ''} ${val === 10 ? 'bg-red-500 border-dashed border-white/50' : val === 50 ? 'bg-blue-500 border-white/50' : val === 100 ? 'bg-black border-white/50' : 'bg-purple-500 border-white/50'}`}
                             >
                                 {val}
                             </button>
                         ))}
                     </div>
                     <p className="text-xs text-ink-black-400 mt-[-10px]">Select Chip Value</p>
                 </div>
            </div>

            {/* Betting Table */}
            <BettingTable 
                bets={bets} 
                onPlaceBet={handlePlaceBet}
                disabled={isSpinning}
                className="w-full"
            />

            {/* Controls */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={clearBets}
                    disabled={isSpinning || totalBet === 0}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                >
                    Clear Bets
                </Button>
                
                <Button
                    size="lg"
                    onClick={handleSpin}
                    disabled={isSpinning || totalBet === 0}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-12 h-14 text-xl rounded-full shadow-lg shadow-green-900/50"
                >
                    {isSpinning ? <Loader2 className="animate-spin" /> : "SPIN"}
                </Button>
            </div>
        </div>
    );
}
