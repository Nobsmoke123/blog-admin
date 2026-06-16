import { listCategories } from "@/actions/category";
import { getProject, updateProject } from "@/actions/projects";
import { listTechnologies } from "@/actions/technology";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getYearOptions } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories, technologies] = await Promise.all([
    getProject(id),
    listCategories(),
    listTechnologies(),
  ]);

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader title="Project not found" backHref="/projects" />
        <EmptyState message={`No project found with id "${id}".`} />
      </div>
    );
  }

  const updateProjectWithId = updateProject.bind(null, id);
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const technologyOptions = technologies.map((technology) => ({
    value: technology.id,
    label: technology.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Project" backHref="/projects" />
      <ProjectForm
        action={updateProjectWithId}
        categoryOptions={categoryOptions}
        technologyOptions={technologyOptions}
        yearOptions={getYearOptions()}
        defaultValues={{
          name: project.name,
          category_id: project.category_id,
          summary: project.summary,
          overview: project.overview,
          year: project.year,
          cover_image: project.cover_image,
          live_url: project.live_url,
          source_code: project.source_code,
          technologyIds: project.technology_ids,
        }}
        submitLabel="Update"
      />
    </div>
  );
}
