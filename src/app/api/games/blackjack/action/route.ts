import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { calculateHandValue, Card } from "@/lib/games/blackjack/cards";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json(); // "hit" or "stand"
    const userId = session.userId as string;

    const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch Active Game
        const activeGame = await tx.activeGame.findFirst({
            where: { 
                userId: session.userId,
                gameType: "blackjack"
            }
        });

        if (!activeGame) {
            throw new Error("No active game found");
        }

        const state = JSON.parse(activeGame.state);
        let { deck, playerHands, dealerHand, activeHandIndex } = state; 
        
        let gameFinished = false;
        let totalWin = 0;

        // Helper to check if dealer needs to play
        // Dealer plays if at least one hand is not busted (and not blackjack? depends on rule, usually yes)
        
        if (activeHandIndex === -1 && action === "resolve") {
             // Special case: All hands were blackjack or logic auto-passed to dealer
        } else if (activeHandIndex >= 0 && activeHandIndex < playerHands.length) {
            const currentHand = playerHands[activeHandIndex];

            if (action === "hit") {
                const card = deck.pop();
                currentHand.cards.push(card);
                const val = calculateHandValue(currentHand.cards);
                
                if (val > 21) {
                    currentHand.status = "dealer_win"; // Bust
                    // Move to next hand
                    activeHandIndex = findNextActiveHand(playerHands, activeHandIndex);
                }
            } else if (action === "stand") {
                // Move to next hand
                 activeHandIndex = findNextActiveHand(playerHands, activeHandIndex);
            }
        }

        // If no more active hands, Dealer plays
        if (activeHandIndex === -1) {
            // Check if all players busted? If so, dealer doesn't need to play (usually).
            // But for simplicity and visual completeness, let's play dealer out if there's at least one non-bust hand?
            // Actually standard rule: if all players bust, dealer doesn't act.
            const anyLivingHand = playerHands.some((h: any) => h.status === "playing" || h.status === "blackjack");
            
            dealerHand[1].isHidden = false; // Reveal

            if (anyLivingHand) {
                 let dealerValue = calculateHandValue(dealerHand);
                 while (dealerValue < 17) {
                     dealerHand.push(deck.pop());
                     dealerValue = calculateHandValue(dealerHand);
                 }
            }

            // Resolve all hands
            const dealerValue = calculateHandValue(dealerHand);
            
            playerHands.forEach((hand: any) => {
                 if (hand.status === "dealer_win") return; // Already busted
                 
                 const playerValue = calculateHandValue(hand.cards);
                 
                 if (hand.status === "blackjack") {
                     // Check dealer blackjack
                     // If dealer has blackjack (21 with 2 cards), push?
                     // If dealer has 21 with >2 cards, player wins 3:2?
                     const dealerBlackjack = dealerValue === 21 && dealerHand.length === 2;
                     if (dealerBlackjack) {
                         hand.status = "push";
                         totalWin += hand.bet;
                     } else {
                         hand.status = "player_win"; // Blackjack win
                         totalWin += hand.bet * 2.5; // 3:2 payout + original bet (1.5 + 1 = 2.5)
                     }
                 } else {
                     if (dealerValue > 21) {
                         hand.status = "player_win";
                         totalWin += hand.bet * 2;
                     } else if (playerValue > dealerValue) {
                         hand.status = "player_win";
                         totalWin += hand.bet * 2;
                     } else if (playerValue < dealerValue) {
                         hand.status = "dealer_win";
                     } else {
                         hand.status = "push";
                         totalWin += hand.bet;
                     }
                 }
            });

            gameFinished = true;
        }

        // Save or Clean
        if (!gameFinished) {
             await tx.activeGame.update({
                where: { id: activeGame.id },
                data: {
                    state: JSON.stringify({ ...state, deck, playerHands, dealerHand, activeHandIndex })
                }
            });
        } else {
             await tx.activeGame.delete({ where: { id: activeGame.id } });
             
             if (totalWin > 0) {
                 await tx.user.update({
                     where: { id: userId },
                     data: { balance: { increment: totalWin } }
                 });

                 await tx.transaction.create({
                     data: {
                         userId,
                         amount: totalWin,
                         type: "win",
                         gameType: "blackjack"
                     }
                 });
             }
             
             await tx.gameHistory.create({
                data: {
                    userId,
                    gameType: "blackjack",
                    betAmount: activeGame.betAmount,
                    result: JSON.stringify({ playerHands, dealerHand }),
                    payout: totalWin
                }
            });
        }

        return {
            playerHands,
            dealerHand,
            activeHandIndex,
            gameFinished,
            totalWin
        };
    });

    return NextResponse.json(result);

  } catch (error: any) {
      console.error("Blackjack action error:", error);
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function findNextActiveHand(hands: any[], currentIndex: number): number {
    for (let i = currentIndex + 1; i < hands.length; i++) {
        // Only stop at hands that are "playing"
        // Blackjacks are already effectively done, waiting for dealer
        if (hands[i].status === "playing") return i;
    }
    return -1; // No more active hands
}
