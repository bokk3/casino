"use client";

import { useState } from "react";
import { PlayingCard } from "./PlayingCard";
import { Button } from "@/components/ui/button";
import { useBalance } from "@/hooks/useBalance";
import { Card as CardType, calculateHandValue, GameStatus } from "@/lib/games/blackjack/cards";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";
import { formatCurrency, cn } from "@/lib/utils";

// Interface for localized hand state
interface HandDisplay {
    cards: CardType[];
    bet: number;
    status: string;
}

export function BlackjackTable() {
  const { balance, refreshBalance } = useBalance();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Multi-hand state
  // 3 Spots: 0 (Left), 1 (Center), 2 (Right)
  const [bets, setBets] = useState<number[]>([0, 0, 0]); // 0 = no bet
  const [selectedChip, setSelectedChip] = useState(10);
  
  const [playerHands, setPlayerHands] = useState<HandDisplay[] | null>(null);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState<number>(-1);
  
  const [lastWin, setLastWin] = useState<number>(0);
  const [loadingAction, setLoadingAction] = useState<"deal" | "hit" | "stand" | null>(null);

  const totalBet = bets.reduce((a, b) => a + b, 0);

  const handlePlaceBet = (index: number) => {
      if (isPlaying) return;
      if (totalBet + selectedChip > balance) {
          toast.error("Insufficient balance");
          return;
      }
      const newBets = [...bets];
      newBets[index] += selectedChip;
      setBets(newBets);
  };

  const clearBets = () => {
      if (isPlaying) return;
      setBets([0, 0, 0]);
  };

  const startNewGame = async () => {
    if (totalBet === 0) {
        toast.error("Place at least one bet");
        return;
    }
    
    setLoadingAction("deal");
    setPlayerHands(null);
    setDealerHand([]);
    setLastWin(0);

    try {
        const res = await fetch("/api/games/blackjack/deal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bets }), // Send array [10, 0, 20]
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setPlayerHands(data.playerHands);
        setDealerHand(data.dealerHand);
        setActiveHandIndex(data.activeHandIndex);
        
        setIsPlaying(true);
        refreshBalance();

        if (data.activeHandIndex === -1) {
            // All blackjacks? Auto-resolve
            setTimeout(() => handleAction("resolve"), 1000);
        }
        
    } catch (error: any) {
        toast.error(error.message || "Failed to start game");
    } finally {
        setLoadingAction(null);
    }
  };

  const handleAction = async (action: "hit" | "stand" | "resolve") => {
    if (loadingAction) return;
    setLoadingAction(action === "resolve" ? "stand" : action); // Reuse loading state

    try {
        // If resolving (dealer turn trigger), we send "stand" effectivey or special action?
        // API handles "stand" to move next. If index is -1, API will play dealer.
        // But our API expects "hit" or "stand". 
        // If we are at index -1 client side, we should call 'stand' (or dummy) to trigger dealer?
        // Wait, my API implementation checks activeHandIndex from DB state.
        // If I send "stand", and index is -1, it might error "Invalid action" because I didn't handle -1 explicitly in logic branch?
        // Let's check API code... 
        // API: if (action === "hit") ... else if (action === "stand") ...
        // And `if (activeHandIndex === -1)` logic is AFTER the action processing?
        // Ah, I need to make sure I can trigger the dealer turn.
        // If I send "stand", it findsNextActiveHand. If returns -1, it proceeds to dealer.
        // So sending "stand" works!
        
        const res = await fetch("/api/games/blackjack/action", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ action: action === "resolve" ? "stand" : action })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setPlayerHands(data.playerHands);
        setDealerHand(data.dealerHand);
        setActiveHandIndex(data.activeHandIndex);

        // Auto-follow if next index is valid? No, UI updates and user plays next hand.
        // Unless next hand is blackjack? My API findsNextActiveHand ONLY returns "playing" hands.
        // So if next has blackjack, it skips it. Good.

        if (data.gameFinished) {
            setIsPlaying(false);
            setLastWin(data.totalWin);
            refreshBalance();

            if (data.totalWin > 0) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else if (data.activeHandIndex === -1) {
             // Dealer turn ready (all hands done)
             setTimeout(() => handleAction("resolve"), 500); 
        }

    } catch (error: any) {
        toast.error(error.message || "Action failed");
    } finally {
        setLoadingAction(null);
    }
  };

  const getHandResult = (hand: HandDisplay) => {
      if (hand.status === "player_bust") return "BUST";
      if (hand.status === "dealer_bust") return "WIN";
      if (hand.status === "player_win") return "WIN";
      if (hand.status === "dealer_win") return "LOSE";
      if (hand.status === "push") return "PUSH";
      if (hand.status === "blackjack") return "BJ";
      return "";
  };

  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-6xl mx-auto">
        {/* Table Area */}
        <div className="relative w-full aspect-[16/9] min-h-[500px] bg-[#1a3c34] rounded-[100px] border-[12px] border-[#2d1b12] shadow-2xl flex flex-col items-center py-16 px-8 overflow-hidden">
            {/* Felt Texture & Layout */}
            <div className="absolute inset-0 opacity-10 bg-[url('/felt-pattern.png')] pointer-events-none" />
            
            {/* Dealer */}
            <div className="flex flex-col items-center gap-2 z-10 w-full min-h-[140px] mb-8">
                {dealerHand.length > 0 && (
                    <div className="flex items-center justify-center transform scale-75 md:scale-100">
                         {dealerHand.map((card, i) => (
                             <PlayingCard key={`dealer-${i}`} card={card} index={i} isDealer />
                         ))}
                    </div>
                )}
                {dealerHand.length > 0 && (
                    <div className="bg-black/40 px-3 py-1 rounded-full text-white font-mono text-sm border border-white/10">
                        Dealer: {dealerHand.some(c => c.isHidden) ? "?" : dealerValue}
                    </div>
                )}
            </div>

            {/* Warning / Message Area */}
            {lastWin > 0 && !isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-black/80 backdrop-blur-md p-6 rounded-2xl border-2 border-tropical-teal-400 text-center animate-in zoom-in fade-in">
                    <h2 className="text-2xl font-bold text-tropical-teal-400 mb-2">ROUND OVER</h2>
                    <p className="text-white text-xl">Total Win: {formatCurrency(lastWin)}</p>
                </div>
            )}

            {/* Player Hands/Spots - Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-8 w-full max-w-4xl z-10 mt-auto">
                 {[0, 1, 2].map((spotIndex) => { // Left, Center, Right
                     // Map to hands IF game is playing
                     // API returns array of only active hands? NO, API updated to return hands matching bets array?
                     // My API `playerHands` implementation in dealt route: `bets.map(...).filter(h => h!==null)`
                     // Oh, `filter` removes nulls! That breaks the index mapping to spots!
                     // I need to change API to KEEP nulls or use a smarter mapping.
                     // The API returns `playerHands` as an array of objects.
                     // If I bet on spot 0 and 2, keys in array will be 0 and 1.
                     // It's hard to map back to spots 0 and 2.
                     
                     // FIX: I should have made API return `(Hand | null)[]`. 
                     // Let's assume for now I iterate through what I have.
                     // Wait, if I change frontend code I can just assume visual spots 0,1,2 map to the bets logic.
                     // But if the server threw away the 'empty' hands, I don't know which is which easily.
                     
                     // Let's modify the frontend to just display the hands that exist centered?
                     // No, "Multi-hand" usually implies fixed spots.
                     // I will assume for this step that I'll fix the API to return nulls for empty seats or I map them by bet amount?
                     // Actually, simplified: I wont fix API right now (task constraint). 
                     // I will just map them sequentially. If you bet on 2 spots, you get 2 hands side-by-side. 
                     // It's less "spatial" but functional.
                     
                     // ACTUALLY: Let's do it properly. The user wants to play multiple hands.
                     // If I map sequentially, it's fine. 
                     
                     const handIndex = playerHands ? playerHands.length === bets.filter(b => b > 0).length ? 
                        // We have to figure out which hand belongs to this spot.
                        // We can count how many active bets are BEFORE this spot.
                         bets.slice(0, spotIndex).filter(b => b > 0).length : -1
                        : -1;
                     
                     const hasHand = isPlaying && bets[spotIndex] > 0 && playerHands && playerHands[handIndex];
                     const handData = hasHand ? playerHands![handIndex] : null;
                     
                     const isActive = isPlaying && activeHandIndex === handIndex;

                     return (
                         <div 
                            key={spotIndex} 
                            className={cn(
                                "flex flex-col items-center justify-end min-h-[200px] p-2 rounded-xl transition-all relative border-2",
                                isActive ? "bg-white/5 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]" : "border-transparent hover:bg-white/5"
                            )}
                            onClick={() => !isPlaying && handlePlaceBet(spotIndex)}
                         >
                             {/* Bet Circle / Chip */}
                             {!isPlaying && (
                                 <div className={cn(
                                     "w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xs cursor-pointer transition-transform hover:scale-110 mb-4",
                                     bets[spotIndex] > 0 ? "bg-yellow-500 border-yellow-300 text-black shadow-lg" : "border-white/20 text-white/30 border-dashed"
                                 )}>
                                     {bets[spotIndex] > 0 ? bets[spotIndex] : "BET"}
                                 </div>
                             )}

                             {/* Cards */}
                             {hasHand && handData && (
                                 <div className="relative">
                                     <div className="flex items-center justify-center -space-x-12 mb-4">
                                         {handData.cards.map((c, i) => (
                                             <PlayingCard key={`hand-${spotIndex}-${i}`} card={c} index={i} className="transform scale-75 origin-bottom" />
                                         ))}
                                     </div>
                                     
                                     {/* Hand Value / Result */}
                                     <div className="text-center">
                                         <span className={cn(
                                             "px-3 py-1 rounded-full text-xs font-bold font-mono border",
                                             handData.status.includes("win") ? "bg-green-500 border-green-400 text-black" :
                                             handData.status.includes("bust") ? "bg-red-500 border-red-400 text-white" :
                                             "bg-black/60 border-white/20 text-white"
                                         )}>
                                             {calculateHandValue(handData.cards)}
                                             {getHandResult(handData) && ` - ${getHandResult(handData)}`}
                                         </span>
                                     </div>
                                 </div>
                             )}

                             {/* Active Indicator */}
                             {isActive && (
                                 <div className="absolute -bottom-4 animate-bounce text-yellow-400">
                                     ⬆
                                 </div>
                             )}
                         </div>
                     );
                 })}
            </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
            {!isPlaying ? (
                <div className="flex flex-col items-center gap-4 w-full animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="flex bg-ink-black-900 rounded-full p-1 border border-ink-black-800">
                         {[10, 50, 100, 500].map(val => (
                             <button
                                key={val}
                                onClick={() => setSelectedChip(val)}
                                className={cn(
                                    "px-6 py-2 rounded-full font-bold transition-all",
                                    selectedChip === val ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-lg" : "text-ink-black-400 hover:text-white"
                                )}
                             >
                                 {val}
                             </button>
                         ))}
                    </div>

                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={clearBets} className="text-red-400">Clear</Button>
                        <Button 
                            size="lg" 
                            className="min-w-[200px] h-14 text-xl font-bold bg-green-600 hover:bg-green-500"
                            onClick={startNewGame}
                            disabled={loadingAction === "deal" || totalBet === 0}
                        >
                            {loadingAction === "deal" ? <Loader2 className="animate-spin" /> : `DEAL ($${totalBet})`}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <Button
                        size="lg"
                        className="h-16 w-32 text-xl font-bold bg-slate-200 text-slate-900 hover:bg-white"
                        onClick={() => handleAction("hit")}
                        disabled={!!loadingAction}
                    >
                        HIT
                    </Button>
                    <Button
                        size="lg"
                        className="h-16 w-32 text-xl font-bold bg-amber-500 text-amber-950 hover:bg-amber-400"
                        onClick={() => handleAction("stand")}
                        disabled={!!loadingAction}
                    >
                        STAND
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
}
