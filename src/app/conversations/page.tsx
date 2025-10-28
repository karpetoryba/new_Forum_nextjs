import ConversationList from "@/components/app/conversation/ConversationList";

export default function ConversationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Toutes les conversations
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explorez toutes nos discussions et trouvez celle qui vous intéresse.
          </p>
        </div>
      </div>

      {/* Conversations List */}
      <ConversationList />
    </div>
  );
}

