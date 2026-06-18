"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { ExperienceState } from "@/actions/experience";
import type { SelectOption } from "@/types";

const initialState: ExperienceState = {
  errors: {},
};

interface ExperienceFormProps {
  action: (
    prevState: ExperienceState,
    formData: FormData,
  ) => Promise<ExperienceState>;
  defaultValues?: {
    company?: string;
    role?: string;
    duration?: string;
    year?: string;
    summary?: string;
    technologyIds?: string[];
  };
  technologyOptions?: SelectOption[];
  yearOptions: SelectOption[];
  submitLabel?: string;
}

export function ExperienceForm({
  action,
  defaultValues = {},
  technologyOptions = [],
  yearOptions,
  submitLabel = "Submit",
}: ExperienceFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    defaultValues.technologyIds ?? [],
  );

  return (
    <CenteredForm action={formAction}>
      <FormField label="Company" htmlFor="company">
        <Input
          id="company"
          name="company"
          defaultValue={defaultValues.company}
          aria-invalid={!!state.errors?.company}
        />
        {state.errors?.company && (
          <p className="text-sm text-red-600">{state.errors.company}</p>
        )}
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Input
          id="role"
          name="role"
          defaultValue={defaultValues.role}
          aria-invalid={!!state.errors?.role}
        />
        {state.errors?.role && (
          <p className="text-sm text-red-600">{state.errors.role}</p>
        )}
      </FormField>
      <FormField label="Duration" htmlFor="duration">
        <Input
          id="duration"
          name="duration"
          defaultValue={defaultValues.duration}
          aria-invalid={!!state.errors?.duration}
        />
        {state.errors?.duration && (
          <p className="text-sm text-red-600">{state.errors.duration}</p>
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

      {technologyOptions.length > 0 && (
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
      )}
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <Button type="submit" disabled={isPending} aria-disabled={isPending}>
        {submitLabel}
      </Button>
    </CenteredForm>
  );
}
