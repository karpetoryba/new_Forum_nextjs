import { Message } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";

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
      </CardContent>
    </Card>
  );
}