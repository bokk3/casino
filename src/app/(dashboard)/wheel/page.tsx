"use client";

import { useState, useEffect } from "react";
import { BonusWheel } from "@/components/games/wheel/BonusWheel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBalance } from "@/hooks/useBalance";
import { ArrowLeft, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import confetti from "canvas-confetti";

const SEGMENTS = [
  { label: "50", value: 50, color: "#ef4444" }, // Red
  { label: "100", value: 100, color: "#3b82f6" }, // Blue
  { label: "250", value: 250, color: "#22c55e" }, // Green
  { label: "500", value: 500, color: "#a855f7" }, // Purple
  { label: "1K", value: 1000, color: "#eab308" }, // Yellow
  { label: "50", value: 50, color: "#ef4444" },
  { label: "100", value: 100, color: "#3b82f6" },
  { label: "250", value: 250, color: "#22c55e" },
];

export default function BonusPage() {
  const { refreshBalance, updateBalanceOptimistically, balance } = useBalance();
  const [canSpin, setCanSpin] = useState(false);
  const [nextSpinAvailable, setNextSpinAvailable] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    if (nextSpinAvailable) {
      const updateTimer = () => {
        const now = new Date();
        const diff = differenceInSeconds(nextSpinAvailable, now);
        
        if (diff <= 0) {
          setCanSpin(true);
          setNextSpinAvailable(null);
          setCountdown("");
        } else {
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      };

      updateTimer(); // Update immediately
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [nextSpinAvailable]);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/bonus/status");
      if (!res.ok) throw new Error("Failed to fetch status");
      const data = await res.json();
      setCanSpin(data.canSpin);
      if (data.nextSpinAvailable) {
        setNextSpinAvailable(new Date(data.nextSpinAvailable));
      }
    } catch (error) {
      console.error("Failed to check bonus status:", error);
      setError("Unable to load bonus status. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpinClick = async () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setWinAmount(null);

    try {
      const res = await fetch("/api/bonus/spin", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        // Find the index of the segment with the winning value
        // We need to match the value to one of the segments
        // To make it look random, we can pick any segment with that value
        const matchingIndices = SEGMENTS.map((s, i) => s.value === data.reward ? i : -1).filter(i => i !== -1);
        const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
        
        setPrizeIndex(targetIndex);
        setWinAmount(data.reward);
        
        // We'll update balance after animation
      } else {
        console.error("Spin failed:", data.error);
        setIsSpinning(false);
      }
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  const onSpinComplete = () => {
    setIsSpinning(false);
    setCanSpin(false);
    
    // Celebrate!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2dd4bf", "#f4f1de", "#eab308"],
    });

    if (winAmount) {
      updateBalanceOptimistically(balance + winAmount);
      refreshBalance();
      // Set next spin time to 24h from now (approx, for UI)
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      setNextSpinAvailable(tomorrow);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-cerulean-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-ink-black-400 hover:text-cornsilk-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-cornsilk-50">Daily Bonus Wheel</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="relative py-8">
        <BonusWheel
          isSpinning={isSpinning}
          onSpinComplete={onSpinComplete}
          prizeIndex={prizeIndex}
          segments={SEGMENTS}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        {canSpin ? (
          <Button
            size="lg"
            onClick={handleSpinClick}
            disabled={isSpinning}
            className="bg-gradient-to-r from-tropical-teal-500 to-cerulean-500 hover:from-tropical-teal-600 hover:to-cerulean-600 text-ink-black-950 font-bold text-xl px-12 py-6 rounded-full shadow-lg shadow-tropical-teal-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? "Spinning..." : "SPIN NOW!"}
          </Button>
        ) : (
          <Card className="bg-ink-black-900/50 border-ink-black-800 p-6 flex flex-col items-center gap-2 min-w-[300px]">
            <p className="text-ink-black-400">Next spin available in:</p>
            <div className="flex items-center gap-2 text-2xl font-mono font-bold text-cornsilk-100">
              <Timer className="w-6 h-6 text-cerulean-400" />
              {countdown || "Calculating..."}
            </div>
          </Card>
        )}

        {winAmount && !isSpinning && (
          <div className="mt-4 animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold text-tropical-teal-400">
              You Won {formatCurrency(winAmount)}!
            </h2>
            <p className="text-ink-black-400">Come back tomorrow for more.</p>
          </div>
        )}
      </div>
    </div>
  );
}
