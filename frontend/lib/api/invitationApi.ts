import { apiRequest } from "@/lib/api/client";

export type MyInvitation = {
  id: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  project: { id: string; name: string; description: string };
  inviter: { id: string; name: string; email: string };
};

type BackendInvitation = {
  id: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  project: { _id: string; name: string; description: string };
  inviter: { _id: string; name: string; email: string };
};

const map = (i: BackendInvitation): MyInvitation => ({
  id: i.id,
  status: i.status,
  createdAt: i.createdAt,
  project: { id: i.project._id, name: i.project.name, description: i.project.description },
  inviter: { id: i.inviter._id, name: i.inviter.name, email: i.inviter.email },
});

export const createProjectInvitation = async (projectId: string, email: string) => apiRequest(`/api/projects/${projectId}/invitations`, { method: "POST", body: JSON.stringify({ email }) });
export const getMyInvitations = async () => (await apiRequest<BackendInvitation[]>("/api/invitations/me")).map(map);
export const acceptInvitation = async (invitationId: string) => apiRequest(`/api/invitations/${invitationId}/accept`, { method: "POST" });
export const declineInvitation = async (invitationId: string) => apiRequest(`/api/invitations/${invitationId}/decline`, { method: "POST" });
