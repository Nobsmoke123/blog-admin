"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import type { TagState } from "@/actions/tag";

const initialState: TagState = {
  errors: {},
};

interface TagFormProps {
  action: (
    prevState: TagState,
    formData: FormData,
  ) => Promise<TagState>;
  defaultName?: string;
  submitLabel?: string;
}

export function TagForm({
  action,
  defaultName = "",
  submitLabel = "Submit",
}: TagFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <CenteredForm action={formAction}>
      <FormField label="Tag name" htmlFor="name">
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          aria-invalid={!!state.errors?.name}
        />
        {state.errors?.name && (
          <p className="text-sm text-red-600">{state.errors.name}</p>
        )}
      </FormField>
      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <Button type="submit">{submitLabel}</Button>
    </CenteredForm>
  );
}
