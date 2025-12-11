import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateRoulettePayout } from "@/lib/games/roulette/logic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bets } = await req.json(); // bets: { "17": 10, "red": 50 }
    if (!bets || Object.keys(bets).length === 0) {
       return NextResponse.json({ error: "No bets placed" }, { status: 400 });
    }

    const userId = session.userId as string;

    // Calculate total bet
    let totalBetAmount = 0;
    for (const amount of Object.values(bets)) {
        if (typeof amount !== 'number' || amount < 0) {
            return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
        }
        totalBetAmount += amount;
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1. Get or Create Active Game for Session
        let activeGame = await tx.activeGame.findFirst({
             where: {
                 userId: session.userId,
                 gameType: "roulette"
             }
        });
        // 1. Check Balance
        const user = await tx.user.findUnique({
             where: { id: userId },
             select: { balance: true }
        });

        if (!user || user.balance < totalBetAmount) {
            throw new Error("Insufficient funds");
        }

        // 2. Generate Winning Number
        const winningNumber = Math.floor(Math.random() * 37); // 0-36

        // 3. Calculate Win
        const winAmount = calculateRoulettePayout(winningNumber, bets);
        const balanceChange = winAmount - totalBetAmount; // Net change

        // 4. Update Balance
        await tx.user.update({
            where: { id: userId },
            data: { balance: { increment: balanceChange } }
        });

        // 5. Record Transaction (Bet)
        await tx.transaction.create({
            data: {
                userId,
                amount: -totalBetAmount,
                type: "bet",
                gameType: "roulette"
            }
        });

        // 6. Record Transaction (Win)
        if (winAmount > 0) {
             await tx.transaction.create({
                data: {
                    userId,
                    amount: winAmount,
                    type: "win",
                    gameType: "roulette"
                }
            });
        }

        // 7. Record History
        await tx.gameHistory.create({
            data: {
                userId,
                gameType: "roulette",
                betAmount: totalBetAmount,
                result: winningNumber.toString(),
                payout: winAmount
            }
        });

        return {
            winningNumber,
            winAmount,
            totalBetAmount
        };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "Insufficient funds") {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }
    console.error("Roulette spin error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
