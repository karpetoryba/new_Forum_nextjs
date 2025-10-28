import { Message } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Button } from "@/components/ui/button";
import MessageService from "@/services/message.service";
import { Trash } from "lucide-react";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const formattedDate = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { 
        addSuffix: true,
        locale: fr 
      })
    : "";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <p className="text-foreground leading-relaxed">{message.content}</p>
        {formattedDate && (
          <p className="text-xs text-muted-foreground mt-2">
            {formattedDate}
          </p>
        )}
        <Button variant="ghost"  title="Supprimer le message" size="icon" onClick={() => MessageService.deleteMessage(message.id)}>
            <Trash className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}