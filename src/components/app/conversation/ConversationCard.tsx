"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import Link from "next/link";
import { Archive } from "lucide-react";
import ConversationService from "@/services/conversation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
}

export default function ConversationCard({
  conversation,
}: ConversationCardProps) {
  const queryClient = useQueryClient();

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ConversationService.archiveConversation(id);
    },
    onSuccess: () => {
      toast.success("Conversation archivée avec succès");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage de la conversation");
    },
  });

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    e.stopPropagation(); // Останавливаем всплытие события
    archiveMutation.mutate(conversation.id);
  };

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-all group relative">
        <CardContent className="pr-12">
          {conversation?.title}
        </CardContent>
        <CardFooter className="w-full flex justify-between">
          <p className="text-sm italic text-zinc-500">
            {getRelativeTime(conversation.createdAt)}
          </p>
          <p className="text-sm italic text-zinc-500">
            {conversation?.messages.length > 0
              ? `Nombre de réponses : ${conversation?.messages.length}`
              : "Aucune réponse"}
          </p>
        </CardFooter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleArchive}
          disabled={archiveMutation.isPending}
          title="Archiver la conversation"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </Card>
    </Link>
  );
}
