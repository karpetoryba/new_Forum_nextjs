import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: {
        plan: true,
        status: true,
        billingInterval: true,
        stripeCurrentPeriodEnd: true,
        canceledAt: true,
      },
    });

    return NextResponse.json({ subscription: subscription ?? null });
  } catch (error) {
    console.error("[stripe_status]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
