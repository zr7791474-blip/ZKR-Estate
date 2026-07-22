import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");

  let where: any;
  if (scope === "all" && userRole === "ADMIN") {
    where = {};
  } else if (userRole === "AGENT" || userRole === "ADMIN") {
    where = { property: { agentId: userId } };
  } else {
    where = { userId };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      property: {
        select: { id: true, title: true, city: true, images: true },
        include: { agent: { select: { id: true, name: true } } }
      }
    },
    orderBy: { date: "asc" }
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(parsed.data.date),
        notes: parsed.data.notes,
        userId: (session.user as any).id,
        propertyId: parsed.data.propertyId
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true } }
      }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id, status } = await request.json();
    if (!id || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}