"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { SlotSymbol, SYMBOLS } from "@/lib/games/slots/logic";
import { cn } from "@/lib/utils";

interface ReelProps {
  isSpinning: boolean;
  finalSymbol?: SlotSymbol | null;
  delay?: number;
  onSpinComplete?: () => void;
  className?: string;
}

// Duplicate symbols for infinite scroll effect
const REEL_SYMBOLS = [...SYMBOLS, ...SYMBOLS, ...SYMBOLS];

export function Reel({ isSpinning, finalSymbol, delay = 0, onSpinComplete, className }: ReelProps) {
  const controls = useAnimation();
  const innerRef = useRef<HTMLDivElement>(null);
  
  const symbolHeight = 120; // Height of each symbol container
  const totalHeight = REEL_SYMBOLS.length * symbolHeight;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const spin = async () => {
      if (isSpinning) {
        // Continuous spinning animation
        await controls.start({
          y: [0, -totalHeight / 3],
          transition: {
            duration: 0.5,
            ease: "linear",
            repeat: Infinity,
          },
        });
      } else if (finalSymbol) {
        // Stop on the specific symbol
        // We need to calculate the position of the final symbol
        // Find the index of the symbol in our REEL_SYMBOLS list (use the middle set)
        const symbolIndex = REEL_SYMBOLS.findIndex(
          (s, i) => s.id === finalSymbol.id && i >= SYMBOLS.length && i < SYMBOLS.length * 2
        );
        
        // Target position to center this symbol
        // We want the symbol to be in the vertical center of the window (which is 1 symbolHeight tall usually)
        // But our container is moved up.
        // Let's assume the view port shows 1 symbol.
        const targetY = -(symbolIndex * symbolHeight);

        // Animate to stop
        // We first spin a bit more to simulate deceleration
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        
        await controls.start({
          y: targetY,
          transition: {
            duration: 0.8,
            ease: [0.15, 0, 0.15, 1], // Custom cubic bezier for "snap" effect
            type: "spring",
            stiffness: 100,
            damping: 15
          },
        });

        if (onSpinComplete) onSpinComplete();
      }
    };

    spin();

    return () => clearTimeout(timeout);
  }, [isSpinning, finalSymbol, controls, delay, onSpinComplete, totalHeight]);

  return (
    <div className={cn("relative overflow-hidden w-full h-[140px] bg-ink-black-900 border-x-2 border-ink-black-800 shadow-inner", className)}>
      {/* Overlay shadows for 3D effect */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

      {/* Reel Strip */}
      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        className="flex flex-col items-center"
      >
        {REEL_SYMBOLS.map((symbol, i) => (
          <div
            key={`${symbol.id}-${i}`}
            className="flex items-center justify-center w-full h-[120px] text-6xl transform"
          >
            {symbol.icon}
          </div>
        ))}
      </motion.div>
      
      {/* Payline Indicator (Center) */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cerulean-500/50 to-transparent transform -translate-y-1/2 z-0 pointer-events-none opacity-50" />
    </div>
  );
}
