import { NextResponse } from "next/server";
import { AuthError } from "next-auth";

import { signOut } from "@/lib/auth/auth";

export async function POST(request: Request) {
  try {
    const response = await signOut({
      redirect: false,
      request,
    });

    if (response instanceof Response) {
      return response;
    }

    return NextResponse.json({ message: "Signed out successfully" });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Failed to sign out" },
        { status: 401 },
      );
    }

    console.error("[auth_signout_POST]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

