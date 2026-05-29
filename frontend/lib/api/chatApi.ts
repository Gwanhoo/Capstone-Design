import { apiRequest } from "@/lib/api/client";

export type ProjectChatMessage = {
  id: string;
  projectId: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

type BackendSender =
  | string
  | {
      _id?: string;
      id?: string;
      name?: string;
      email?: string;
    };

type BackendMessage = {
  _id?: string;
  id?: string;
  projectId: string;
  content: string;
  sender: BackendSender;
  createdAt: string;
  updatedAt: string;
};

const normalizeSender = (sender: BackendSender): ProjectChatMessage["sender"] => {
  if (typeof sender === "string") {
    return { id: sender, name: "알 수 없음", email: "" };
  }

  return {
    id: String(sender?._id ?? sender?.id ?? ""),
    name: sender?.name ?? "알 수 없음",
    email: sender?.email ?? "",
  };
};

export const mapMessage = (message: BackendMessage): ProjectChatMessage => ({
  id: String(message._id ?? message.id ?? ""),
  projectId: message.projectId,
  content: message.content,
  sender: normalizeSender(message.sender),
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

export const getProjectMessages = async (projectId: string, limit = 50) => {
  const data = await apiRequest<BackendMessage[]>(`/api/projects/${projectId}/messages?limit=${limit}`);
  return data.map(mapMessage);
};

export const sendProjectMessage = async (projectId: string, content: string) => {
  const data = await apiRequest<BackendMessage>(`/api/projects/${projectId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  return mapMessage(data);
};
