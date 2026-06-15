import { listExperiences } from "@/actions/experience";
import { PageHeader } from "@/components/layout/PageHeader";
import { ExperiencesTable } from "@/components/experiences/ExperiencesTable";
import Link from "next/link";

export default async function ExperiencesPage() {
  const experiences = await listExperiences();

  const experienceRows = experiences.map((experience) => ({
    id: experience.id,
    company: experience.company,
    role: experience.role,
    duration: experience.duration,
    created_at: experience.created_at.toISOString(),
    updated_at: experience.updated_at.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Experiences" subtitle="Manage work experiences" />
        <Link
          href="/experiences/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Experience
        </Link>
      </div>
      <ExperiencesTable experiences={experienceRows} />
    </div>
  );
}
