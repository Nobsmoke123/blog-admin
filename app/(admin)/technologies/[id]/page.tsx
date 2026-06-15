import { getTechnology, updateTechnology } from "@/actions/technology";
import { TechnologyForm } from "@/components/technologies/TechnologyForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technology = await getTechnology(id);

  if (!technology) {
    return (
      <div className="space-y-6">
        <PageHeader title="Technology not found" backHref="/technologies" />
        <EmptyState message={`No technology found with id "${id}".`} />
      </div>
    );
  }

  const updateTechnologyWithId = updateTechnology.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Technology" backHref="/technologies" />
      <TechnologyForm
        action={updateTechnologyWithId}
        defaultName={technology.name}
        submitLabel="Update"
      />
    </div>
  );
}
