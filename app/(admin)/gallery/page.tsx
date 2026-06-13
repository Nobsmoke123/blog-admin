"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { PaginatedTable } from "@/components/layout/PaginatedTable";
import { galleryItems } from "@/lib/mock/gallery";
import type { GalleryItem } from "@/types";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" subtitle="Manage project gallery images" />
      <PaginatedTable<GalleryItem>
        data={galleryItems}
        getRowHref={(item) => `/gallery/${item.id}`}
        columns={[
          { header: "SN", cell: () => null },
          { header: "id", cell: (item) => item.id },
          { header: "project", cell: (item) => item.projectTitle },
          {
            header: "image",
            cell: (item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.projectTitle}
                className="h-10 w-14 rounded object-cover"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
