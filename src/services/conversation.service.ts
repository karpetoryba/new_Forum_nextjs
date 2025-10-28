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

const ConversationService = {
  fetchConversations,
  fetchConversationById,
  archiveConversation,
};

export default ConversationService;

