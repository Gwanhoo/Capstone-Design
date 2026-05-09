import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="rounded-xl border border-outline/10 bg-surface-low/80 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_2px_8px_rgba(79,70,229,0.08)] backdrop-blur-xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-on-surface">{title}</h1>
        <p className="text-sm tracking-wide text-on-surface-variant">{description}</p>
      </div>
      {children}
    </div>
  );
}
