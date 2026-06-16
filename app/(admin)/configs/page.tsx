import { listConfigs } from "@/actions/config";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfigsTable } from "@/components/configs/ConfigsTable";
import Link from "next/link";

export default async function ConfigsPage() {
  const configs = await listConfigs();

  const configRows = configs.map((config) => ({
    id: config.id,
    key: config.key,
    value: config.value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Configs" subtitle="Manage application configuration" />
        <Link
          href="/configs/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Config
        </Link>
      </div>
      <ConfigsTable configs={configRows} />
    </div>
  );
}
