import { cn } from "@/lib/utils";

interface CenteredFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CenteredForm({ children, className, onSubmit }: CenteredFormProps) {
  return (
    <form
      onSubmit={onSubmit ?? ((e) => e.preventDefault())}
      className={cn("mx-auto max-w-lg space-y-4", className)}
    >
      {children}
    </form>
  );
}
