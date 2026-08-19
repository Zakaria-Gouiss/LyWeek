const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

export async function getNotes() {
  const response = await fetch(`${API_URL}${API_PREFIX}/notes`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export async function updateNotes(content) {
  const response = await fetch(`${API_URL}${API_PREFIX}/notes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to save notes");
  }

  return response.json();
}
