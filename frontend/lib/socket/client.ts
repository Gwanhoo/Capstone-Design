import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/api/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let socketRef: Socket | null = null;

export const getSocket = () => {
  if (socketRef) return socketRef;
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 필요합니다.");

  const token = getAccessToken();
  socketRef = io(API_BASE_URL, {
    autoConnect: false,
    transports: ["websocket"],
    auth: { token },
  });

  return socketRef;
};

export const connectSocket = () => {
  const socket = getSocket();
  const token = getAccessToken();
  socket.auth = { token };
  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  if (!socketRef) return;
  socketRef.disconnect();
};

export const getSocketId = () => socketRef?.id ?? null;
