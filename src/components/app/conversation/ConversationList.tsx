"use client";

import ConversationService from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./ConversationCard";
import { ConversationWithExtend } from "@/types/conversation.type";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, PlusCircle, LogIn } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ConversationList() {
  const [showArchived, setShowArchived] = useState(false);
  const { data: session, status } = useSession();
  const isSessionLoading = status === "loading";
  const isAuthenticated = Boolean(session?.user);

  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ["conversations", showArchived],
    queryFn: async () => {
      return await ConversationService.fetchConversations(showArchived);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto pb-16 md:pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {showArchived
              ? "Conversations archivées"
              : "Toutes les conversations"}
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className="gap-2"
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="h-4 w-4" />
                Voir les conversations actives
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                Voir les conversations archivées
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto pb-16 md:pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {showArchived
              ? "Conversations archivées"
              : "Toutes les conversations"}
          </h2>
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className="gap-2"
          >
            {showArchived ? (
              <>
                <ArchiveRestore className="h-4 w-4" />
                Voir les conversations actives
              </>
            ) : (
              <>
                <Archive className="h-4 w-4" />
                Voir les conversations archivées
              </>
            )}
          </Button>
        </div>
        <p className="text-destructive mt-4">
          Erreur lors de la récupération des conversations
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-16 md:pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {showArchived
            ? "Conversations archivées"
            : "Toutes les conversations"}
        </h2>
        <Button
          variant="outline"
          onClick={() => setShowArchived(!showArchived)}
          className="gap-2"
        >
          {showArchived ? (
            <>
              <ArchiveRestore className="h-4 w-4" />
              Voir les conversations actives
            </>
          ) : (
            <>
              <Archive className="h-4 w-4" />
              Voir les conversations archivées
            </>
          )}
        </Button>
      </div>

      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {isSessionLoading ? (
          <div className="h-10 w-full animate-pulse rounded-md bg-muted sm:w-64" />
        ) : isAuthenticated ? (
          <>
            <p className="text-sm text-muted-foreground">
              Prêt(e) à démarrer une nouvelle discussion ?
            </p>
            <Button asChild className="w-full sm:w-auto gap-2">
              <Link href="/conversations/new">
                <PlusCircle className="h-4 w-4" />
                Nouvelle conversation
              </Link>
            </Button>
          </>
        ) : (
          <div className="flex w-full flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour lancer une conversation ou participer aux discussions.
            </p>
            <Button asChild variant="secondary" className="w-full sm:w-auto gap-2">
              <Link href="/signin">
                <LogIn className="h-4 w-4" />
                Se connecter
              </Link>
            </Button>
          </div>
        )}
      </div>

      {!conversations || conversations.length === 0 ? (
        <p className="mt-4">
          {showArchived
            ? "Aucune conversation archivée."
            : "Aucune conversation disponible."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {(conversations as ConversationWithExtend[]).map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
