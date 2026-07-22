import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { messageSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  const where =
    scope === "all" && userRole === "ADMIN"
      ? {}
      : { OR: [{ senderId: userId }, { receiverId: userId }] };

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
      receiver: { select: { id: true, name: true, avatar: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content: parsed.data.content,
        senderId: (session.user as any).id,
        receiverId: parsed.data.receiverId
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } }
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}