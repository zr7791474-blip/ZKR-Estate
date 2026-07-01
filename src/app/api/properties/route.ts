import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { propertySchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get("agentId");
  const where: any = {};
  if (agentId) where.agentId = agentId;

  const properties = await prisma.property.findMany({
    where,
    include: { agent: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "AGENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const images = parsed.data.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const property = await prisma.property.create({
      data: {
        ...parsed.data,
        images,
        agentId: (session.user as any).id
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}