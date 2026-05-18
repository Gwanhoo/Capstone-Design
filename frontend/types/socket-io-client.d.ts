declare module "socket.io-client" {
  export type AckFn<T> = (payload: T) => void;

  export interface Socket {
    id?: string;
    connected: boolean;
    auth: { token: string | null };
    connect(): void;
    disconnect(): void;
    emit(event: string, payload?: unknown, ack?: AckFn<{ ok: boolean; message?: string }>): void;
    on(event: string, listener: (payload: never) => void): void;
    off(event: string, listener: (payload: never) => void): void;
  }

  export function io(url: string, options?: {
    autoConnect?: boolean;
    transports?: string[];
    auth?: { token: string | null };
  }): Socket;
}
