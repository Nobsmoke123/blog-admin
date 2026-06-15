import { listCategories } from "@/actions/category";
import { createProject } from "@/actions/projects";
import { listTechnologies } from "@/actions/technology";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { getYearOptions } from "@/lib/utils";

export default async function CreateProjectPage() {
  const [categories, technologies] = await Promise.all([
    listCategories(),
    listTechnologies(),
  ]);

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
      <PageHeader title="Create Project" backHref="/projects" />
      <ProjectForm
        action={createProject}
        categoryOptions={categoryOptions}
        technologyOptions={technologyOptions}
        yearOptions={getYearOptions()}
        submitLabel="Create"
      />
    </div>
  );
}
