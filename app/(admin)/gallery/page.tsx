import { listGallery } from "@/actions/gallery";
import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryTable } from "@/components/gallery/GalleryTable";
import Link from "next/link";

export default async function GalleryPage() {
  const items = await listGallery();

  const galleryRows = items.map((item) => ({
    id: item.id,
    project_name: item.project_name,
    image: item.image,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Gallery" subtitle="Manage project gallery images" />
        <Link
          href="/gallery/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Gallery Item
        </Link>
      </div>
      <GalleryTable items={galleryRows} />
    </div>
  );
}
