"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { technologies } from "@/lib/mock/technologies";
import type { Technology } from "@/types";

export default function TechnologiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Technologies" subtitle="Manage project technologies" />
      <PaginatedTable<Technology>
        data={technologies}
        getRowHref={(item) => `/technologies/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "technology", cell: (item) => item.name },
        ]}
      />
    </div>
  );
}
