async function fetchConversations(archived?: boolean) {
  const url = archived
    ? "/api/conversations?archived=true"
    : "/api/conversations";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }
  return response.json();
}

async function fetchConversationById(id: string) {
  const response = await fetch(`/api/conversations/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch conversation");
  }
  return response.json();
}
async function archiveConversation(id: string) {
  const response = await fetch(`/api/conversations/${id}/archive`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to archive conversation");
  }
  return response.json();
}

async function createConversation(data: { title: string; image?: string }) {
  const response = await fetch("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }
  return response.json();
}

async function updateConversation(id: string, data: { title?: string; image?: string }) {
  const response = await fetch(`/api/conversations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update conversation");
  }
  return response.json();
}

async function deleteConversation(id: string) {
  const response = await fetch(`/api/conversations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
  return response.json();
}

const ConversationService = {
  fetchConversations,
  fetchConversationById,
  archiveConversation,
  createConversation,
  updateConversation,
  deleteConversation,
};

export default ConversationService;

