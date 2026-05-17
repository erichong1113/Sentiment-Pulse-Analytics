"use client";

import { Send, Sparkles } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  KeyboardEvent,
  ReactNode,
} from "react";

// Zawadi is the conversational AI workspace, wired to the backend at
// /api/rag/chat/*. The backend lives at NEXT_PUBLIC_API_URL (default
// http://localhost:5001 per the team convention).
//
// Endpoints used:
//   POST /api/rag/chat/conversations        — create a new chat
//   POST /api/rag/chat/send                 — send message, get RAG response (no auth required)
//   GET  /api/rag/chat/conversations        — list user's chats (auth required)
//   GET  /api/rag/chat/conversations/{id}   — load a chat's messages (auth required)
//   GET  /api/rag/chat/suggested-prompts    — four personalized prompts (auth required)
//
// Auth: JWT pulled from localStorage("access_token") when present. /send works
// anonymously, so the page is usable without auth — list/history endpoints
// simply return empty until auth lands.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type Source = {
  title?: string;
  url?: string;
  source_name?: string;
  published_at?: string;
  // Backend types this as Any, so leave open for fields we don't know yet
  [key: string]: unknown;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  queryType?: string;
};

type Conversation = {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
};

const DEFAULT_PROMPTS = [
  "What's the latest news on Kenya's economy?",
  "Which African countries are best for investment?",
  "Show me recent market news",
];

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ZawadiPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [threadTitle, setThreadTitle] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(DEFAULT_PROMPTS);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial loads
  useEffect(() => {
    void loadConversations();
    void loadSuggestedPrompts();
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function loadConversations() {
    try {
      const res = await fetch(`${API_BASE}/api/rag/chat/conversations`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return; // anonymous user → 401 → silently empty
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }

  async function loadSuggestedPrompts() {
    try {
      const res = await fetch(`${API_BASE}/api/rag/chat/suggested-prompts`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return; // keep defaults
      const data = await res.json();
      if (data.success && Array.isArray(data.prompts) && data.prompts.length > 0) {
        setSuggestedPrompts(data.prompts);
      }
    } catch (err) {
      console.error("Failed to load suggested prompts:", err);
    }
  }

  async function selectConversation(id: number) {
    try {
      const res = await fetch(`${API_BASE}/api/rag/chat/conversations/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        setError("Couldn't load conversation.");
        return;
      }
      const data = await res.json();
      if (data.success && data.conversation) {
        setCurrentConversationId(id);
        setThreadTitle(data.conversation.title || "");
        const loaded: Message[] = Array.isArray(data.conversation.messages)
          ? data.conversation.messages.map((m: Record<string, unknown>) => ({
              role: (m.role as "user" | "assistant") || "assistant",
              content: (m.content as string) || "",
              sources: Array.isArray(m.sources) ? (m.sources as Source[]) : undefined,
              queryType: (m.query_type as string) || undefined,
            }))
          : [];
        setMessages(loaded);
        setError(null);
      }
    } catch (err) {
      setError("Couldn't load conversation.");
      console.error(err);
    }
  }

  async function createConversation() {
    try {
      const res = await fetch(`${API_BASE}/api/rag/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (!res.ok) {
        // Anonymous user → 401. Fall back to client-side new chat — the next
        // /send call will create the conversation server-side.
        setCurrentConversationId(null);
        setMessages([]);
        setThreadTitle("");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCurrentConversationId(data.conversation_id);
        setThreadTitle(data.title || "New Chat");
        setMessages([]);
        void loadConversations();
      }
    } catch (err) {
      setError("Couldn't create conversation.");
      console.error(err);
    }
  }

  async function sendMessage(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    if (message.length > 2000) {
      setError("Message too long (max 2000 characters).");
      return;
    }

    // Optimistically append user message
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/rag/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          conversation_id: currentConversationId,
          message,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(`Backend error (${res.status}): ${errText.slice(0, 300)}`);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to get a response.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "",
          sources: Array.isArray(data.sources) ? data.sources : [],
          queryType: data.query_type,
        },
      ]);

      // First message creates a conversation server-side; capture the id
      const wasNew = currentConversationId === null;
      if (data.conversation_id) {
        setCurrentConversationId(data.conversation_id);
      }
      if (wasNew) {
        void loadConversations();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "unknown error";
      setError(`Network error: ${msg}. Is the backend running at ${API_BASE}?`);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(inputValue);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(inputValue);
    }
  }

  // Sidebar search filter
  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  // Workbench sources come from the most recent assistant message
  const latestSources: Source[] =
    [...messages].reverse().find((m) => m.role === "assistant")?.sources || [];

  return (
    <div className="theme-gold flex min-w-0 flex-1 overflow-hidden bg-bg-0 text-ink-1">
      {/* THREADS panel */}
      <aside className="hidden w-[248px] shrink-0 overflow-y-auto border-r border-rule bg-bg-1 px-3 py-3.5 md:block">
        <button
          onClick={() => void createConversation()}
          className="display mb-3 flex w-full items-center justify-center gap-2 rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-3 py-2 text-[12px] font-semibold text-bg-0"
        >
          ＋ New thread
        </button>

        <input
          type="text"
          placeholder="Search threads…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3 w-full rounded-md border border-rule bg-bg-2 px-3 py-1.5 text-[12px] text-ink-1 placeholder:text-ink-3"
        />

        {filteredConversations.length === 0 ? (
          <div className="px-1 py-2 text-[11px] text-ink-3">
            {conversations.length === 0
              ? "No conversations yet."
              : "No threads match search."}
          </div>
        ) : (
          <ul className="space-y-1">
            {filteredConversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => void selectConversation(c.id)}
                  className={`block w-full cursor-pointer rounded-md border bg-bg-2 px-2.5 py-2 text-left text-[11.5px] hover:bg-bg-3 ${
                    c.id === currentConversationId
                      ? "border-brand shadow-[inset_3px_0_0_var(--brand)]"
                      : "border-rule"
                  }`}
                >
                  <div className="line-clamp-2 text-ink-1">
                    {c.title || "Untitled"}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* CHAT main */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Thread title — display only for now */}
        <div className="flex shrink-0 items-center gap-3 border-b border-rule bg-bg-0 px-5 py-2.5">
          <input
            type="text"
            placeholder="New conversation"
            value={threadTitle}
            onChange={(e) => setThreadTitle(e.target.value)}
            className="flex-1 bg-transparent text-[13px] font-medium text-ink-1 outline-none placeholder:text-ink-3"
          />
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex shrink-0 items-center gap-3 border-b border-neg/40 bg-[rgba(224,69,90,0.06)] px-5 py-2 text-[11px] text-neg">
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-ink-3 hover:text-ink-1"
            >
              dismiss
            </button>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full items-center justify-center text-[12px] text-ink-3">
              Ask Zawadi anything about African markets to start a conversation.
            </div>
          ) : (
            messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[640px] whitespace-pre-wrap rounded-2xl rounded-tr-sm border border-rule bg-bg-2 px-4 py-2.5 text-[13px]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[820px] rounded-2xl rounded-tl-sm border border-rule bg-bg-1 px-4 py-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="display grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] text-[12px] font-bold text-bg-0">
                      Z
                    </span>
                    <span className="display text-[13px] font-semibold">
                      Zawadi
                    </span>
                    {msg.queryType && (
                      <span className="mono ml-auto rounded-sm border border-rule px-1.5 py-0.5 text-[9.5px] text-ink-3">
                        {msg.queryType}
                      </span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap text-[13px] leading-[1.6]">
                    {renderWithCitations(msg.content)}
                  </div>
                </div>
              ),
            )
          )}
          {loading && (
            <div className="max-w-[820px] rounded-2xl rounded-tl-sm border border-rule bg-bg-1 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="display grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] text-[12px] font-bold text-bg-0">
                  Z
                </span>
                <span className="text-[12px] text-ink-3">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion bar */}
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-rule bg-bg-1 px-5 py-2 text-[11px]">
          {suggestedPrompts.length === 0 ? (
            <span className="text-[10.5px] text-ink-3">
              No suggested prompts available.
            </span>
          ) : (
            suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => void sendMessage(p)}
                disabled={loading}
                className="shrink-0 rounded-full border border-rule bg-bg-2 px-3 py-1.5 text-ink-2 hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {p}
              </button>
            ))
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-rule bg-bg-0 p-3"
        >
          <div className="rounded-lg border border-rule bg-bg-1 p-3">
            <textarea
              rows={2}
              maxLength={2000}
              placeholder="Ask Zawadi anything about African markets…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="block w-full resize-none bg-transparent text-[13px] text-ink-1 outline-none placeholder:text-ink-3 disabled:opacity-50"
            />
            <div className="mt-2 flex items-center justify-end gap-3">
              <span className="mono text-[10px] text-ink-3">
                {inputValue.length}/2000
              </span>
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="display flex items-center gap-1.5 rounded-md bg-[linear-gradient(135deg,var(--brand-deep),var(--brand))] px-2.5 py-1.5 text-[11px] text-bg-0 disabled:opacity-50"
              >
                <Send size={11} /> Send
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* WORKBENCH — sources from latest assistant message */}
      <aside className="hidden w-[312px] shrink-0 overflow-y-auto border-l border-rule bg-bg-1 lg:block">
        <div className="border-b border-rule bg-bg-0 px-3 py-2.5">
          <span className="text-[11.5px] font-medium text-ink-1">
            Sources{latestSources.length > 0 ? ` (${latestSources.length})` : ""}
          </span>
        </div>
        <div className="p-3">
          {latestSources.length === 0 ? (
            <div className="text-[10.5px] text-ink-3">
              Sources cited in Zawadi&apos;s response will appear here.
            </div>
          ) : (
            <ul className="space-y-2">
              {latestSources.map((s, i) => (
                <li
                  key={i}
                  className="rounded-md border border-rule bg-bg-2 px-3 py-2.5 text-[12px]"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="mono inline-block h-5 w-5 shrink-0 rounded-md bg-[var(--brand-soft)] text-center leading-5 text-brand">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {s.url ? (
                        <a
                          href={String(s.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-2 text-[12.5px] font-medium text-ink-1 hover:text-brand"
                        >
                          {(s.title as string) || "Untitled"}
                        </a>
                      ) : (
                        <span className="line-clamp-2 text-[12.5px] font-medium text-ink-1">
                          {(s.title as string) || "Untitled"}
                        </span>
                      )}
                      {(s.source_name || s.published_at) && (
                        <div className="mono mt-1 text-[10px] text-ink-3">
                          {s.source_name && <span>{String(s.source_name)}</span>}
                          {s.source_name && s.published_at && <span> · </span>}
                          {s.published_at && <span>{String(s.published_at)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Reserved for future AI affordances */}
      <span className="sr-only">
        <Sparkles size={10} />
      </span>
    </div>
  );
}

// Parse [SRC:N], [S:N], [S1] markers in assistant message and wrap with <Cite>.
function renderWithCitations(text: string): ReactNode {
  if (!text) return null;
  const pattern = /\[(?:SRC|S|src|s)[:\s]?(\d+)\]/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(<Cite key={`cite-${m.index}`}>S{m[1]}</Cite>);
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function Cite({ children }: { children: ReactNode }) {
  return (
    <span className="mono mx-px cursor-pointer rounded-sm border border-brand/40 bg-[var(--brand-soft)] px-1 py-px text-[9.5px] text-brand">
      {children}
    </span>
  );
}
