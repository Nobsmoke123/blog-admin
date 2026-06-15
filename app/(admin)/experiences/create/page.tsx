import { createExperience } from "@/actions/experience";
import { listTechnologies } from "@/actions/technology";
import { ExperienceForm } from "@/components/experiences/ExperienceForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { getYearOptions } from "@/lib/utils";

export default async function CreateExperiencePage() {
  const technologies = await listTechnologies();
  const technologyOptions = technologies.map((technology) => ({
    value: technology.id,
    label: technology.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Create Experience" backHref="/experiences" />
      <ExperienceForm
        action={createExperience}
        technologyOptions={technologyOptions}
        yearOptions={getYearOptions()}
        submitLabel="Create"
      />
    </div>
  );
}
