"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { projects } from "@/lib/mock/projects";
import type { Project } from "@/types";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Projects" subtitle="Manage portfolio projects" />
      <PaginatedTable<Project>
        data={projects}
        getRowHref={(item) => `/projects/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "project title", cell: (item) => item.title },
          { header: "year", cell: (item) => item.year },
          {
            header: "live URL",
            cell: (item) => (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                {item.liveUrl}
              </a>
            ),
            className: "max-w-xs truncate",
          },
          {
            header: "source code",
            cell: (item) => (
              <a
                href={item.sourceCode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 hover:underline"
              >
                {item.sourceCode}
              </a>
            ),
            className: "max-w-xs truncate",
          },
        ]}
      />
    </div>
  );
}
