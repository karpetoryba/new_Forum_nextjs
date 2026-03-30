import ConversationList from "@/components/app/conversation/ConversationList";

export default function ConversationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5" />

        <div className="relative container mx-auto py-14 md:py-20 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Toutes les{" "}
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                conversations
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explorez toutes nos discussions et trouvez celle qui vous interesse.
            </p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4">
        <ConversationList />
      </div>
    </div>
  );
}
