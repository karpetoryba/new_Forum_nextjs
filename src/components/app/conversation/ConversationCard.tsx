"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import Link from "next/link";
import { Archive, MessageSquare } from "lucide-react";
import ConversationService from "@/services/conversation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useMemo } from "react";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
  currentUserId?: string;
}

export default function ConversationCard({
  conversation,
  currentUserId,
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
    e.preventDefault();
    e.stopPropagation();
    archiveMutation.mutate(conversation.id);
  };

  // Генерируем изображение на основе ID если нет image
  const imageUrl = useMemo(() => {
    if ((conversation as any).image) {
      return (conversation as any).image;
    }
    // Используем placeholder изображение с уникальным seed на основе ID
    const seed = conversation.id.slice(-6);
    return `https://picsum.photos/seed/${seed}/400/250`;
  }, [conversation.id]);

  // Генерируем градиент на основе ID если не используем placeholder
  const gradientColors = useMemo(() => {
    const colors = [
      "from-blue-500/20 to-purple-500/20",
      "from-green-500/20 to-teal-500/20",
      "from-pink-500/20 to-rose-500/20",
      "from-orange-500/20 to-amber-500/20",
      "from-indigo-500/20 to-blue-500/20",
    ];
    const index = parseInt(conversation.id.slice(-1), 16) % colors.length;
    return colors[index];
  }, [conversation.id]);

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden h-full">
        {/* Изображение */}
        <div className="relative h-48 w-full overflow-hidden">
          {(conversation as any).image ? (
            <Image
              src={imageUrl}
              alt={conversation.title || "Conversation"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <>
              <Image
                src={imageUrl}
                alt={conversation.title || "Conversation"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-50"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} mix-blend-overlay flex items-center justify-center`}>
                <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
              </div>
            </>
          )}
          {/* Градиентный overlay для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Кнопка архивации */}
          {conversation.userId === currentUserId && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              title="Archiver la conversation"
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
            {conversation.title || "Conversation sans titre"}
          </h3>
        </CardHeader>

        <CardFooter className="w-full flex justify-between items-center pt-2">
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(conversation.createdAt)}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>
              {conversation?.messages.length > 0
                ? `${conversation.messages.length}`
                : "0"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
