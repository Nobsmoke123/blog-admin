import { getGallery, updateGallery } from "@/actions/gallery";
import { listProjects } from "@/actions/projects";
import { GalleryForm } from "@/components/gallery/GalleryForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, projects] = await Promise.all([getGallery(id), listProjects()]);

  if (!item) {
    return (
      <div className="space-y-6">
        <PageHeader title="Gallery item not found" backHref="/gallery" />
        <EmptyState message={`No gallery item found with id "${id}".`} />
      </div>
    );
  }

  const updateGalleryWithId = updateGallery.bind(null, id);
  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Gallery Item" backHref="/gallery" />
      <GalleryForm
        action={updateGalleryWithId}
        projectOptions={projectOptions}
        defaultValues={{
          project_id: item.project_id,
          image: item.image,
        }}
        submitLabel="Update"
      />
    </div>
  );
}
