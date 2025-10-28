"use client";

import ConversationService from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./ConversationCard";
import { ConversationWithExtend } from "@/types/conversation.type";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";
import { useState } from "react";

export default function ConversationList() {
  const [showArchived, setShowArchived] = useState(false);

  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ["conversations", showArchived],
    queryFn: async () => {
      return await ConversationService.fetchConversations(showArchived);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1>
            {showArchived
              ? "Conversations archivées"
              : "Liste des conversations"}
          </h1>
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
        <div className="flex flex-col gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1>
            {showArchived
              ? "Conversations archivées"
              : "Liste des conversations"}
          </h1>
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
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1>
          {showArchived
            ? "Conversations archivées"
            : "Liste des conversations"}
        </h1>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
