import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "No active session" },
      { status: 401 },
    );
  }

  return NextResponse.json(session);
}

