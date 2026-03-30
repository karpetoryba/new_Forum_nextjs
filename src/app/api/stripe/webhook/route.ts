import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getPlanByPriceId, getIntervalByPriceId } from "@/lib/subscription/plans";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription" || !session.subscription || !session.customer) {
          break;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const priceId = stripeSubscription.items.data[0].price.id;
        const plan = getPlanByPriceId(priceId);
        const interval = getIntervalByPriceId(priceId);

        if (!plan || !interval) break;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: session.customer as string },
        });

        if (!user) break;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            plan,
            status: "ACTIVE",
            billingInterval: interval,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
          },
          update: {
            plan,
            status: "ACTIVE",
            billingInterval: interval,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
            canceledAt: null,
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: "ACTIVE",
            stripeCurrentPeriodEnd: new Date(
              stripeSubscription.current_period_end * 1000
            ),
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "CANCELED",
            canceledAt: new Date(),
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanByPriceId(priceId);
        const interval = getIntervalByPriceId(priceId);

        if (!plan || !interval) break;

        const status = subscription.cancel_at_period_end
          ? "CANCELED"
          : subscription.status === "active"
            ? "ACTIVE"
            : "PAST_DUE";

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan,
            status,
            billingInterval: interval,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        break;
      }
    }
  } catch (error) {
    console.error("[stripe_webhook]", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
