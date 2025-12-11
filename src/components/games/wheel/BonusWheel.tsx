"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { WheelSegment } from "./WheelSegment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BonusWheelProps {
  onSpinComplete: () => void;
  isSpinning: boolean;
  prizeIndex: number | null; // The index of the segment that will win (determined by server)
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
}

export function BonusWheel({
  onSpinComplete,
  isSpinning,
  prizeIndex,
  segments,
}: BonusWheelProps) {
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const radius = 150;
  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  useEffect(() => {
    if (isSpinning && prizeIndex !== null) {
      spinWheel(prizeIndex);
    }
  }, [isSpinning, prizeIndex]);

  const spinWheel = async (targetIndex: number) => {
    // Calculate rotation needed to land on the target index
    // The pointer is at 270 degrees (top), so we need to align the target segment there.
    // Since we rotate clockwise, we need to subtract the target angle.
    
    // Random extra rotations for effect (5 to 10 full spins)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 5));
    
    // The center of the target segment needs to be at 270 degrees (top)
    // Segment 0 starts at 0 degrees. Center of segment 0 is at segmentAngle/2.
    // Target segment center is at (targetIndex * segmentAngle) + (segmentAngle/2)
    const targetSegmentCenter = (targetIndex * segmentAngle) + (segmentAngle / 2);
    
    // We want targetSegmentCenter to end up at 270 degrees.
    // Current rotation + delta = Final Rotation
    // Final Rotation % 360 = (270 - targetSegmentCenter + 360) % 360
    
    const targetRotation = 270 - targetSegmentCenter;
    const finalRotation = currentRotation + extraSpins + (targetRotation - (currentRotation % 360)) + 360; // Ensure positive forward movement

    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 5,
        ease: [0.15, 0, 0.15, 1], // Custom cubic bezier for realistic spin deceleration
      },
    });

    setCurrentRotation(finalRotation);
    onSpinComplete();
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Pointer/Indicator */}
      <div className="absolute top-0 z-20 transform -translate-y-1/2">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-cornsilk-50 filter drop-shadow-lg" />
      </div>

      {/* Wheel Container */}
      <div className="relative w-[320px] h-[320px] rounded-full border-8 border-ink-black-800 shadow-2xl bg-ink-black-900 overflow-hidden">
        <motion.div
          className="w-full h-full"
          animate={controls}
          style={{ rotate: rotation }}
        >
          <svg
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className="w-full h-full transform -rotate-90" // Start at 12 o'clock
          >
            <g transform={`translate(${radius}, ${radius})`}>
              {segments.map((segment, index) => (
                <WheelSegment
                  key={index}
                  index={index}
                  totalSegments={totalSegments}
                  color={segment.color}
                  label={segment.label}
                  value={segment.value}
                  radius={radius}
                />
              ))}
            </g>
          </svg>
        </motion.div>
        
        {/* Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-ink-black-700 to-ink-black-900 border-4 border-ink-black-600 shadow-inner z-10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-ink-black-800 border-2 border-ink-black-950 flex items-center justify-center">
             <span className="text-xl">🎰</span>
          </div>
        </div>
      </div>

      {/* Shadow/Base */}
      <div className="w-[280px] h-4 bg-black/40 rounded-[100%] blur-md mt-[-10px] -z-10" />
    </div>
  );
}
