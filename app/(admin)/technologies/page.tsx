import { listTechnologies } from "@/actions/technology";
import { PageHeader } from "@/components/layout/PageHeader";
import { TechnologiesTable } from "@/components/technologies/TechnologiesTable";
import Link from "next/link";

export default async function TechnologiesPage() {
  const technologies = await listTechnologies();

  const technologyRows = technologies.map((technology) => ({
    id: technology.id,
    name: technology.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader
          title="Technologies"
          subtitle="Manage project technologies"
        />
        <Link
          href="/technologies/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Technology
        </Link>
      </div>
      <TechnologiesTable technologies={technologyRows} />
    </div>
  );
}
