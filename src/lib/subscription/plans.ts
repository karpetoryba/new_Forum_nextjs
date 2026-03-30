export const PLANS = {
  PREMIUM: {
    name: "Premium",
    description: "Pour les utilisateurs actifs",
    features: [
      "Conversations illimitees",
      "Messages prioritaires",
      "Badge Premium",
    ],
    prices: {
      month: {
        id: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
        amount: 9.99,
      },
      year: {
        id: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
        amount: 99.99,
      },
    },
    rank: 1,
  },
  MAX: {
    name: "Max",
    description: "Pour les power users",
    features: [
      "Tout Premium inclus",
      "Acces anticipé aux fonctionnalités",
      "Support prioritaire",
      "Badge Max exclusif",
    ],
    prices: {
      month: {
        id: process.env.NEXT_PUBLIC_STRIPE_MAX_MONTHLY_PRICE_ID!,
        amount: 19.99,
      },
      year: {
        id: process.env.NEXT_PUBLIC_STRIPE_MAX_ANNUAL_PRICE_ID!,
        amount: 199.99,
      },
    },
    rank: 2,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type BillingInterval = "month" | "year";

export function getPlanByPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.prices.month.id === priceId || plan.prices.year.id === priceId) {
      return key as PlanKey;
    }
  }
  return null;
}

export function getIntervalByPriceId(priceId: string): BillingInterval | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.prices.month.id === priceId) return "month";
    if (plan.prices.year.id === priceId) return "year";
  }
  return null;
}
