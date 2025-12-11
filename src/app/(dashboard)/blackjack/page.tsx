import { BlackjackTable } from "@/components/games/blackjack/BlackjackTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlackjackPage() {
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
            <h1 className="text-3xl font-bold text-cornsilk-50">High Stakes Blackjack</h1>
            <p className="text-ink-black-400 text-sm">Beat the dealer to win!</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Game Area */}
      <div className="py-8">
        <BlackjackTable />
      </div>

      {/* Rules */}
      <div className="text-center text-ink-black-500 text-sm">
          <p>Blackjack pays 3:2 • Dealer stands on soft 17 • Push returns bet</p>
      </div>
    </div>
  );
}
