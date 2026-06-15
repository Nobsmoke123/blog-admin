import { listTasks } from "@/actions/task";
import { PageHeader } from "@/components/layout/PageHeader";
import { TasksTable } from "@/components/tasks/TasksTable";
import Link from "next/link";

export default async function TasksPage() {
  const tasks = await listTasks();

  const taskRows = tasks.map((task) => ({
    id: task.id,
    experience_name: task.experience_name,
    task: task.task,
    created_at: task.created_at.toISOString(),
    updated_at: task.updated_at.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Tasks" subtitle="Manage experience tasks" />
        <Link
          href="/tasks/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Task
        </Link>
      </div>
      <TasksTable tasks={taskRows} />
    </div>
  );
}
