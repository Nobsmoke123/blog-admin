import { cn } from "@/lib/utils";

interface CenteredFormProps {
  children: React.ReactNode;
  className?: string;
  action?: string | ((formData: FormData) => void | Promise<void>);
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CenteredForm({
  children,
  className,
  action,
  onSubmit,
}: CenteredFormProps) {
  return (
    <form
      action={action}
      onSubmit={action ? undefined : (onSubmit ?? ((e) => e.preventDefault()))}
      className={cn("mx-auto max-w-lg space-y-4", className)}
    >
      {children}
    </form>
  );
}
