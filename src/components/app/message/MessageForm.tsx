"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageService from "@/services/message.service";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface MessageFormProps {
    conversationId?: string;
    onCreateMessage?: (content: string) => void;
}

interface FormData {
    content: string;
}

export default function MessageForm({
    conversationId,
    onCreateMessage,
}: MessageFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormData>();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (!conversationId) throw new Error("Conversation ID is required");
            return await MessageService.createMessage(data.content, conversationId);
        },
        onSuccess: () => {
            toast.success("Message envoyé avec succès");
            reset();
            // Инвалидируем кеш сообщений, чтобы обновить список
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
            // Вызываем callback, если он есть
            if (onCreateMessage) {
                // Callback может быть использован для других действий
            }
        },
        onError: () => {
            toast.error("Erreur lors de l'envoi du message");
        },
    });

    const onSubmit = async (data: FormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="border-t pt-4 mt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                <Input
                    {...register("content", {
                        required: "Le message ne peut pas être vide",
                        minLength: {
                            value: 1,
                            message: "Le message est requis",
                        },
                    })}
                    type="text"
                    placeholder="Écrire un message..."
                    className="flex-1"
                    disabled={mutation.isPending || isSubmitting}
                />
                <Button
                    type="submit"
                    disabled={mutation.isPending || isSubmitting}
                    size="icon"
                >
                    {mutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Envoyer</span>
                </Button>
            </form>
        </div>
    );
}