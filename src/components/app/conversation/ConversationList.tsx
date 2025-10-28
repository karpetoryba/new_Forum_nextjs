"use client";

import ConversationService from "@/services/conversation.service";
import { useEffect, useState } from "react";
import ConversationCard from "./ConversationCard";
import { ConversationWithExtend } from "@/types/conversation.type";

export default function ConversationList() {
  const [conversations, setConversations] = useState<ConversationWithExtend[]>(
    []
  );

  useEffect(() => {
    getAllConversations();
  }, []);

  const getAllConversations = async () => {
    try {
      const data = await ConversationService.fetchConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1>Liste des conversations</h1>

      {conversations.length === 0 ? (
        <p>Aucune conversation disponible.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {conversations.map((conversation) => (
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
