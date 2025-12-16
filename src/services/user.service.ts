export async function getCurrentUser() {
  const response = await fetch("/api/users/me");
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

export async function updateProfile(data: {
  name?: string;
  avatar?: string;
  bio?: string;
}) {
  const response = await fetch("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to update profile" }));
    throw new Error(error.error || "Failed to update profile");
  }
  
  return response.json();
}

const UserService = {
  getCurrentUser,
  updateProfile,
};

export default UserService;

