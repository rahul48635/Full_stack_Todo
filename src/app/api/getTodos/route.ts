import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email ?? undefined, 
      },
      select: { todos: true },
    });

    return NextResponse.json(user?.todos);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
