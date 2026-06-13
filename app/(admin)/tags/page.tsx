"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { tags } from "@/lib/mock/tags";
import type { Tag } from "@/types";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tags" subtitle="Manage blog tags" />
      <PaginatedTable<Tag>
        data={tags}
        getRowHref={(item) => `/tags/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "tag", cell: (item) => item.name },
        ]}
      />
    </div>
  );
}
