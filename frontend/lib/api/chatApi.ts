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

type BackendMessage = {
  _id: string;
  projectId: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

const mapMessage = (message: BackendMessage): ProjectChatMessage => ({
  id: message._id,
  projectId: message.projectId,
  content: message.content,
  sender: {
    id: message.sender._id,
    name: message.sender.name,
    email: message.sender.email,
  },
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
