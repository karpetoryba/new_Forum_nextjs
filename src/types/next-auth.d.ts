import "next-auth";

export type Role = "USER" | "MODERATOR" | "ADMIN";
export type SubscriptionPlanType = "PREMIUM" | "MAX" | null;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role;
      subscriptionPlan?: SubscriptionPlanType;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role;
    subscriptionPlan?: SubscriptionPlanType;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    subscriptionPlan?: SubscriptionPlanType;
  }
}

