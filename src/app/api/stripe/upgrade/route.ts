import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PLANS, type BillingInterval } from "@/lib/subscription/plans";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interval } = (await request.json()) as { interval: BillingInterval };

    if (!["month", "year"].includes(interval)) {
      return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription || subscription.status !== "ACTIVE") {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    if (subscription.plan !== "PREMIUM") {
      return NextResponse.json(
        { error: "Only Premium users can upgrade to Max" },
        { status: 400 }
      );
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const itemId = stripeSubscription.items.data[0].id;

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: itemId,
          price: PLANS.MAX.prices[interval].id,
        },
      ],
      proration_behavior: "create_prorations",
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: "MAX",
        stripePriceId: PLANS.MAX.prices[interval].id,
        billingInterval: interval,
      },
    });

    return NextResponse.json({ message: "Upgraded to Max" });
  } catch (error) {
    console.error("[stripe_upgrade]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
