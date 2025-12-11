import { RouletteGame } from "@/components/games/roulette/RouletteGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RoulettePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-ink-black-400 hover:text-cornsilk-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-cornsilk-50">European Roulette</h1>
            <p className="text-ink-black-400 text-sm">Place your bets on the table.</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Game Area */}
      <div className="py-8">
        <RouletteGame />
      </div>
    </div>
  );
}
