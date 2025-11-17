import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;

  const [conversationCount, messageCount, recentConversations] = await Promise.all([
    prisma.conversation.count({
      where: { userId, deletedAt: null },
    }),
    prisma.message.count({
      where: { userId, deletedAt: null },
    }),
    prisma.conversation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        createdAt: true,
        archivedAt: true,
      },
    }),
  ]);

  const displayName = session.user.name || session.user.email || "Mon compte";

  return (
    <div className="container mx-auto max-w-4xl py-12 space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{displayName}</h1>
        {session.user.email && (
          <p className="text-muted-foreground text-sm">{session.user.email}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vos statistiques</CardTitle>
            <CardDescription>
              Un aperçu rapide de votre activité sur le forum.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Conversations créées</span>
              <span className="text-2xl font-semibold">{conversationCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm text-muted-foreground">Messages envoyés</span>
              <span className="text-2xl font-semibold">{messageCount}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/conversations/new">Nouvelle conversation</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversations récentes</CardTitle>
            <CardDescription>
              Les trois dernières discussions que vous avez lancées.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vous n&apos;avez pas encore créé de conversation.
              </p>
            ) : (
              recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="rounded-lg border p-3 transition hover:border-primary"
                >
                  <Link href={`/conversations/${conversation.id}`} className="font-medium">
                    {conversation.title || "Conversation sans titre"}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.archivedAt
                      ? "Archivée"
                      : `Créée le ${conversation.createdAt.toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Envie de participer davantage ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Démarrez une nouvelle discussion pour partager vos idées avec la communauté, ou
            rejoignez une conversation existante pour continuer l&apos;échange.
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/conversations">Voir toutes les conversations</Link>
          </Button>
          <Button asChild>
            <Link href="/conversations/new">Créer une conversation</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
