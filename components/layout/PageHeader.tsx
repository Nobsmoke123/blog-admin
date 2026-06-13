import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Back to list",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="text-sm text-foreground/60 hover:text-foreground transition-colors"
        >
          ← {backLabel}
        </Link>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-foreground/60">{subtitle}</p>}
    </div>
  );
}
