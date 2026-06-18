"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { TaskState } from "@/actions/task";
import type { SelectOption } from "@/types";

const initialState: TaskState = {
  errors: {},
};

interface TaskFormProps {
  action: (prevState: TaskState, formData: FormData) => Promise<TaskState>;
  experienceOptions: SelectOption[];
  defaultValues?: {
    task?: string;
    experience_id?: string;
  };
  submitLabel?: string;
}

export function TaskForm({
  action,
  experienceOptions,
  defaultValues = {},
  submitLabel = "Submit",
}: TaskFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <CenteredForm action={formAction}>
      <FormField label="Experience" htmlFor="experience_id">
        <Select
          id="experience_id"
          name="experience_id"
          options={experienceOptions}
          defaultValue={defaultValues.experience_id}
          placeholder="Select an experience"
          aria-invalid={!!state.errors?.experience_id}
        />
        {state.errors?.experience_id && (
          <p className="text-sm text-red-600">{state.errors.experience_id}</p>
        )}
      </FormField>

      <FormField label="Task" htmlFor="task">
        <Textarea
          id="task"
          name="task"
          defaultValue={defaultValues.task}
          aria-invalid={!!state.errors?.task}
        />
        {state.errors?.task && (
          <p className="text-sm text-red-600">{state.errors.task}</p>
        )}
      </FormField>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <Button type="submit" disabled={isPending} aria-disabled={isPending}>
        {submitLabel}
      </Button>
    </CenteredForm>
  );
}
