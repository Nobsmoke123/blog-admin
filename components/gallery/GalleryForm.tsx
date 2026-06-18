"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { GalleryImageUpload } from "@/components/forms/GalleryImageUpload";
import { Select } from "@/components/ui/Select";
import type { GalleryState } from "@/actions/gallery";
import type { SelectOption } from "@/types";
import { BounceLoader } from "react-spinners";

const initialState: GalleryState = {
  errors: {},
};

interface GalleryFormProps {
  action: (prevState: GalleryState, formData: FormData) => Promise<GalleryState>;
  projectOptions: SelectOption[];
  defaultValues?: {
    project_id?: string;
    image?: string;
  };
  submitLabel?: string;
}

export function GalleryForm({
  action,
  projectOptions,
  defaultValues = {},
  submitLabel = "Submit",
}: GalleryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [image, setImage] = useState(defaultValues.image ?? "");

  return (
    <CenteredForm action={formAction}>
      <FormField label="Project" htmlFor="project_id">
        <Select
          id="project_id"
          name="project_id"
          options={projectOptions}
          defaultValue={defaultValues.project_id}
          placeholder="Select a project"
          aria-invalid={!!state.errors?.project_id}
        />
        {state.errors?.project_id && (
          <p className="text-sm text-red-600">{state.errors.project_id}</p>
        )}
      </FormField>

      <FormField label="Image" htmlFor="image">
        <GalleryImageUpload value={image} onChange={setImage} />
        <input type="hidden" name="image" value={image} />
        {state.errors?.image && (
          <p className="text-sm text-red-600">{state.errors.image}</p>
        )}
      </FormField>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <Button type="submit" disabled={isPending} aria-disabled={isPending}>
        {submitLabel}
      </Button>
    </CenteredForm>
  );
}
