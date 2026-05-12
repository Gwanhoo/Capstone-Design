import { ChatMessage as ChatMessageType } from "./types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isMine = message.type === "mine";

  return (
    <div className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
      <span className="text-[10px] text-outline">{message.sender} · {message.time}</span>
      <div
        className={`max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
          message.type === "ai"
            ? "border border-primary/30 bg-surface-container-lowest text-on-surface"
            : isMine
              ? "bg-primary-container/80 text-on-primary-container"
              : "bg-surface-container-high text-on-surface"
        }`}
      >
        {message.message}
      </div>
    </div>
  );
}
