"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MatchCardProps {
    match: any;
    onBet: (match: any, team: string, odds: number) => void;
}

export function MatchCard({ match, onBet }: MatchCardProps) {
    // Extract odds (h2h)
    // The Odds API structure: bookmakers[0].markets[0].outcomes
    const bookmaker = match.bookmakers?.[0]; // Use first bookmaker
    const market = bookmaker?.markets?.find((m: any) => m.key === "h2h");
    const outcomes = market?.outcomes || [];

    const homeOdds = outcomes.find((o: any) => o.name === match.home_team);
    const awayOdds = outcomes.find((o: any) => o.name === match.away_team);

    if (!homeOdds || !awayOdds) return null; // Skip if no odds

    return (
        <Card className="bg-ink-black-900 border-ink-black-800 p-4 hover:border-ink-black-700 transition-colors">
            <div className="flex justify-between text-xs text-ink-black-400 mb-3">
                <span className="uppercase tracking-wider font-bold text-cerulean-500/80">{match.sport_title}</span>
                <span>{format(new Date(match.commence_time), "MMM d, h:mm a")}</span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* Home Team */}
                <div className="text-left">
                    <p className="font-bold text-white mb-1 truncate">{match.home_team}</p>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full bg-ink-black-950 border-ink-black-700 hover:bg-cerulean-500/10 hover:border-cerulean-500/50 hover:text-cerulean-400"
                        onClick={() => onBet(match, match.home_team, homeOdds.price)}
                    >
                        {homeOdds.price}
                    </Button>
                </div>

                <div className="text-ink-black-600 font-bold text-xs">VS</div>

                {/* Away Team */}
                <div className="text-right">
                    <p className="font-bold text-white mb-1 truncate">{match.away_team}</p>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full bg-ink-black-950 border-ink-black-700 hover:bg-cerulean-500/10 hover:border-cerulean-500/50 hover:text-cerulean-400"
                        onClick={() => onBet(match, match.away_team, awayOdds.price)}
                    >
                        {awayOdds.price}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
