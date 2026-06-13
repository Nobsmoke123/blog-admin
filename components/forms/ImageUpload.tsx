"use client";

import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onChange(URL.createObjectURL(file));
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        type="url"
        placeholder="Image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="h-32 w-auto rounded-md border border-foreground/20 object-cover"
        />
      )}
    </div>
  );
}
