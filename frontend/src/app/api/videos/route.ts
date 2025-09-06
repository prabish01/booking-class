import { NextRequest, NextResponse } from "next/server";
import { strapiAPI } from "@/lib/strapi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";

    const result = await strapiAPI.getVideos({
      featured: featured || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Videos API error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
