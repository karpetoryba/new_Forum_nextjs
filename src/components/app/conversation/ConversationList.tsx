"use client";

import ConversationService from "@/services/conversation.service";
import { useQuery } from "@tanstack/react-query";
import ConversationCard from "./ConversationCard";
import { ConversationWithExtend } from "@/types/conversation.type";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationList() {
  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      return await ConversationService.fetchConversations();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1>Liste des conversations</h1>
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
        <h1>Liste des conversations</h1>
        <p className="text-destructive mt-4">
          Erreur lors de la récupération des conversations
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1>Liste des conversations</h1>

      {!conversations || conversations.length === 0 ? (
        <p className="mt-4">Aucune conversation disponible.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
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
