"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Crown, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    key: "PREMIUM" as const,
    name: "Premium",
    description: "Pour les utilisateurs actifs",
    icon: Crown,
    features: [
      "Conversations illimitees",
      "Messages prioritaires",
      "Badge Premium",
    ],
    prices: {
      month: 9.99,
      year: 99.99,
    },
  },
  {
    key: "MAX" as const,
    name: "Max",
    description: "Pour les power users",
    icon: Zap,
    popular: true,
    features: [
      "Tout Premium inclus",
      "Acces anticipe aux fonctionnalites",
      "Support prioritaire",
      "Badge Max exclusif",
    ],
    prices: {
      month: 19.99,
      year: 199.99,
    },
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: "PREMIUM" | "MAX") => {
    if (!session?.user) {
      router.push("/signin?callbackUrl=/pricing");
      return;
    }

    setLoading(plan);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = session?.user?.subscriptionPlan;

  return (
    <div className="container mx-auto max-w-5xl py-16 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Choisissez votre abonnement
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Debloquez des fonctionnalites exclusives et profitez d&apos;une experience premium sur le forum.
        </p>

        <div className="inline-flex items-center rounded-lg border p-1 mt-6">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === "month"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setInterval("month")}
          >
            Mensuel
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === "year"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setInterval("year")}
          >
            Annuel
            <span className="ml-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
              -17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan) => {
          const price = plan.prices[interval];
          const isCurrentPlan = currentPlan === plan.key;
          const Icon = plan.icon;

          return (
            <Card
              key={plan.key}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Populaire
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">{price.toFixed(2)}&euro;</span>
                  <span className="text-muted-foreground">
                    /{interval === "month" ? "mois" : "an"}
                  </span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  disabled={!!loading || isCurrentPlan}
                  onClick={() => handleSubscribe(plan.key)}
                >
                  {loading === plan.key
                    ? "Redirection..."
                    : isCurrentPlan
                      ? "Abonnement actif"
                      : "S'abonner"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
