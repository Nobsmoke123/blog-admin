"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { tags } from "@/lib/mock/tags";

export default function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tag = tags.find((t) => t.id === id);

  if (!tag) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tag not found" backHref="/tags" />
        <EmptyState message={`No tag found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Tag" backHref="/tags" />
      <CenteredForm>
        <FormField label="Tag name" htmlFor="name">
          <Input id="name" defaultValue={tag.name} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
