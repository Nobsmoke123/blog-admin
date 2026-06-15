import { createTask } from "@/actions/task";
import { listExperiences } from "@/actions/experience";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function CreateTaskPage() {
  const experiences = await listExperiences();
  const experienceOptions = experiences.map((experience) => ({
    value: experience.id,
    label: experience.company,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Create Task" backHref="/tasks" />
      <TaskForm
        action={createTask}
        experienceOptions={experienceOptions}
        submitLabel="Create"
      />
    </div>
  );
}
