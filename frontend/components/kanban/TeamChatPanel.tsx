"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { ChatMessage } from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "./types";

export function TeamChatPanel({ initialMessages, onAddRecommendedTask }: { initialMessages: ChatMessageType[]; onAddRecommendedTask: () => void }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [added, setAdded] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `${Date.now()}`, sender: "나", time: "방금", message: text, type: "mine" }]);
    setInput("");
  };

  return (
    <aside className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-surface-container-low/70 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><h3 className="text-sm font-semibold text-on-surface">팀 채팅</h3><span className="text-[11px] text-tertiary">3명 온라인</span></div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">{messages.map((message) => <ChatMessage key={message.id} message={message} />)}<AIRecommendationCard added={added} onAdd={() => { onAddRecommendedTask(); setAdded(true); }} /></div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3"><div className="relative"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} placeholder="메시지를 입력하세요..." className="w-full resize-none rounded-xl border border-white/10 bg-surface-container-lowest px-3 py-2 pr-10 text-xs text-on-surface outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30" /><button type="submit" className="absolute bottom-2 right-2 rounded-md bg-primary p-1.5 text-on-primary"><Send className="h-3.5 w-3.5" /></button></div></form>
    </aside>
  );
}
