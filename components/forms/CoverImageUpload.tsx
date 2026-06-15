"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  className,
}: CoverImageUploadProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <CldUploadWidget
        uploadPreset="projects_image_upload"
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={(result) => {
          if (
            result.info &&
            typeof result.info === "object" &&
            "secure_url" in result.info
          ) {
            onChange(result.info.secure_url as string);
          }
        }}
        options={{
          singleUploadAutoClose: true,
          sources: ["local", "url", "image_search"],
          multiple: false,
        }}
      >
        {({ open }) => (
          <Button type="button" variant="secondary" onClick={() => open()}>
            Upload cover image
          </Button>
        )}
      </CldUploadWidget>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Cover preview"
          className="h-32 w-auto rounded-md border border-foreground/20 object-cover"
        />
      )}
    </div>
  );
}
