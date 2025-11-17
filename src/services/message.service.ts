export async function fetchMessages(params?: { conversationId?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.conversationId) {
    queryParams.append("conversationId", params.conversationId);
   
  }
  const queryString = queryParams.toString();
  const url = queryString ? `/api/messages?${queryString}` : "/api/messages";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
}

async function createMessage(content: string, conversationId: string) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, conversationId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create message");
  }
  return response.json();
}

async function updateMessage(id: string, content: string) {
  const response = await fetch(`/api/messages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Failed to update message");
  }
  return response.json();
}

async function deleteMessage(id: string) {
  const response = await fetch(`/api/messages/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete message");
  }
  return response.json(); 
}

const MessageService = {
  fetchMessages,
  createMessage,
  updateMessage,
  deleteMessage,
};

export default MessageService;



