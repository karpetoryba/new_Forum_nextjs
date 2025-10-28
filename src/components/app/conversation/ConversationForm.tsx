"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConversationService from "@/services/conversation.service";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  image?: string;
}

export default function ConversationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await ConversationService.createConversation(data);
    },
    onSuccess: (newConversation) => {
      toast.success("Conversation créée avec succès");
      reset();
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      // Rediriger vers la nouvelle conversation
      router.push(`/conversations/${newConversation.id}`);
    },
    onError: () => {
      toast.error("Erreur lors de la création de la conversation");
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle conversation</CardTitle>
        <CardDescription>
          Partagez vos idées et démarrez une nouvelle discussion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Titre de la conversation *
            </label>
            <Input
              {...register("title", {
                required: "Le titre est requis",
                minLength: {
                  value: 3,
                  message: "Le titre doit contenir au moins 3 caractères",
                },
              })}
              id="title"
              type="text"
              placeholder="Entrez un titre pour votre conversation..."
              className="w-full"
              disabled={mutation.isPending || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              URL de l'image (optionnel)
            </label>
            <Input
              {...register("image")}
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full"
              disabled={mutation.isPending || isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Ajoutez une image pour votre conversation (optionnel)
            </p>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending || isSubmitting}
            className="w-full"
          >
            {mutation.isPending || isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer la conversation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

