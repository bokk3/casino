import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId as string;

    const bets = await prisma.activeGame.findMany({
        where: {
            userId,
            gameType: "sports_bet"
        },
        orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ bets });

  } catch (error: any) {
      console.error("Fetch active bets error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
