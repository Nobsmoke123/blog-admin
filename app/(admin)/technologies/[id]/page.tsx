"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { technologies } from "@/lib/mock/technologies";

export default function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const technology = technologies.find((t) => t.id === id);

  if (!technology) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technology not found" backHref="/technologies" />
        <EmptyState message={`No technology found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Technology" backHref="/technologies" />
      <CenteredForm>
        <FormField label="Technology" htmlFor="name">
          <Input id="name" defaultValue={technology.name} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
