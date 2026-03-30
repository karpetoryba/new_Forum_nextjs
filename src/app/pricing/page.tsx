"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

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
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
        <div className="absolute top-10 left-1/3 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-20 right-1/3 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative container mx-auto max-w-5xl py-16 md:py-24 px-4">
          <div className="text-center space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Abonnements
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Choisissez votre{" "}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                abonnement
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Debloquez des fonctionnalites exclusives et profitez d&apos;une experience premium sur le forum.
            </p>

            <div className="inline-flex items-center rounded-full border border-border/50 bg-card p-1 mt-6 shadow-sm">
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  interval === "month"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setInterval("month")}
              >
                Mensuel
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  interval === "year"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setInterval("year")}
              >
                Annuel
                <span className="ml-1.5 text-xs text-emerald-500 font-semibold">
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
                  className={`relative flex flex-col border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 ${
                    plan.popular
                      ? "border-primary/50 shadow-lg shadow-purple-500/10 bg-gradient-to-b from-primary/[0.03] to-transparent"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                        Populaire
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pt-8">
                    <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${
                      plan.popular
                        ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white"
                        : "bg-primary/10"
                    }`}>
                      <Icon className={`h-7 w-7 ${plan.popular ? "text-white" : "text-primary"}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    <div className="text-center">
                      <span className="text-5xl font-bold tracking-tight">{price.toFixed(2)}&euro;</span>
                      <span className="text-muted-foreground ml-1">
                        /{interval === "month" ? "mois" : "an"}
                      </span>
                    </div>

                    <ul className="space-y-3.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-8">
                    <Button
                      className={`w-full ${plan.popular ? "shadow-md" : ""}`}
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
      </div>
    </div>
  );
}
