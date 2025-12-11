import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";
import { differenceInHours, addHours } from "date-fns";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: { lastBonusSpin: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let canSpin = true;
    let nextSpinAvailable = new Date();

    if (user.lastBonusSpin) {
      const lastSpin = new Date(user.lastBonusSpin);
      const hoursSinceLastSpin = differenceInHours(new Date(), lastSpin);
      
      if (hoursSinceLastSpin < 24) {
        canSpin = false;
        nextSpinAvailable = addHours(lastSpin, 24);
      }
    }

    return NextResponse.json({
      canSpin,
      nextSpinAvailable: nextSpinAvailable.toISOString(),
    });
  } catch (error) {
    console.error("Bonus status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
