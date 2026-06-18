"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
// import { ImageUpload } from "@/components/forms/ImageUpload";
import { CoverImageUpload } from "@/components/forms/CoverImageUpload";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ProjectState } from "@/actions/projects";
import type { SelectOption } from "@/types";

const initialState: ProjectState = {
  errors: {},
};

interface ProjectFormProps {
  action: (
    prevState: ProjectState,
    formData: FormData,
  ) => Promise<ProjectState>;
  categoryOptions: SelectOption[];
  technologyOptions: SelectOption[];
  yearOptions: SelectOption[];
  defaultValues?: {
    name?: string;
    category_id?: string;
    summary?: string;
    overview?: string;
    year?: string;
    image?: string;
    cover_image?: string;
    live_url?: string;
    source_code?: string;
    technologyIds?: string[];
  };
  submitLabel?: string;
}

export function ProjectForm({
  action,
  categoryOptions,
  technologyOptions,
  yearOptions,
  defaultValues = {},
  submitLabel = "Submit",
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  // const [image, setImage] = useState(defaultValues.image ?? "");
  const [coverImage, setCoverImage] = useState(defaultValues.cover_image ?? "");
  const [overview, setOverview] = useState(defaultValues.overview ?? "");
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    defaultValues.technologyIds ?? [],
  );

  const handleOverViewChange = (value: string) => {
    setOverview(
      value
        .replace("h1", "p")
        .replace("<div><br></div>", " ")
        .replace(
          '<p style="caret-color: rgb(255, 255, 255); color: rgb(255, 255, 255); text-decoration-thickness: auto; text-decoration-style: solid;"><br></p>',
          " ",
        ),
    );
  };

  return (
    <CenteredForm action={formAction}>
      <FormField label="Project title" htmlFor="name">
        <Input
          id="name"
          name="name"
          defaultValue={defaultValues.name}
          aria-invalid={!!state.errors?.name}
        />
        {state.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name}</p>
        )}
      </FormField>

      <FormField label="Category" htmlFor="category_id">
        <Select
          id="category_id"
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

      <FormField label="Overview" htmlFor="overview">
        <RichTextEditor
          id="overview"
          value={overview}
          onChange={handleOverViewChange}
        />
        <input type="hidden" name="overview" value={overview} />
        {state.errors?.overview && (
          <p className="text-sm text-red-600">{state.errors.overview}</p>
        )}
      </FormField>

      <FormField label="Year" htmlFor="year">
        <Select
          id="year"
          name="year"
          options={yearOptions}
          defaultValue={defaultValues.year}
          aria-invalid={!!state.errors?.year}
        />
        {state.errors?.year && (
          <p className="text-sm text-red-600">{state.errors.year}</p>
        )}
      </FormField>

      <FormField label="Cover image" htmlFor="cover_image">
        <CoverImageUpload value={coverImage} onChange={setCoverImage} />
        <input type="hidden" name="cover_image" value={coverImage} />
        {state.errors?.cover_image && (
          <p className="text-sm text-red-600">{state.errors.cover_image}</p>
        )}
      </FormField>

      {/* <FormField label="Image" htmlFor="image">
        <ImageUpload value={image} onChange={setImage} />
        <input type="hidden" name="image" value={image} />
        {state.errors?.image && (
          <p className="text-sm text-red-600">{state.errors.image}</p>
        )}
      </FormField> */}

      <FormField label="Technologies">
        <MultiSelect
          options={technologyOptions}
          value={technologyIds}
          onChange={setTechnologyIds}
        />
        {technologyIds.map((technologyId) => (
          <input
            key={technologyId}
            type="hidden"
            name="technologyIds"
            value={technologyId}
          />
        ))}
      </FormField>

      <FormField label="Live URL" htmlFor="live_url">
        <Input
          id="live_url"
          name="live_url"
          type="url"
          defaultValue={defaultValues.live_url}
          aria-invalid={!!state.errors?.live_url}
        />
        {state.errors?.live_url && (
          <p className="text-sm text-red-600">{state.errors.live_url}</p>
        )}
      </FormField>

      <FormField label="Source code" htmlFor="source_code">
        <Input
          id="source_code"
          name="source_code"
          type="url"
          defaultValue={defaultValues.source_code}
          aria-invalid={!!state.errors?.source_code}
        />
        {state.errors?.source_code && (
          <p className="text-sm text-red-600">{state.errors.source_code}</p>
        )}
      </FormField>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <Button type="submit">{submitLabel}</Button>
    </CenteredForm>
  );
}
