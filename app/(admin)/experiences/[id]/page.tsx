import { getExperience, updateExperience } from "@/actions/experience";
import { listTechnologies } from "@/actions/technology";
import { ExperienceForm } from "@/components/experiences/ExperienceForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import { getYearOptions } from "@/lib/utils";

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [experience, technologies] = await Promise.all([
    getExperience(id),
    listTechnologies(),
  ]);

  if (!experience) {
    return (
      <div className="space-y-6">
        <PageHeader title="Experience not found" backHref="/experiences" />
        <EmptyState message={`No experience found with id "${id}".`} />
      </div>
    );
  }

  const updateExperienceWithId = updateExperience.bind(null, id);
  const technologyOptions = technologies.map((technology) => ({
    value: technology.id,
    label: technology.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Experience" backHref="/experiences" />
      <ExperienceForm
        action={updateExperienceWithId}
        defaultValues={{
          company: experience.company,
          role: experience.role,
          duration: experience.duration,
          year: experience.year,
          summary: experience.summary,
          technologyIds: experience.technology_ids,
        }}
        technologyOptions={technologyOptions}
        yearOptions={getYearOptions()}
        submitLabel="Update"
      />
    </div>
  );
}
