import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { differenceInHours } from "date-fns";

// Reward tiers and weights
const REWARDS = [
  { value: 50, weight: 40 },
  { value: 100, weight: 30 },
  { value: 250, weight: 15 },
  { value: 500, weight: 10 },
  { value: 1000, weight: 5 },
];

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;

    // 1. Check Cooldown
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastBonusSpin: true, balance: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.lastBonusSpin) {
      const hoursSinceLastSpin = differenceInHours(new Date(), new Date(user.lastBonusSpin));
      if (hoursSinceLastSpin < 24) {
        return NextResponse.json(
          { error: "Bonus not available yet" },
          { status: 403 }
        );
      }
    }

    // 2. Calculate Reward
    const totalWeight = REWARDS.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let reward = REWARDS[0];

    for (const item of REWARDS) {
      if (random < item.weight) {
        reward = item;
        break;
      }
      random -= item.weight;
    }

    // 3. Update DB (Transaction + User Update)
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId,
          amount: reward.value,
          type: "bonus",
          gameType: "wheel",
          // status: "completed", - Removed as it's not in the schema
        },
      });

      // Create bonus spin record (optional, but good for analytics)
      await tx.bonusSpin.create({
        data: {
          userId,
          reward: reward.value,
        },
      });

      // Update user balance and timestamp
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: reward.value },
          lastBonusSpin: new Date(),
        },
      });

      return updatedUser;
    });

    return NextResponse.json({
      success: true,
      reward: reward.value,
      newBalance: result.balance,
    });
  } catch (error) {
    console.error("Bonus spin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
