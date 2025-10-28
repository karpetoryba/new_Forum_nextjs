import MessageList from "@/components/app/message/MessageList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default async function ConversationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("Conversation ID:", params.id);
  const response = await fetch(
    `http://localhost:3000/api/conversations/${params.id}`
  );
  const conversation = await response.json();

  return (
    <div className="container mx-auto">
      <h1>{conversation?.title}</h1>
      <Button variant="link" asChild>
        <Link href="http://localhost:3000">
          <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>
    </Button>
    <div>
      {/* on affiche la liste des messages de la conversation */}
      <MessageList conversationId={params.id} />
    </div>
  </div>
);
}
