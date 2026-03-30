import ConversationCarousel from "@/components/app/conversation/ConversationCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Plus, Sparkles } from "lucide-react";

export default function AccueilPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5" />
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />

        <div className="relative container mx-auto py-20 md:py-28 lg:py-36 px-4">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Bienvenue sur le Forum
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Partagez vos{" "}
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
                idees
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Decouvrez nos discussions, echangez avec la communaute et
              participez a des conversations enrichissantes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="gap-2 px-8">
                <Link href="/conversations/new">
                  <Plus className="h-5 w-5" />
                  Creer une conversation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2 px-8">
                <Link href="/conversations">
                  Explorer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Conversations en vedette
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Les discussions les plus recentes de notre communaute.
            </p>
          </div>
          <ConversationCarousel autoScrollInterval={6000} />
        </div>
      </section>
    </div>
  );
}
