"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { categories } from "@/lib/mock/categories";
import { projects } from "@/lib/mock/projects";
import { technologies } from "@/lib/mock/technologies";
import { getYearOptions } from "@/lib/utils";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id);
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? "");
  const [overview, setOverview] = useState(project?.overview ?? "");
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    project?.technologyIds ?? [],
  );

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const technologyOptions = technologies.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const yearOptions = getYearOptions();

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader title="Project not found" backHref="/projects" />
        <EmptyState message={`No project found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Project" backHref="/projects" />
      <CenteredForm>
        <FormField label="Project title" htmlFor="title">
          <Input id="title" defaultValue={project.title} />
        </FormField>
        <FormField label="Category" htmlFor="category">
          <Select
            id="category"
            options={categoryOptions}
            defaultValue={project.categoryId}
          />
        </FormField>
        <FormField label="Summary" htmlFor="summary">
          <Textarea id="summary" defaultValue={project.summary} />
        </FormField>
        <FormField label="Overview" htmlFor="overview">
          <RichTextEditor
            id="overview"
            value={overview}
            onChange={setOverview}
          />
        </FormField>
        <FormField label="Year" htmlFor="year">
          <Select
            id="year"
            options={yearOptions}
            defaultValue={project.year}
          />
        </FormField>
        <FormField label="Image" htmlFor="image">
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </FormField>
        <FormField label="Technology">
          <MultiSelect
            options={technologyOptions}
            value={technologyIds}
            onChange={setTechnologyIds}
          />
        </FormField>
        <FormField label="Live URL" htmlFor="liveUrl">
          <Input id="liveUrl" type="url" defaultValue={project.liveUrl} />
        </FormField>
        <FormField label="Source code" htmlFor="sourceCode">
          <Input id="sourceCode" type="url" defaultValue={project.sourceCode} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
