import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { getRandomSymbol, calculateWin, SYMBOLS } from "@/lib/games/slots/logic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { betAmount } = body;

    if (!betAmount || betAmount <= 0) {
      return NextResponse.json({ error: "Invalid bet amount" }, { status: 400 });
    }

    const userId = session.userId as string;

    // 1. Transaction to check balance and spin
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch Active Game (State only)
      // We don't strictly need an active game row for slots if we just store history, 
      // but if we used it for session tracking:
      let activeGame = await tx.activeGame.findFirst({
           where: { 
               userId: session.userId, 
               gameType: "slots" 
           }
      });
      // Check Balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user || user.balance < betAmount) {
        throw new Error("Insufficient funds");
      }

      // 2. Generate Result
      const reel1 = getRandomSymbol();
      const reel2 = getRandomSymbol();
      const reel3 = getRandomSymbol();
      const reels = [reel1, reel2, reel3];
      
      const winAmount = calculateWin(reels, betAmount);
      const isWin = winAmount > 0;
      
      // 3. Update User Balance
      // Deduct bet and add winnings (net change)
      const balanceChange = winAmount - betAmount;
      
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: balanceChange },
        },
      });

      // 4. Record Transaction (Bet)
      await tx.transaction.create({
        data: {
          userId,
          amount: -betAmount,
          type: "bet",
          gameType: "slots",
        },
      });

      // 5. Record Transaction (Win - only if win > 0)
      if (isWin) {
        await tx.transaction.create({
          data: {
            userId,
            amount: winAmount,
            type: "win",
            gameType: "slots",
          },
        });
      }

      // 6. Record Game History
      await tx.gameHistory.create({
        data: {
          userId,
          gameType: "slots",
          betAmount: betAmount,
          result: JSON.stringify(reels.map(r => r.id)),
          payout: winAmount,
        },
      });

      return {
        reels,
        winAmount,
        balance: updatedUser.balance,
      };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "Insufficient funds") {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }
    console.error("Slot spin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
