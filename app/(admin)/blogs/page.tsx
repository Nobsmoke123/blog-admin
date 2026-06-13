"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { blogs } from "@/lib/mock/blogs";
import type { Blog } from "@/types";

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blogs" subtitle="Manage blog posts" />
      <PaginatedTable<Blog>
        data={blogs}
        getRowHref={(item) => `/blogs/${item.id}`}
        columns={[
          { header: "ID", cell: (item) => item.id },
          { header: "title", cell: (item) => item.title },
          {
            header: "summary",
            cell: (item) => (
              <span className="line-clamp-2 max-w-xs">{item.summary}</span>
            ),
            className: "max-w-xs",
          },
          {
            header: "tags",
            cell: (item) => item.tagNames.join(", "),
            className: "max-w-xs",
          },
          { header: "read time", cell: (item) => item.readTime },
          { header: "created_at", cell: (item) => item.createdAt },
          { header: "updated_at", cell: (item) => item.updatedAt },
          { header: "category", cell: (item) => item.categoryName },
        ]}
      />
    </div>
  );
}
