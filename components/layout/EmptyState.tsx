interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-foreground/20 px-6 py-12 text-center text-sm text-foreground/60">
      {message}
    </div>
  );
}
