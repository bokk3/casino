import { SlotMachine } from "@/components/games/slots/SlotMachine";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SlotsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="text-ink-black-400 hover:text-cornsilk-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
            <h1 className="text-3xl font-bold text-cornsilk-50">Neon Slots</h1>
            <p className="text-ink-black-400 text-sm">Spin to win with 777!</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Game Area */}
      <div className="py-8">
        <SlotMachine />
      </div>

      {/* Paytable / Info (Optional, can be expanded later) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-ink-black-900/50 rounded-2xl border border-ink-black-800">
        <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🍒🍒🍒</span>
            <span className="text-tropical-teal-400 font-bold">5x</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🔔🔔🔔</span>
            <span className="text-tropical-teal-400 font-bold">25x</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🎰🎰🎰</span>
            <span className="text-tropical-teal-400 font-bold">50x</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">💎💎💎</span>
            <span className="text-tropical-teal-400 font-bold">100x</span>
        </div>
      </div>
    </div>
  );
}
