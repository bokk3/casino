import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with transaction to ensure balance is set
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          balance: 1000.0, // Initial balance
        },
      });

      // Record initial deposit transaction
      await tx.transaction.create({
        data: {
          userId: newUser.id,
          amount: 1000.0,
          type: "deposit", // Initial deposit
        },
      });

      return newUser;
    });

    // Create session
    await createSession(user.id, user.username);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          balance: user.balance,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
