import { listProjects } from "@/actions/projects";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await listProjects();

  const projectRows = projects.map((project) => ({
    id: project.id,
    name: project.name,
    year: project.year,
    live_url: project.live_url,
    source_code: project.source_code,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Projects" subtitle="Manage portfolio projects" />
        <Link
          href="/projects/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Project
        </Link>
      </div>
      <ProjectsTable projects={projectRows} />
    </div>
  );
}
