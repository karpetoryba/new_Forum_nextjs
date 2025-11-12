import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

import { signIn } from "@/lib/auth/auth";
import { signInSchema } from "@/lib/auth/zod";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = signInSchema.parse(payload);

    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (response instanceof Response) {
      return response;
    }

    return NextResponse.json({ message: "Signed in successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 },
          );
        default:
          return NextResponse.json(
            { error: "Authentication failed" },
            { status: 401 },
          );
      }
    }

    console.error("[auth_signin_POST]", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

