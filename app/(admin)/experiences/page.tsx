"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { experiences } from "@/lib/mock/experiences";
import type { Experience } from "@/types";

export default function ExperiencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Experiences" subtitle="Manage work experiences" />
      <PaginatedTable<Experience>
        data={experiences}
        getRowHref={(item) => `/experiences/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "company", cell: (item) => item.company },
          { header: "role", cell: (item) => item.role },
          { header: "duration", cell: (item) => item.duration },
          {
            header: "summary",
            cell: (item) => (
              <span className="line-clamp-2 max-w-xs">{item.summary}</span>
            ),
            className: "max-w-xs",
          },
          { header: "year", cell: (item) => item.year },
        ]}
      />
    </div>
  );
}
