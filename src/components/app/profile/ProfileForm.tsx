"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserService from "@/services/user.service";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo } from "react";
import { updateProfileSchema } from "@/lib/auth/zod";
import type { z } from "zod";

type ProfileFormData = z.infer<typeof updateProfileSchema>;

export default function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", "me"],
    queryFn: UserService.getCurrentUser,
    enabled: !!session?.user?.id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      avatar: user?.avatar || "",
      bio: user?.bio || "",
    },
    values: user
      ? {
          name: user.name || "",
          avatar: user.avatar || "",
          bio: user.bio || "",
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Ne pas envoyer les champs undefined
      const updateData: ProfileFormData = {};
      if (data.name !== undefined && data.name !== "") {
        updateData.name = data.name;
      }
      if (data.avatar !== undefined && data.avatar !== "") {
        updateData.avatar = data.avatar;
      } else if (data.avatar === "") {
        updateData.avatar = "";
      }
      if (data.bio !== undefined) {
        updateData.bio = data.bio || "";
      }
      return await UserService.updateProfile(updateData);
    },
    onSuccess: async (updatedUser) => {
      toast.success("Profil mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      // Mettre à jour la session NextAuth pour refléter les changements
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: updatedUser.name,
        },
      });
    },
    onError: (error: Error) => {
      toast.error("Erreur lors de la mise à jour du profil", {
        description: error.message,
      });
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    mutation.mutate(data);
  };

  // Générer l'URL de l'avatar (utiliser celui de l'utilisateur ou générer un avatar par défaut)
  const avatarUrl = useMemo(() => {
    if (user?.avatar) {
      return user.avatar;
    }
    if (user?.email) {
      const seed = user.email;
      return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
    }
    return `https://api.dicebear.com/7.x/personas/svg?seed=default`;
  }, [user?.avatar, user?.email]);

  if (isLoadingUser) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier votre profil</CardTitle>
        <CardDescription>
          Mettez à jour vos informations personnelles. Ces informations seront visibles par les autres utilisateurs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={96}
                height={96}
                className="object-cover"
                unoptimized
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Aperçu de votre avatar
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Votre nom"
              className="w-full"
              disabled={mutation.isPending || isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Avatar URL Field */}
          <div className="space-y-2">
            <label htmlFor="avatar" className="text-sm font-medium">
              URL de l&apos;avatar
            </label>
            <Input
              {...register("avatar")}
              id="avatar"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              className="w-full"
              disabled={mutation.isPending || isSubmitting}
            />
            {errors.avatar && (
              <p className="text-sm text-destructive">{errors.avatar.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Entrez une URL valide pour votre avatar. Si vous laissez ce champ vide, un avatar sera généré automatiquement.
            </p>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              {...register("bio")}
              id="bio"
              placeholder="Parlez-nous un peu de vous..."
              className="w-full min-h-[100px]"
              disabled={mutation.isPending || isSubmitting}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 500 caractères
            </p>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              className="w-full bg-muted cursor-not-allowed"
              disabled
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              L&apos;email ne peut pas être modifié
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
                Mise à jour en cours...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

