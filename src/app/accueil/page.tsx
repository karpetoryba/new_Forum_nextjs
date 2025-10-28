import ConversationCarousel from "@/components/app/conversation/ConversationCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AccueilPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez nos discussions et échangez vos idées.
            <br />
            Partagez vos pensées et participez à la conversation.
          </p>
          <div className="pt-4">
            <Button size="lg" asChild>
              <Link href="/conversations/new">
                <Plus className="h-5 w-5 mr-2" />
                Créer une conversation
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <section className="mb-12 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Conversations en vedette
          </h2>
          <ConversationCarousel autoScrollInterval={6000} />
        </div>
      </section>
    </div>
  );
}

