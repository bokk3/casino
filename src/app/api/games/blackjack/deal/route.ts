import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { dealInitialHand, calculateHandValue, Card, shuffle, createDeck } from "@/lib/games/blackjack/cards";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { bets } = body; // Array of numbers: [10, 0, 20] (0 means no bet on that spot)

    if (!Array.isArray(bets) || bets.length === 0 || bets.every(b => b <= 0)) {
      return NextResponse.json({ error: "Invalid bets" }, { status: 400 });
    }

    const userId = session.userId as string;
    const totalBetAmount = bets.reduce((sum: number, b: number) => sum + (b || 0), 0);

    // Transaction: Deduct bet found, create active game
    const result = await prisma.$transaction(async (tx) => {
        // 1. Check if game already exists
        const existingGame = await tx.activeGame.findFirst({
            where: { 
                userId: session.userId,
                gameType: "blackjack"
            }
        });

        // If an active game exists, prevent starting a new one
        if (existingGame) {
            throw new Error("An active game already exists. Please finish or abandon it first.");
        }

        // 1. Check Balance
        const user = await tx.user.findUnique({
             where: { id: userId },
             select: { balance: true }
        });

        if (!user || user.balance < totalBetAmount) {
            throw new Error("Insufficient funds");
        }

        // 2. Cleanup any existing active game
        await tx.activeGame.deleteMany({
            where: { userId: userId }
        });

        // 3. Deduct Balance
        await tx.user.update({
            where: { id: userId },
            data: { balance: { decrement: totalBetAmount } }
        });

        // 4. Create Transaction Record
        await tx.transaction.create({
            data: {
                userId,
                amount: -totalBetAmount,
                type: "bet",
                gameType: "blackjack"
            }
        });

        // 5. Deal Cards
        let deck = shuffle(createDeck());
        const dealerHand: Card[] = [deck.pop()!, deck.pop()!];
        dealerHand[1].isHidden = true;

        const playerHands = bets.map(bet => {
            if (bet <= 0) return null;
            
            const hand = [deck.pop()!, deck.pop()!];
            const value = calculateHandValue(hand);
            let status = "playing";
            
            // Check for initial Blackjack
            // Note: Simple rule, dealer check happens later or we assume player gets 3:2 immediately if dealer doesn't have Ace/10
            if (value === 21) {
                status = "blackjack";
            }
            
            return {
                cards: hand,
                bet: bet,
                status: status
            };
        }).filter(h => h !== null);

        // Determine active hand (first non-blackjack hand)
        // If all are blackjack, game is effectively done for player logic, waiting for dealer reveal?
        // Let's iterate: find first 'playing' hand.
        let activeHandIndex = playerHands.findIndex(h => h && h.status === "playing");
        
        // If no hands are playing (e.g. all blackjack), we need to resolve immediately?
        // Or we just set index to -1 or similar to trigger dealer turn in next step?
        // For simplicity, let's keep status 'playing' at game level if there's any action left,
        // OR if we need to show the dealer reveal. 
        
        let gameStatus = "playing";

        if (activeHandIndex === -1) {
            // All hands are Blackjacks (or done?), trigger dealer logic immediately?
            // Actually, client calls "action: stand" automatically? 
            // Better: Return state, let client request "resolve" or we just handle it?
            // Let's set activeHandIndex to 0 if all are Blackjack, so client sees it, then client can "Stand"/Finish.
             activeHandIndex = -1; // Special flag? Or just use "finished" game status?
             // If all are blackjack, we technically skip to dealer reveal.
             // But let's leave that for the 'action' endpoint. To keep it consistent,
             // if activeHandIndex is -1, it means "Dealer Turn Ready".
        } else {
             // activeHandIndex is set to the first playing hand
        }


        // 6. Create Active Game
        const state = {
            deck,
            playerHands,
            dealerHand,
            activeHandIndex,
            status: "playing"
        };

        await tx.activeGame.create({
            data: {
                userId,
                gameType: "blackjack",
                betAmount: totalBetAmount,
                state: JSON.stringify(state)
            }
        });

        return {
            playerHands,
            dealerHand,
            activeHandIndex,
            gameStatus: "playing"
        };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    if (error.message === "Insufficient funds") {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }
    console.error("Blackjack deal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
