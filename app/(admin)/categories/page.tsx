"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { categories } from "@/lib/mock/categories";
import type { Category } from "@/types";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" subtitle="Manage blog categories" />
      <PaginatedTable<Category>
        data={categories}
        getRowHref={(item) => `/categories/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "category", cell: (item) => item.name },
        ]}
      />
    </div>
  );
}
