import { NextRequest, NextResponse } from "next/server";
import { strapiAPI } from "@/lib/strapi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Login with Strapi
    const result = await strapiAPI.login({
      identifier: email,
      password,
    });

    return NextResponse.json({
      jwt: result.jwt,
      user: result.user,
    });
  } catch (error: unknown) {
    console.error("Login error:", error);

    // Handle Strapi authentication errors
    if (error instanceof Error && error.message.includes("400")) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
