import { Conversation, Message } from "@/generated/prisma";

export interface ConversationWithExtend extends Conversation {
  messages: Message[];
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  } | null;
}
