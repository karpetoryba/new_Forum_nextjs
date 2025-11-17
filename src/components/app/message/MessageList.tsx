"use client";
import { Message } from "@/generated/prisma";
//on affiche la liste des messages d'une conversation
import MessageService from "@/services/message.service";
import MessageItem from "./MessageItem";
import MessageForm from "./MessageForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface MessageListProps {
  conversationId?: string;
}
export default function MessageList({ conversationId }: MessageListProps) {
  const { data: session, status } = useSession();
  const isSessionLoading = status === "loading";
  const isAuthenticated = Boolean(session?.user);

  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return await MessageService.fetchMessages({ conversationId });
    },
  });

  const createMessage = async (content: string) => {
    if (!conversationId) return;

    try {
      await MessageService.createMessage(content, conversationId);
    } catch (error) {
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
              <MessageItem
                key={message.id}
                message={message}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pb-4">
        {isSessionLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : isAuthenticated ? (
          <MessageForm
            conversationId={conversationId}
            onCreateMessage={createMessage}
          />
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <h3 className="font-medium">Connectez-vous pour répondre</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Créez un compte ou connectez-vous pour participer à la conversation.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/signup">Créer un compte</Link>
              </Button>
              <Button asChild>
                <Link href="/signin">Se connecter</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
