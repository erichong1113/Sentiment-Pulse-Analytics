// Single source of truth for talking to the backend. The Zawadi RAG chat is
// the only surface with a finalized contract today; the market and sentiment
// endpoints below are wired but will start returning data once the backend pod
// ships them (see contracts.md handoff). Until then the pages fall back to
// empty states, the same way Zawadi degrades when its endpoints 401.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// JWT pulled from localStorage when present. Requests work anonymously where
// the backend allows it; auth-only endpoints simply return non-ok and the
// caller renders an empty state.
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
