import { apiRequest } from "@/lib/api/client";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
};

type BackendProject = {
  _id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  createdBy: string;
  members?: string[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

type BackendMember = {
  _id: string;
  name: string;
  email: string;
};

type MembersResponse = {
  createdBy: string;
  members: BackendMember[];
};

const mapProject = (project: BackendProject): Project => ({
  id: String(project._id),
  name: project.name,
  description: project.description,
  status: project.status,
  createdBy: project.createdBy,
  memberCount: project.memberCount,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

const mapMember = (member: BackendMember, createdBy: string): ProjectMember => ({
  id: String(member._id),
  name: member.name,
  email: member.email,
  isOwner: String(member._id) === createdBy,
});

export const getProjects = async (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const data = await apiRequest<BackendProject[]>(`/api/projects${query}`);
  return data.map(mapProject);
};

export const getProjectById = async (projectId: string) => {
  const data = await apiRequest<BackendProject>(`/api/projects/${projectId}`);
  return mapProject(data);
};

export const createProject = async (payload: { name: string; description?: string }) => {
  const data = await apiRequest<BackendProject>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapProject(data);
};

export const getProjectMembers = async (projectId: string) => {
  const data = await apiRequest<MembersResponse>(`/api/projects/${projectId}/members`);
  return data.members.map((member) => mapMember(member, data.createdBy));
};

export const addProjectMember = async (projectId: string, email: string) => {
  const data = await apiRequest<BackendMember>(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return mapMember(data, "");
};

export const removeProjectMember = async (projectId: string, userId: string) => {
  await apiRequest(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
};

export type ProjectColumn = {
  id: string;
  title: string;
  order: number;
};

export const getProjectColumns = async (projectId: string) => {
  return apiRequest<ProjectColumn[]>(`/api/projects/${projectId}/columns`);
};

export const createProjectColumn = async (projectId: string, title: string) => {
  return apiRequest<ProjectColumn>(`/api/projects/${projectId}/columns`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const updateProjectColumn = async (projectId: string, columnId: string, title: string) => {
  return apiRequest<ProjectColumn>(`/api/projects/${projectId}/columns/${columnId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
};

export const deleteProjectColumn = async (projectId: string, columnId: string) => {
  await apiRequest(`/api/projects/${projectId}/columns/${columnId}`, {
    method: "DELETE",
  });
};

export const updateProject = async (projectId: string, payload: { name?: string; description?: string }) => {
  const data = await apiRequest<BackendProject>(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapProject(data);
};

export const getProjectDocs = async (projectId: string) => {
  return apiRequest<{ docs: string }>(`/api/projects/${projectId}/docs`);
};

export const updateProjectDocs = async (projectId: string, docs: string) => {
  return apiRequest<{ docs: string }>(`/api/projects/${projectId}/docs`, {
    method: "PATCH",
    body: JSON.stringify({ docs }),
  });
};
