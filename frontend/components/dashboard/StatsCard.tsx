interface StatsCardProps {
  title: string;
  value: string;
  note: string;
}

export function StatsCard({ title, value, note }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant">{title}</p>
      <p className="mt-2 text-2xl font-bold text-on-surface">{value}</p>
      <p className="mt-1 text-xs text-outline">{note}</p>
    </div>
  );
}
