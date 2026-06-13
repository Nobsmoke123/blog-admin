"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { Select } from "@/components/ui/Select";
import { galleryItems } from "@/lib/mock/gallery";
import { projects } from "@/lib/mock/projects";

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const item = galleryItems.find((g) => g.id === id);
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.title,
  }));

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gallery item not found" backHref="/gallery" />
        <EmptyState message={`No gallery item found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Gallery Item" backHref="/gallery" />
      <CenteredForm>
        <FormField label="Project" htmlFor="project">
          <Select
            id="project"
            options={projectOptions}
            defaultValue={item.projectId}
          />
        </FormField>
        <FormField label="Image" htmlFor="image">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
