import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth0.getSession();
    const authUser = session?.user;

    if (!authUser) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const auth0Id = authUser.sub;
    const email = authUser.email;
    const name = authUser.name ?? null;

    if (!auth0Id || !email) {
      return NextResponse.json(
        { error: "Invalid Auth0 user data" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: {
        auth0Id: auth0Id,
      },
      update: {
        email,
        name,
        updatedAt: new Date(),
      },
      create: {
        auth0Id,
        email,
        name,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/user sync error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}