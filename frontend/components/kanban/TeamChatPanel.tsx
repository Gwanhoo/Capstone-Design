"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSocket } from "@/lib/socket/client";
import { getProjectMessages, mapMessage, ProjectChatMessage, sendProjectMessage } from "@/lib/api/chatApi";

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
};

export function TeamChatPanel({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onlineCount = useMemo(() => new Set(messages.map((m) => m.sender.id)).size, [messages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProjectMessages(projectId);
        setMessages(data);
      } catch (_error) {
        setError("채팅 메시지를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    };
    load();
  }, [projectId]);

  useEffect(() => {
    const socket = getSocket();
    const onChatMessage = (rawMessage: unknown) => {
      const message = mapMessage(rawMessage as Parameters<typeof mapMessage>[0]);
      if (message.projectId !== projectId) return;
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) return prev.map((item) => (item.id === message.id ? message : item));
        return [...prev, message];
      });
      scrollToBottom();
    };

    socket.on("chat:message", onChatMessage as never);
    return () => {
      socket.off("chat:message", onChatMessage as never);
    };
  }, [projectId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await sendProjectMessage(projectId, text);
      setInput("");
    } catch (_error) {
      setError("메시지 전송에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      scrollToBottom();
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <aside className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-surface-container-low/70 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><h3 className="text-sm font-semibold text-on-surface">팀 채팅</h3><span className="text-[11px] text-tertiary">{onlineCount || 1}명 참여</span></div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {isLoading ? <p className="text-xs text-on-surface-variant">메시지를 불러오는 중...</p> : null}
        {!isLoading && !error && messages.length === 0 ? <p className="text-xs text-on-surface-variant">아직 메시지가 없습니다. 첫 메시지를 남겨보세요.</p> : null}
        {error ? <p className="text-xs text-red-300">{error}</p> : null}
        {!isLoading && messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              sender: message.sender.name,
              time: formatTime(message.createdAt),
              message: message.content,
              type: String(message.sender.id) === String(user?.id) ? "mine" : "team",
            }}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3"><div className="relative"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleInputKeyDown} rows={2} placeholder="메시지를 입력하세요..." className="w-full resize-none rounded-xl border border-white/10 bg-surface-container-lowest px-3 py-2 pr-10 text-xs text-on-surface outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30" /><button type="submit" disabled={isSubmitting} className="absolute bottom-2 right-2 rounded-md bg-primary p-1.5 text-on-primary disabled:opacity-60"><Send className="h-3.5 w-3.5" /></button></div></form>
    </aside>
  );
}
