"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { ConfigState } from "@/actions/config";

const initialState: ConfigState = {
  errors: {},
};

interface ConfigFormProps {
  action: (
    prevState: ConfigState,
    formData: FormData,
  ) => Promise<ConfigState>;
  defaultKey?: string;
  defaultValue?: string;
  submitLabel?: string;
}

export function ConfigForm({
  action,
  defaultKey = "",
  defaultValue = "",
  submitLabel = "Submit",
}: ConfigFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <CenteredForm action={formAction}>
      <FormField label="Key" htmlFor="key">
        <Input
          id="key"
          name="key"
          defaultValue={defaultKey}
          aria-invalid={!!state.errors?.key}
        />
        {state.errors?.key && (
          <p className="text-sm text-red-600">{state.errors.key}</p>
        )}
      </FormField>
      <FormField label="Value" htmlFor="value">
        <Textarea
          id="value"
          name="value"
          defaultValue={defaultValue}
          aria-invalid={!!state.errors?.value}
        />
        {state.errors?.value && (
          <p className="text-sm text-red-600">{state.errors.value}</p>
        )}
      </FormField>
      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <Button type="submit">{submitLabel}</Button>
    </CenteredForm>
  );
}
