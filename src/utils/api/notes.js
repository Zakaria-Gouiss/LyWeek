const API_URL = import.meta.env.VITE_API_URL;;

export async function getNotes() {
  const response = await fetch(`${API_URL}/notes`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export async function updateNotes(content) {
  const response = await fetch(`${API_URL}/notes`, {
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
