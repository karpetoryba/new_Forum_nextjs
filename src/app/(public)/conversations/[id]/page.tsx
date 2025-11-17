import MessageList from "@/components/app/message/MessageList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface ConversationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({ params }: ConversationDetailPageProps) {
  const { id } = await params;
  console.log("Conversation ID:", id);
  const response = await fetch(
    `http://localhost:3000/api/conversations/${id}`,
    { cache: "no-store" }
  );
  
  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }
  
  const conversation = await response.json();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8 px-4">
        {/* Header with title and back button */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/conversations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">{conversation?.title}</h1>
        </div>

        {/* Messages container with proper height */}
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="h-[calc(100vh-250px)] min-h-[600px] p-4">
            <MessageList conversationId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
