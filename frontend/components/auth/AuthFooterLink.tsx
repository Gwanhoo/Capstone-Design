import Link from "next/link";

type AuthFooterLinkProps = {
  text: string;
  linkText: string;
  href: string;
};

export function AuthFooterLink({ text, linkText, href }: AuthFooterLinkProps) {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-on-surface-variant">
        {text}
        <Link href={href} className="ml-1.5 font-semibold text-primary transition-all hover:underline">
          {linkText}
        </Link>
      </p>
    </div>
  );
}
