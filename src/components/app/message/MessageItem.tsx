import { Message } from "@/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageService from "@/services/message.service";
import { Trash, Edit2, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

type MessageWithUser = Message & {
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
};

interface MessageItemProps {
  message: MessageWithUser;
  currentUserId?: string;
}

export default function MessageItem({ message, currentUserId }: MessageItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const isOwner = message.userId === currentUserId;

  // Mettre à jour editContent si le message change
  useEffect(() => {
    if (!isEditing) {
      setEditContent(message.content);
    }
  }, [message.content, isEditing]);

  const formattedDate = message.createdAt 
    ? formatDistanceToNow(new Date(message.createdAt), { 
        addSuffix: true,
        locale: fr 
      })
    : "";
  
  // Utiliser l'avatar de l'utilisateur s'il existe, sinon générer un avatar basé sur l'email ou le nom
  const avatarUrl = useMemo(() => {
    if (message.user?.avatar) {
      return message.user.avatar;
    }
    // Générer un avatar unique basé sur l'email ou le nom de l'utilisateur
    const seed = message.user?.email || message.user?.name || message.id || Math.random().toString();
    return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}`;
  }, [message.user?.avatar, message.user?.email, message.user?.name, message.id]);

  // Obtenir le nom d'affichage de l'auteur
  const authorName = useMemo(() => {
    return message.user?.name || message.user?.email || "Utilisateur anonyme";
  }, [message.user?.name, message.user?.email]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!message.id) throw new Error("Message ID is required");
      return await MessageService.deleteMessage(id);
    },
    onSuccess: () => {
      toast.success("Message supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["messages", message.conversationId] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du message");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!message.id) throw new Error("Message ID is required");
      return await MessageService.updateMessage(message.id, content);
    },
    onSuccess: () => {
      toast.success("Message modifié avec succès");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["messages", message.conversationId] });
    },
    onError: () => {
      toast.error("Erreur lors de la modification du message");
    },
  });

  const handleEdit = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== message.content) {
      updateMutation.mutate(editContent);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Avatar de l'utilisateur */}
          <div className="flex-shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Contenu du message */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-foreground">
                {authorName}
              </p>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full"
                  disabled={updateMutation.isPending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleSave();
                    } else if (e.key === "Escape") {
                      handleCancel();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMutation.isPending || !editContent.trim()}
                    className="h-7"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Enregistrer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-foreground leading-relaxed">{message.content}</p>
                {formattedDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {formattedDate}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Boutons d'action */}
          {isOwner && !isEditing && (
            <div className="flex-shrink-0 flex gap-1">
              <Button 
                variant="ghost"  
                title="Modifier le message" 
                size="icon" 
                onClick={handleEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost"  
                title="Supprimer le message" 
                size="icon" 
                onClick={() => deleteMutation.mutate(message.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}