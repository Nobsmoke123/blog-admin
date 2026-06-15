import { createTechnology } from "@/actions/technology";
import { TechnologyForm } from "@/components/technologies/TechnologyForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CreateTechnologyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Technology" backHref="/technologies" />
      <TechnologyForm action={createTechnology} submitLabel="Create" />
    </div>
  );
}
