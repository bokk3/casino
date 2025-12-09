"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BalanceDisplayProps {
  balance: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function BalanceDisplay({
  balance,
  size = "md",
  showLabel = true,
  className = "",
}: BalanceDisplayProps) {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (balance !== displayBalance) {
      setIsAnimating(true);
      
      // Animate the number change
      const duration = 500;
      const start = displayBalance;
      const end = balance;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        setDisplayBalance(Math.round(current * 100) / 100);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [balance, displayBalance]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const labelSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const isPositiveChange = balance > displayBalance;
  const isNegativeChange = balance < displayBalance;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className={`text-ink-black-400 ${labelSizes[size]}`}>
          Balance:
        </span>
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={Math.round(displayBalance)}
          initial={{ y: isPositiveChange ? 10 : -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isPositiveChange ? -10 : 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            font-mono font-bold ${sizeClasses[size]}
            ${isAnimating && isPositiveChange ? "text-tropical-teal-400" : ""}
            ${isAnimating && isNegativeChange ? "text-red-400" : ""}
            ${!isAnimating ? "text-cornsilk-400" : ""}
            transition-colors duration-300
          `}
        >
          ${displayBalance.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </motion.span>
      </AnimatePresence>
      
      {/* Glow effect on change */}
      {isAnimating && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={`
            w-2 h-2 rounded-full
            ${isPositiveChange ? "bg-tropical-teal-500" : "bg-red-500"}
            animate-pulse
          `}
        />
      )}
    </div>
  );
}

// Compact version for header
export function BalanceChip({ balance }: { balance: number }) {
  return (
    <div className="glass-card px-4 py-2 flex items-center gap-2">
      <BalanceDisplay balance={balance} size="md" showLabel={true} />
    </div>
  );
}

// Large display for dashboard
export function BalanceCard({ balance }: { balance: number }) {
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-ink-black-400 text-sm mb-2">Your Balance</p>
      <BalanceDisplay
        balance={balance}
        size="lg"
        showLabel={false}
        className="justify-center"
      />
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-black-500">
        <span className="w-2 h-2 rounded-full bg-tropical-teal-500" />
        Updated in real-time
      </div>
    </div>
  );
}
