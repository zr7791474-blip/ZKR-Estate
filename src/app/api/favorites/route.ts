import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      property: { include: { agent: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(favorites.map((f) => f.property));
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId required" }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } }
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    await prisma.favorite.create({
      data: { userId, propertyId }
    });
    return NextResponse.json({ favorited: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}