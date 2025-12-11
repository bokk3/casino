import { SportsBook } from "@/components/games/sports/SportsBook";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SportsPage() {
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
            <h1 className="text-3xl font-bold text-cornsilk-50">Sportsbook</h1>
            <p className="text-ink-black-400 text-sm">Bet on your favorite teams.</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <SportsBook />
    </div>
  );
}
