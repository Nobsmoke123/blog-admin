"use client";

import { use } from "react";
import { Button } from "@/components/ui/Button";
import { CenteredForm } from "@/components/layout/CenteredForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { experiences } from "@/lib/mock/experiences";
import { tasks } from "@/lib/mock/tasks";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const task = tasks.find((t) => t.id === id);

  const experienceOptions = experiences.map((e) => ({
    value: e.id,
    label: e.company,
  }));

  if (!task) {
    return (
      <div className="space-y-6">
        <PageHeader title="Task not found" backHref="/tasks" />
        <EmptyState message={`No task found with id "${id}".`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Task" backHref="/tasks" />
      <CenteredForm>
        <FormField label="Task" htmlFor="task">
          <Textarea id="task" defaultValue={task.task} />
        </FormField>
        <FormField label="Experience" htmlFor="experience">
          <Select
            id="experience"
            options={experienceOptions}
            defaultValue={task.experienceId}
          />
        </FormField>
        <Button type="submit">Submit</Button>
      </CenteredForm>
    </div>
  );
}
