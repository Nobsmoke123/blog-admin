"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { BlogState } from "@/actions/blog";
import type { SelectOption } from "@/types";

const initialState: BlogState = {
  errors: {},
};

interface BlogFormProps {
  action: (prevState: BlogState, formData: FormData) => Promise<BlogState>;
  defaultValues?: {
    title?: string;
    summary?: string;
    read_time?: number;
    category_id?: string;
    content?: string;
    tagIds?: string[];
  };
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
  submitLabel?: string;
}

export function BlogForm({
  action,
  defaultValues = {},
  categoryOptions = [],
  tagOptions = [],
  submitLabel = "Submit",
}: BlogFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [content, setContent] = useState(defaultValues.content ?? "");
  const [tagIds, setTagIds] = useState<string[]>(defaultValues.tagIds ?? []);

  return (
    <CenteredForm action={formAction}>
      <FormField label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          defaultValue={defaultValues.title}
          aria-invalid={!!state.errors?.title}
        />
        {state.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title}</p>
        )}
      </FormField>

      <FormField label="Summary" htmlFor="summary">
        <Textarea
          id="summary"
          name="summary"
          defaultValue={defaultValues.summary}
          aria-invalid={!!state.errors?.summary}
        />
        {state.errors?.summary && (
          <p className="text-sm text-red-600">{state.errors.summary}</p>
        )}
      </FormField>

      {categoryOptions.length > 0 && (
        <FormField label="Category" htmlFor="category">
          <Select
            id="category"
            name="category_id"
            options={categoryOptions}
            defaultValue={defaultValues.category_id}
            placeholder="Select a category"
            aria-invalid={!!state.errors?.category_id}
          />
          {state.errors?.category_id && (
            <p className="text-sm text-red-600">{state.errors.category_id}</p>
          )}
        </FormField>
      )}

      {tagOptions.length > 0 && (
        <FormField label="Tags">
          <MultiSelect
            options={tagOptions}
            value={tagIds}
            onChange={setTagIds}
          />
          {tagIds.map((tagId) => (
            <input key={tagId} type="hidden" name="tagIds" value={tagId} />
          ))}
        </FormField>
      )}

      <FormField label="Content" htmlFor="content">
        <RichTextEditor id="content" value={content} onChange={setContent} />
        <input type="hidden" name="content" value={content} />
        {state.errors?.content && (
          <p className="text-sm text-red-600">{state.errors.content}</p>
        )}
      </FormField>

      <FormField label="Read time (minutes)" htmlFor="read_time">
        <Input
          id="read_time"
          name="read_time"
          type="number"
          min={1}
          defaultValue={defaultValues.read_time}
          placeholder="e.g. 8"
          aria-invalid={!!state.errors?.read_time}
        />
        {state.errors?.read_time && (
          <p className="text-sm text-red-600">{state.errors.read_time}</p>
        )}
      </FormField>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <Button type="submit" disabled={isPending} aria-disabled={isPending}>
        {submitLabel}
      </Button>
    </CenteredForm>
  );
}
