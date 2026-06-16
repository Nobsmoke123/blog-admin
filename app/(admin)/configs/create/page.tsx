import { createConfig } from "@/actions/config";
import { ConfigForm } from "@/components/configs/ConfigForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CreateConfigPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Config" backHref="/configs" />
      <ConfigForm action={createConfig} submitLabel="Create" />
    </div>
  );
}
