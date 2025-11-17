import { Message } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Button } from "@/components/ui/button";
import MessageService from "@/services/message.service";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useMemo } from "react";

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
}

export default function MessageItem({ message, currentUserId }: MessageItemProps) {
  const queryClient = useQueryClient();
  const formattedDate = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { 
        addSuffix: true,
        locale: fr 
      })
    : "";
  
  // Générer un avatar unique basé sur l'ID du message
  const avatarUrl = useMemo(() => {
    // Utiliser l'API DiceBear pour générer différents avatars
    // Chaque ID de message donnera un avatar unique
    const seed = message.id || Math.random().toString();
    // Utiliser le style "personas" de DiceBear
    return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
  }, [message.id]);

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      if (!message.id) throw new Error("Message ID is required");
      return await MessageService.deleteMessage(id);
    },
    onSuccess: () => {
      toast.success("Message supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["messages", message.conversationId] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du message");
    },
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Avatar de l'utilisateur */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Contenu du message */}
          <div className="flex-1 min-w-0">
            <p className="text-foreground leading-relaxed">{message.content}</p>
            {formattedDate && (
              <p className="text-xs text-muted-foreground mt-2">
                {formattedDate}
              </p>
            )}
          </div>

          {/* Bouton de suppression */}
          {message.userId === currentUserId && (
            <div className="flex-shrink-0">
              <Button 
                variant="ghost"  
                title="Supprimer le message" 
                size="icon" 
                onClick={() => mutation.mutate(message.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}