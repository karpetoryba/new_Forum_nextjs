import { Message } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Button } from "@/components/ui/button";
import MessageService from "@/services/message.service";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
    const queryClient = useQueryClient();
  const formattedDate = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { 
        addSuffix: true,
        locale: fr 
      })
    : "";
    const mutation = useMutation({
        mutationFn: async (
        id: string) => {
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
    const onSubmit = async (data: FormData) => {
        mutation.mutate(message.id);
    };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <p className="text-foreground leading-relaxed">{message.content}</p>
        {formattedDate && (
          <p className="text-xs text-muted-foreground mt-2">
            {formattedDate}
          </p>
        )}
        <Button variant="ghost"  title="Supprimer le message" size="icon" onClick={() => mutation.mutate(message.id)}>
            <Trash className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}