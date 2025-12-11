import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { betAmount, matchId, team, odds, sportTitle, homeTeam, awayTeam } = await req.json();

    if (!betAmount || betAmount <= 0) {
        return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
    }

    const userId = session.userId as string;

    const result = await prisma.$transaction(async (tx) => {
        // 1. Check Balance
        const user = await tx.user.findUnique({
             where: { id: userId },
             select: { balance: true }
        });

        if (!user || user.balance < betAmount) {
            throw new Error("Insufficient funds");
        }

        // 2. Deduct Balance
        await tx.user.update({
            where: { id: userId },
            data: { balance: { decrement: betAmount } }
        });

        // 3. Create Transaction
        await tx.transaction.create({
            data: {
                userId,
                amount: -betAmount,
                type: "bet",
                gameType: "sports_bet"
            }
        });

        // 4. Create Active Bet Record (using ActiveGame)
        // We store the full bet details in state so we can simulate settlement later
        const betState = {
            matchId,
            selectedTeam: team,
            odds,
            matchDetails: {
                sport: sportTitle,
                home: homeTeam,
                away: awayTeam
            },
            status: "pending",
            placedAt: new Date().toISOString()
        };

        await tx.activeGame.create({
            data: {
                userId,
                gameType: "sports_bet",
                betAmount,
                state: JSON.stringify(betState)
            }
        });

        return { success: true, balance: user.balance - betAmount };
    });

    return NextResponse.json(result);

  } catch (error: any) {
      if (error.message === "Insufficient funds") {
          return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
      }
      console.error("Sports bet error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
