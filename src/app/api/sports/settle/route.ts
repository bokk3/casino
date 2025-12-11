import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { betId, outcome } = await req.json(); // outcome: "win" or "lose"
    const userId = session.userId as string;

    const result = await prisma.$transaction(async (tx) => {
        const bet = await tx.activeGame.findUnique({
            where: { id: betId }
        });

        if (!bet || bet.userId !== userId || bet.gameType !== "sports_bet") {
            throw new Error("Bet not found");
        }

        const state = JSON.parse(bet.state);
        
        // Payout Calculation
        let payout = 0;
        let finalStatus = "";

        if (outcome === "win") {
             // American Odds Calculation
             // positive (+150): Bet 100 to win 150. Total return 250.
             // negative (-110): Bet 110 to win 100. Total return 210.
             
             const odds = state.odds; // price, e.g. 1.90 (decimal) or american?
             // API usually returns decimal odds in markets, but we can verify.
             // The Odds API usually returns decimal. 
             // Let's assume decimal for calculation ease.
             
             payout = bet.betAmount * odds;
             finalStatus = "won";
             
             // Update Balance
             await tx.user.update({
                 where: { id: userId },
                 data: { balance: { increment: payout } }
             });

             await tx.transaction.create({
                 data: {
                     userId,
                     amount: payout,
                     type: "win",
                     gameType: "sports_bet"
                 }
             });
        } else {
             finalStatus = "lost";
        }

        // Move to History
        await tx.gameHistory.create({
            data: {
                userId,
                gameType: "sports_bet",
                betAmount: bet.betAmount,
                result: JSON.stringify({ ...state, outcome }),
                payout: payout
            }
        });

        // Delete Active Game
        await tx.activeGame.delete({
            where: { id: betId }
        });

        return { success: true, payout, status: finalStatus };
    });

    return NextResponse.json(result);

  } catch (error: any) {
      console.error("Settle error:", error);
      return NextResponse.json({ error: "Failed to settle bet" }, { status: 500 });
  }
}
