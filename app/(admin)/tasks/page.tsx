"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { tasks } from "@/lib/mock/tasks";
import type { Task } from "@/types";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" subtitle="Manage experience tasks" />
      <PaginatedTable<Task>
        data={tasks}
        getRowHref={(item) => `/tasks/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "experience", cell: (item) => item.experienceName },
          { header: "task", cell: (item) => item.task },
          { header: "created_at", cell: (item) => item.createdAt },
          { header: "updated_at", cell: (item) => item.updatedAt },
        ]}
      />
    </div>
  );
}
