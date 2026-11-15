const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

async function requestLinks(path = "", options = {}) {
  const response = await fetch(`${API_URL}${API_PREFIX}/links${path}`, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || "Failed to save links");
  }

  return response.json();
}

export function getLinks() {
  return requestLinks();
}

export function createLink(link) {
  return requestLinks("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(link),
  });
}

export function updateLink(linkId, link) {
  return requestLinks(`/${linkId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(link),
  });
}

export function deleteLink(linkId) {
  return requestLinks(`/${linkId}`, { method: "DELETE" });
}
