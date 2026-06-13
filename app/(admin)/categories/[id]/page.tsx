"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { categories } from "@/lib/mock/categories";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const category = categories.find((c) => c.id === id);

  if (!category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Category not found" backHref="/categories" />
        <EmptyState message={`No category found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" backHref="/categories" />
      <CenteredForm>
        <FormField label="Category name" htmlFor="name">
          <Input id="name" defaultValue={category.name} />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
