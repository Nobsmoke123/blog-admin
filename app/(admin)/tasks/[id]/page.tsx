import { getTask, updateTask } from "@/actions/task";
import { listExperiences } from "@/actions/experience";
import { TaskForm } from "@/components/tasks/TaskForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, experiences] = await Promise.all([
    getTask(id),
    listExperiences(),
  ]);

  if (!task) {
    return (
      <div className="space-y-6">
        <PageHeader title="Task not found" backHref="/tasks" />
        <EmptyState message={`No task found with id "${id}".`} />
      </div>
    );
  }

  const experienceOptions = experiences.map((experience) => ({
    value: experience.id,
    label: experience.company,
  }));

  const updateTaskWithId = updateTask.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Task" backHref="/tasks" />
      <TaskForm
        action={updateTaskWithId}
        experienceOptions={experienceOptions}
        defaultValues={{
          task: task.task,
          experience_id: task.experience_id,
        }}
        submitLabel="Update"
      />
    </div>
  );
}
