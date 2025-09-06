import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(now.getDate() + 14);

    const classes = await prisma.classOccurrence.findMany({
      where: {
        date: {
          gte: now,
          lte: twoWeeksFromNow,
        },
        isActive: true,
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
