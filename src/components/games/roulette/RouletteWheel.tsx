"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { ROULETTE_NUMBERS } from "@/lib/games/roulette/logic";
import { cn } from "@/lib/utils";

interface RouletteWheelProps {
    winningNumber: number | null;
    isSpinning: boolean;
    onSpinComplete: () => void;
}

export function RouletteWheel({ winningNumber, isSpinning, onSpinComplete }: RouletteWheelProps) {
    const controls = useAnimation();
    const ballControls = useAnimation();

    useEffect(() => {
        const spin = async () => {
             if (isSpinning && winningNumber !== null) {
                // Determine rotation
                // Each number occupies 360/37 degrees (~9.73 deg)
                // The numbers are in specific order on wheel, not 0-36 sequential
                // ROULETTE_NUMBERS array matches the sequence on a real wheel (0, 32, 15...)
                
                const index = ROULETTE_NUMBERS.findIndex(n => n.value === winningNumber);
                const degreesPerSegment = 360 / 37;
                
                // We want to land index at Top (270deg or 0deg depending on svg setup)
                // Let's say top is 0.
                // If we rotate clockwise, index 0 stays at 0. Index 1 ends up at 350.
                
                // Target angle: -index * degreesPerSegment
                const targetRotation = -(index * degreesPerSegment); 
                
                // Add lots of full rotations
                const extraSpins = 360 * 5; 
                const finalRotation = targetRotation - extraSpins; // Negative for clockwise spin of wheel relative to ball?
                
                // Spin Wheel
                // Actually usually wheel spins one way, ball other. 
                // Simple version: Spin wheel counter-clockwise, ball is static or spins clockwise.
                
                await controls.start({
                    rotate: [0, finalRotation],
                    transition: {
                        duration: 8,
                        ease: [0.15, 0, 0.1, 1] // Decelerate
                    }
                });
                
                onSpinComplete();
             }
        };
        spin();
    }, [isSpinning, winningNumber, controls, onSpinComplete]);

    return (
        <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
            {/* Outer Rim */}
            <div className="absolute inset-0 rounded-full border-[20px] border-[#3f2010] shadow-2xl z-10" />
            <div className="absolute inset-3 rounded-full border-[4px] border-[#fbbf24] z-10 pointer-events-none" />

            {/* Spinning Wheel */}
            <motion.div
                className="w-full h-full rounded-full overflow-hidden relative bg-[#1a0f0a]"
                animate={controls}
            >
                {/* Segments */}
                {ROULETTE_NUMBERS.map((n, i) => {
                     const degrees = 360 / 37;
                     const rotation = i * degrees;
                     return (
                         <div
                            key={n.value}
                            className="absolute top-0 left-1/2 w-[2px] h-[50%] origin-bottom transform -translate-x-1/2"
                            style={{ 
                                transform: `translateX(-50%) rotate(${rotation}deg)` 
                            }}
                         >
                            {/* Color Slice */}
                            <div 
                                className={cn(
                                    "absolute top-0 -left-[24px] w-[48px] h-[160px] flex flex-col items-center justify-start pt-4 clip-trapezoid origin-top",
                                    n.color === "red" ? "bg-red-600" : n.color === "black" ? "bg-zinc-900" : "bg-green-600"
                                )}
                                style={{ clipPath: "polygon(50% 100%, 0 0, 100% 0)" }}
                            >
                                <span className="transform rotate-180 text-white font-bold text-lg sm:text-xl font-mono dropshadow-md">
                                    {n.value}
                                </span>
                            </div>
                         </div>
                     );
                })}
                
                {/* Inner Hub */}
                 <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#3f2010] to-[#1a0f0a] rounded-full border-8 border-[#fbbf24] z-20 flex items-center justify-center shadow-2xl">
                     <div className="w-8 h-8 bg-gradient-to-br from-[#fbbf24] to-[#78350f] rounded-full shadow-inner" />
                 </div>
            </motion.div>
            
            {/* Pointer / Ball (Simplified visual) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-white drop-shadow-xl z-30" />
        </div>
    );
}
