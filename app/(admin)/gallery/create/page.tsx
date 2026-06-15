import { createGallery } from "@/actions/gallery";
import { listProjects } from "@/actions/projects";
import { GalleryForm } from "@/components/gallery/GalleryForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function CreateGalleryPage() {
  const projects = await listProjects();
  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Create Gallery Item" backHref="/gallery" />
      <GalleryForm
        action={createGallery}
        projectOptions={projectOptions}
        submitLabel="Create"
      />
    </div>
  );
}
