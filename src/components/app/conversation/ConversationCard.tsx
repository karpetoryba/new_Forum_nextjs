"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import Link from "next/link";
import { Archive, MessageSquare, Edit2, Trash } from "lucide-react";
import ConversationService from "@/services/conversation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
  currentUserId?: string;
}

export default function ConversationCard({
  conversation,
  currentUserId,
}: ConversationCardProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title || "");
  const [editImage, setEditImage] = useState((conversation as any).image || "");
  const isOwner = conversation.userId === currentUserId;

  // Get author display name
  const authorName = useMemo(() => {
    return conversation.user?.name || conversation.user?.email || "Anonymous user";
  }, [conversation.user?.name, conversation.user?.email]);

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ConversationService.archiveConversation(id);
    },
    onSuccess: () => {
      toast.success("Conversation archived successfully");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Error archiving conversation");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ConversationService.deleteConversation(id);
    },
    onSuccess: () => {
      toast.success("Conversation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Error deleting conversation");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { title?: string; image?: string }) => {
      return await ConversationService.updateConversation(conversation.id, data);
    },
    onSuccess: () => {
      toast.success("Conversation updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Error updating conversation");
    },
  });

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    archiveMutation.mutate(conversation.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteMutation.mutate(conversation.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(conversation.title || "");
    setEditImage((conversation as any).image || "");
    setIsEditing(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditTitle(conversation.title || "");
    setEditImage((conversation as any).image || "");
    setIsEditing(false);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim() && (editTitle !== conversation.title || editImage !== (conversation as any).image)) {
      updateMutation.mutate({
        title: editTitle.trim(),
        image: editImage.trim() || undefined,
      });
    } else {
      setIsEditing(false);
    }
  };

  // Generate image based on ID if no image
  const imageUrl = useMemo(() => {
    if ((conversation as any).image) {
      return (conversation as any).image;
    }
    // Use placeholder image with unique seed based on ID
    const seed = conversation.id.slice(-6);
    return `https://picsum.photos/seed/${seed}/400/250`;
  }, [conversation.id]);

  // Generate gradient based on ID if not using placeholder
  const gradientColors = useMemo(() => {
    const colors = [
      "from-purple-500/20 to-violet-500/20",
      "from-violet-500/20 to-indigo-500/20",
      "from-fuchsia-500/20 to-purple-500/20",
      "from-indigo-500/20 to-purple-500/20",
      "from-purple-500/20 to-pink-500/20",
    ];
    const index = parseInt(conversation.id.slice(-1), 16) % colors.length;
    return colors[index];
  }, [conversation.id]);

  const CardContent = (
    <Card className={`${!isEditing ? "cursor-pointer" : ""} hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full border-border/50`}>
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {(conversation as any).image ? (
            <Image
              src={imageUrl}
              alt={conversation.title || "Conversation"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <>
              <Image
                src={imageUrl}
                alt={conversation.title || "Conversation"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-50"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors} mix-blend-overlay flex items-center justify-center`}>
                <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
              </div>
            </>
          )}
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Action buttons */}
          {isOwner && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleEdit}
                    title="Edit conversation"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleArchive}
                    disabled={archiveMutation.isPending}
                    title="Archive conversation"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    title="Delete conversation"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleSave}
                    disabled={updateMutation.isPending || !editTitle.trim()}
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Conversation title"
                className="w-full"
                disabled={updateMutation.isPending}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSave(e as any);
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    handleCancel(e as any);
                  }
                }}
              />
              <Input
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                placeholder="Image URL (optional)"
                type="url"
                className="w-full"
                disabled={updateMutation.isPending}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
              {conversation.title || "Untitled conversation"}
            </h3>
          )}
        </CardHeader>

        <CardFooter className="w-full flex justify-between items-center pt-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              {getRelativeTime(conversation.createdAt)}
            </p>
            <p className="text-xs font-medium text-foreground">
              Par {authorName}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>
              {conversation?.messages.length > 0
                ? `${conversation.messages.length}`
                : "0"}
            </span>
          </div>
        </CardFooter>
      </Card>
  );

  if (isEditing) {
    return CardContent;
  }

  return (
    <Link href={`/conversations/${conversation.id}`}>
      {CardContent}
    </Link>
  );
}
