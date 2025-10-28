"use client";
import { Message } from "@/generated/prisma";
//on affiche la liste des messages d'une conversation
import MessageService from "@/services/message.service";
import { useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import MessageForm from "./MessageForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
interface MessageListProps {
  conversationId?: string;
}
export default function MessageList({ conversationId }: MessageListProps) {
 //param 
 //state pour les messages
const { data: messages, isLoading, isError } = useQuery({
  queryKey: ["messages", conversationId],
  queryFn: async () => {
    // Задержка для тестирования скелетона (удалить после тестирования)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 секунды задержки
    return await MessageService.fetchMessages({ conversationId });
  },
});
 



const createMessage = async (content: string) => {
  if (!conversationId) return;
  
  try {
    const data = await MessageService.createMessage(content, conversationId);
    console.log("create data", data);

  } 
  catch (error) {
    console.error("Error creating message:", error);
  }
};
if (isLoading) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
if (isError) {
  return <div className="flex flex-col h-full"><p>Erreur lors de la récupération des messages</p></div>;
}
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun message disponible.</p>

            <p className="text-sm mt-2">Soyez le premier à écrire un message !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages?.map((message: Message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      <div className="pb-4">
        <MessageForm conversationId={conversationId} onCreateMessage={createMessage}/>
      </div>
    </div>
  );
}
