import { NextRequest, NextResponse } from "next/server";
import { strapiAPI } from "@/lib/strapi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const result = await strapiAPI.getClassOccurrences({
      startDate,
      endDate,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classes API error:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
