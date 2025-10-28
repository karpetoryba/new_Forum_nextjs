import ConversationForm from "@/components/app/conversation/ConversationForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewConversationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Nouvelle conversation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Créez une nouvelle conversation et partagez vos idées avec la communauté.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/conversations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux conversations
            </Link>
          </Button>
        </div>

        {/* Form */}
        <ConversationForm />
      </div>
    </div>
  );
}

