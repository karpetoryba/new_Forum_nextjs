import { MessageSquare, Users, Heart, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            À propos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Découvrez notre plateforme de discussion et d'échange d'idées.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* About Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Qui sommes-nous ?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Bienvenue sur notre plateforme de blog et de discussions ! 
                Nous avons créé cet espace pour permettre à chacun de partager 
                ses idées, d'échanger des opinions et de participer à des conversations enrichissantes.
              </p>
              <p>
                Notre mission est de favoriser les échanges constructifs et de 
                créer une communauté où chaque voix compte. Que vous soyez 
                passionné de technologie, d'art, de science ou de culture, 
                vous trouverez ici un espace pour exprimer vos pensées.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Nos fonctionnalités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <CardTitle>Discussions ouvertes</CardTitle>
                  </div>
                  <CardDescription>
                    Créez et participez à des conversations sur les sujets qui vous passionnent.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6 text-primary" />
                    <CardTitle>Communauté active</CardTitle>
                  </div>
                  <CardDescription>
                    Rejoignez une communauté de personnes curieuses et engagées.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle>Interface moderne</CardTitle>
                  </div>
                  <CardDescription>
                    Profitez d'une expérience utilisateur fluide et intuitive.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-6 w-6 text-primary" />
                    <CardTitle>Conçu avec passion</CardTitle>
                  </div>
                  <CardDescription>
                    Une plateforme développée avec soin pour offrir le meilleur service.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-6 pb-16">
            <h2 className="text-3xl font-bold">Nous contacter</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Vous avez des questions, des suggestions ou des commentaires ? 
                  N'hésitez pas à nous faire part de vos retours. Nous sommes toujours 
                  à l'écoute pour améliorer votre expérience.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

