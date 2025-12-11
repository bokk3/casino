"use client";

import { useState, useEffect } from "react";
import { MatchCard } from "./MatchCard";
import { Button } from "@/components/ui/button";
import { useBalance } from "@/hooks/useBalance";
import { toast } from "sonner";
import { Loader2, DollarSign, Trophy, XCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function SportsBook() {
    const { balance, refreshBalance } = useBalance();
    const [matches, setMatches] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState("soccer_epl"); // Default to EU friendly
    const [view, setView] = useState<"betting" | "results">("betting");
    
    // Betting State
    const [betSlip, setBetSlip] = useState<{match: any, team: string, odds: number} | null>(null);
    const [wager, setWager] = useState("10");

    // Active Bets (Simulated)
    const [activeBets, setActiveBets] = useState<any[]>([]);

    useEffect(() => {
        fetchActiveBets();
        if (view === "betting") {
            fetchMatches();
        } else {
            fetchResults();
        }
    }, [selectedSport, view]);

    const fetchMatches = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/sports/odds?sport=${selectedSport}&region=eu`);
            const data = await res.json();
            if (data.data) {
                setMatches(data.data);
            } else {
                setMatches([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load matches");
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/sports/results?sport=${selectedSport}`);
            const data = await res.json();
            if (data.data) {
                setResults(data.data);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveBets = async () => {
        // We need an endpoint for this or just fetch active games generic
        // For now, let's just use a dedicated call if we had one, but we don't.
        // Let's create a quick "getMyBets" inline fetch or just assume the user sees them in transaction history?
        // No, we want a "My Bets" panel. 
        // I'll skip implementation of fetching specifically for now or assume empty until I add the endpoint.
        // Wait, I can iterate `api/games/active` if I implemented it?
        // Let's just store them in local state for the session if possible? No, bad UX.
        // Actually, let's create a specialized simple fetch in the component for now using a direct active-games fetch if possible?
        // Reuse existing endpoint? No general 'get active games' endpoint exists. 
        // I will implement a quick fetch active bets function using a new route or just assume for this demo we rely on "success" toast.
        // UPDATE: I will add a "Refresh Bets" button that calls a new endpoint I'll quickly make.
        // Actually, for time, I'll allow "Simulate" in the success flow or just assume 
        // we can't see them yet.
        // BETTER: I'll create `api/sports/active/route.ts` quickly.
    };

    const handlePlaceBet = async () => {
        if (!betSlip) return;
        const amount = parseFloat(wager);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Invalid wager");
            return;
        }

        try {
            const res = await fetch("/api/sports/bet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    betAmount: amount,
                    matchId: betSlip.match.id,
                    team: betSlip.team,
                    odds: betSlip.odds,
                    sportTitle: betSlip.match.sport_title,
                    homeTeam: betSlip.match.home_team,
                    awayTeam: betSlip.match.away_team
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Bet Placed!");
            refreshBalance();
            setBetSlip(null);
            
            // Should refresh actve bets list
            // fetchActiveGames();

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            {/* Main Column: Matches */}
            <div className="space-y-6">
                <div className="flex bg-ink-black-900 p-1 rounded-lg w-fit border border-ink-black-800 mb-4">
                    <button
                        onClick={() => setView("betting")}
                        className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all", view === "betting" ? "bg-cerulean-500 text-white shadow-lg" : "text-ink-black-400 hover:text-white")}
                    >
                        Betting
                    </button>
                    <button
                        onClick={() => setView("results")}
                        className={cn("px-4 py-2 rounded-md text-sm font-bold transition-all", view === "results" ? "bg-cerulean-500 text-white shadow-lg" : "text-ink-black-400 hover:text-white")}
                    >
                        Results
                    </button>
                </div>

                {/* Sports Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cerulean-500/20">
                    {[
                        { id: "soccer_epl", label: "EPL (UK)" },
                        { id: "soccer_uefa_champs_league", label: "Champions League" },
                        { id: "soccer_spain_la_liga", label: "La Liga" },
                        { id: "basketball_euroleague", label: "EuroLeague" },
                        { id: "tennis_atp_wimbledon", label: "Wimbledon" },
                        { id: "americanfootball_nfl", label: "NFL" },
                        { id: "basketball_nba", label: "NBA" },
                    ].map(sport => (
                        <Button
                            key={sport.id}
                            variant={selectedSport === sport.id ? "default" : "outline"}
                            onClick={() => setSelectedSport(sport.id)}
                            className={cn(
                                "whitespace-nowrap",
                                selectedSport === sport.id ? "bg-cerulean-600 hover:bg-cerulean-500 border-transparent" : "bg-ink-black-900 border-ink-black-700 hover:border-cerulean-500/50"
                            )}
                        >
                            {sport.label}
                        </Button>
                    ))}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin w-10 h-10 text-cerulean-500" />
                    </div>
                ) : view === "betting" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                        {matches.length > 0 ? matches.map(match => (
                            <MatchCard 
                                key={match.id} 
                                match={match} 
                                onBet={(m, team, odds) => setBetSlip({ match: m, team, odds })} 
                            />
                        )) : (
                            <div className="col-span-2 text-center py-10 text-ink-black-500">No upcoming matches details found for this league.</div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {results.length > 0 ? results.map((game: any) => (
                             <Card key={game.id} className="bg-ink-black-900 border-ink-black-800 p-4 flex justify-between items-center hover:bg-ink-black-800/50 transition-colors">
                                 <div className="flex flex-col gap-1 w-1/3 text-right">
                                     <span className={cn("font-bold", game.scores?.find((s:any) => s.name === game.home_team)?.score > game.scores?.find((s:any) => s.name === game.away_team)?.score ? "text-green-400" : "text-white")}>
                                         {game.home_team}
                                     </span>
                                     <span className="text-2xl font-mono">{game.scores?.find((s:any) => s.name === game.home_team)?.score}</span>
                                 </div>
                                 
                                 <div className="px-4 text-xs text-ink-black-500 font-bold uppercase tracking-widest">FT</div>

                                 <div className="flex flex-col gap-1 w-1/3 text-left">
                                     <span className={cn("font-bold", game.scores?.find((s:any) => s.name === game.away_team)?.score > game.scores?.find((s:any) => s.name === game.home_team)?.score ? "text-green-400" : "text-white")}>
                                         {game.away_team}
                                     </span>
                                     <span className="text-2xl font-mono">{game.scores?.find((s:any) => s.name === game.away_team)?.score}</span>
                                 </div>
                             </Card>
                        )) : (
                            <div className="text-center py-10 text-ink-black-500">No recent results found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar: Bet Slip */}
            <div className="space-y-6">
                <Card className="bg-ink-black-900 border-ink-black-800 p-6 sticky top-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-cornsilk-400" /> Bet Slip
                    </h2>

                    {betSlip ? (
                        <div className="space-y-4 animate-in slide-in-from-right-10 duration-200">
                            <div className="bg-black/40 p-3 rounded-lg border border-ink-black-700">
                                <p className="text-xs text-ink-black-400 mb-1">{betSlip.match.sport_title}</p>
                                <p className="font-bold text-cerulean-400">{betSlip.team}</p>
                                <p className="text-xs text-white mt-1">
                                    vs {betSlip.team === betSlip.match.home_team ? betSlip.match.away_team : betSlip.match.home_team}
                                </p>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                                    <span className="text-sm text-ink-black-300">Odds</span>
                                    <span className="font-mono font-bold text-yellow-400">{betSlip.odds}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-ink-black-400 font-bold uppercase">Wager Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-black-400">$</span>
                                    <input 
                                        type="number" 
                                        value={wager}
                                        onChange={(e) => setWager(e.target.value)}
                                        className="w-full bg-ink-black-950 border border-ink-black-700 rounded-lg py-2 pl-7 pr-3 text-white focus:outline-none focus:border-cerulean-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between text-sm py-2">
                                <span className="text-ink-black-400">Potential Return</span>
                                <span className="text-green-400 font-bold font-mono">
                                    {formatCurrency((parseFloat(wager) || 0) * betSlip.odds)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => setBetSlip(null)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                    Cancel
                                </Button>
                                <Button onClick={handlePlaceBet} className="bg-green-600 hover:bg-green-500 text-white font-bold">
                                    Place Bet
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-ink-black-500 border-2 border-dashed border-ink-black-800 rounded-xl">
                            <p>Select a match to start betting</p>
                        </div>
                    )}
                </Card>
                
                {/* Active Bets Panel (Simulated for Demo) */}
                <ActiveBetsPanel />
            </div>
        </div>
    );
}

// Sub-component for Active Bets (needs its own fetcher)
function ActiveBetsPanel() {
    const { refreshBalance } = useBalance();
    const [bets, setBets] = useState<any[]>([]);
    
    // Quick fetcher
    const refresh = async () => {
        const res = await fetch("/api/sports/bets/active"); // We need to create this!
        if (res.ok) {
            const data = await res.json();
            setBets(data.bets);
        }
    };

    useEffect(() => { refresh(); }, []);

    const settle = async (betId: string, outcome: "win" | "lose") => {
        await fetch("/api/sports/settle", {
            method: "POST",
            body: JSON.stringify({ betId, outcome })
        });
        toast.success(`Bet marked as ${outcome}`);
        refreshBalance();
        refresh();
    };

    if (bets.length === 0) return null;

    return (
        <Card className="bg-ink-black-900 border-ink-black-800 p-6">
             <h2 className="text-lg font-bold text-white mb-4 flex justify-between items-center">
                 <span>My Pending Bets</span>
                 <Button size="sm" variant="ghost" onClick={refresh} className="h-6 text-xs px-2">Refresh</Button>
             </h2>
             <div className="space-y-3">
                 {bets.map(bet => {
                     const state = JSON.parse(bet.state);
                     return (
                         <div key={bet.id} className="bg-black/30 p-3 rounded border border-ink-black-700 text-sm">
                             <div className="flex justify-between mb-1">
                                 <span className="font-bold text-cerulean-400">{state.selectedTeam}</span>
                                 <span className="text-yellow-500 font-mono">x{state.odds}</span>
                             </div>
                             <p className="text-xs text-ink-black-400 mb-2">Bet: {formatCurrency(bet.betAmount)}</p>
                             
                             <div className="grid grid-cols-2 gap-2">
                                 <Button size="sm" className="h-7 text-xs bg-green-900/50 hover:bg-green-600 text-green-300" onClick={() => settle(bet.id, "win")}>
                                     Sim Win
                                 </Button>
                                 <Button size="sm" className="h-7 text-xs bg-red-900/50 hover:bg-red-600 text-red-300" onClick={() => settle(bet.id, "lose")}>
                                     Sim Lose
                                 </Button>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </Card>
    );
}
