"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Select } from "@/components/ui/Select";
import { blogs } from "@/lib/mock/blogs";
import { categories } from "@/lib/mock/categories";
import { tags } from "@/lib/mock/tags";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const blog = blogs.find((b) => b.id === id);
  const [content, setContent] = useState(blog?.content ?? "");
  const [tagIds, setTagIds] = useState<string[]>(blog?.tagIds ?? []);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const tagOptions = tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  if (!blog) {
    return (
      <div className="space-y-6">
        <PageHeader title="Blog not found" backHref="/blogs" />
        <EmptyState message={`No blog post found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Blog Post" backHref="/blogs" />
      <CenteredForm>
        <FormField label="Title" htmlFor="title">
          <Input id="title" defaultValue={blog.title} />
        </FormField>
        <FormField label="Category" htmlFor="category">
          <Select
            id="category"
            options={categoryOptions}
            defaultValue={blog.categoryId}
          />
        </FormField>
        <FormField label="Tags">
          <MultiSelect
            options={tagOptions}
            value={tagIds}
            onChange={setTagIds}
          />
        </FormField>
        <FormField label="Content" htmlFor="content">
          <RichTextEditor
            id="content"
            value={content}
            onChange={setContent}
          />
        </FormField>
        <FormField label="Read time" htmlFor="readTime">
          <Input id="readTime" defaultValue={blog.readTime} placeholder="e.g. 8 min" />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
