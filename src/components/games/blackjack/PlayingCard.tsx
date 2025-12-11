"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/lib/games/blackjack/cards";
import { motion } from "framer-motion";

interface PlayingCardProps {
  card: Card;
  index: number;
  className?: string;
  isDealer?: boolean;
}

export function PlayingCard({ card, index, className, isDealer }: PlayingCardProps) {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case "hearts": return "♥";
      case "diamonds": return "♦";
      case "clubs": return "♣";
      case "spades": return "♠";
      default: return "";
    }
  };

  return (
    <motion.div
      initial={{ x: -100, y: -100, opacity: 0, rotate: -20 }}
      animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, type: "spring" }}
      className={cn(
        "bg-white rounded-lg shadow-xl w-24 h-36 flex flex-col justify-between p-2 select-none relative transform hover:-translate-y-2 transition-transform",
        className
      )}
      style={{
        marginRight: "-1.5rem" // Negative margin for overlap effect
      }}
    >
      {card.isHidden ? (
        <div className="w-full h-full bg-blue-800 rounded flex items-center justify-center border-2 border-white/20 bg-pattern-stripes">
           <div className="text-blue-200 text-4xl opacity-20">🎲</div>
        </div>
      ) : (
        <>
          <div className={cn("text-lg font-bold font-mono", isRed ? "text-red-600" : "text-slate-900")}>
            {card.rank}
            <div className="text-sm">{getSuitIcon(card.suit)}</div>
          </div>
          
          <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-80", isRed ? "text-red-600" : "text-slate-900")}>
             {getSuitIcon(card.suit)}
          </div>

          <div className={cn("text-lg font-bold font-mono rotate-180 flex flex-col items-center", isRed ? "text-red-600" : "text-slate-900")}>
            {card.rank}
            <div className="text-sm">{getSuitIcon(card.suit)}</div>
          </div>
        </>
      )}
    </motion.div>
  );
}
