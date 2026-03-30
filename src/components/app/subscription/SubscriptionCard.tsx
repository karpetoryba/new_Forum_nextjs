"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Crown, Zap, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SubscriptionData = {
  plan: "PREMIUM" | "MAX";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE";
  billingInterval: string;
  stripeCurrentPeriodEnd: string;
  canceledAt: string | null;
} | null;

export default function SubscriptionCard({
  subscription,
}: {
  subscription: SubscriptionData;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirm("Etes-vous sur de vouloir annuler votre abonnement ? Vous conserverez l'acces jusqu'a la fin de la periode en cours.")) {
      return;
    }

    setLoading("cancel");
    try {
      const response = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success("Abonnement annule");
      await update();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoading(null);
    }
  };

  const handleUpgrade = async () => {
    setLoading("upgrade");
    try {
      const response = await fetch("/api/stripe/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interval: subscription?.billingInterval || "month",
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success("Abonnement mis a jour vers Max !");
      await update();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoading(null);
    }
  };

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            Vous n&apos;avez pas encore d&apos;abonnement actif.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Decouvrez nos offres Premium et Max pour profiter de fonctionnalites exclusives.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/pricing">Voir les offres</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const isPremium = subscription.plan === "PREMIUM";
  const isCanceled = subscription.status === "CANCELED";
  const periodEnd = new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString(
    "fr-FR",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isPremium ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <Zap className="h-5 w-5 text-purple-500" />
            )}
            Abonnement {subscription.plan === "PREMIUM" ? "Premium" : "Max"}
          </CardTitle>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              isCanceled
                ? "bg-red-500/10 text-red-700 dark:text-red-400"
                : "bg-green-500/10 text-green-700 dark:text-green-400"
            }`}
          >
            {isCanceled ? "Annule" : "Actif"}
          </span>
        </div>
        <CardDescription>
          Facturation{" "}
          {subscription.billingInterval === "month" ? "mensuelle" : "annuelle"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {isCanceled && (
          <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Votre abonnement a ete annule. Vous conservez l&apos;acces jusqu&apos;au{" "}
              {periodEnd}.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm text-muted-foreground">
            {isCanceled ? "Acces jusqu'au" : "Prochain renouvellement"}
          </span>
          <span className="text-sm font-medium">{periodEnd}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        {isPremium && !isCanceled && (
          <Button
            onClick={handleUpgrade}
            disabled={loading !== null}
            variant="default"
          >
            {loading === "upgrade" ? "Mise a jour..." : "Passer a Max"}
          </Button>
        )}

        {!isCanceled && (
          <Button
            onClick={handleCancel}
            disabled={loading !== null}
            variant="destructive"
          >
            {loading === "cancel" ? "Annulation..." : "Annuler l'abonnement"}
          </Button>
        )}

        {isCanceled && (
          <Button asChild>
            <Link href="/pricing">Se reabonner</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
