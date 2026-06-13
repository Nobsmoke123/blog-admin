"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { experiences } from "@/lib/mock/experiences";

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const experience = experiences.find((e) => e.id === id);

  if (!experience) {
    return (
      <div className="space-y-6">
        <PageHeader title="Experience not found" backHref="/experiences" />
        <EmptyState message={`No experience found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Experience" backHref="/experiences" />
      <CenteredForm>
        <FormField label="Company" htmlFor="company">
          <Input id="company" defaultValue={experience.company} />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <Input id="role" defaultValue={experience.role} />
        </FormField>
        <FormField label="Duration" htmlFor="duration">
          <Input id="duration" defaultValue={experience.duration} />
        </FormField>
        <FormField label="Summary" htmlFor="summary">
          <Textarea id="summary" defaultValue={experience.summary} />
        </FormField>
        <FormField label="Year" htmlFor="year">
          <Input id="year" defaultValue={experience.year} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
