import { LucideIcon } from "lucide-react";

type AuthInputProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
};

export function AuthInput({ id, label, type, placeholder, value, onChange, icon: Icon }: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="ml-1 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
        {label}
      </label>
      <div className="group relative">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary" /> : null}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-outline/20 bg-surface-lowest py-3 pr-4 text-on-surface placeholder:text-outline/50 outline-none transition-all duration-200 focus:border-primary/40 focus:shadow-[0_0_15px_rgba(195,192,255,0.18)] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ paddingLeft: Icon ? "2.5rem" : "1rem" }}
          required
        />
      </div>
    </div>
  );
}
