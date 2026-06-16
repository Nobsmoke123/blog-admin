import { getConfig, updateConfig } from "@/actions/config";
import { ConfigForm } from "@/components/configs/ConfigForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function ConfigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = await getConfig(id);

  if (!config) {
    return (
      <div className="space-y-6">
        <PageHeader title="Config not found" backHref="/configs" />
        <EmptyState message={`No config found with id "${id}".`} />
      </div>
    );
  }

  const updateConfigWithId = updateConfig.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Config" backHref="/configs" />
      <ConfigForm
        action={updateConfigWithId}
        defaultKey={config.key}
        defaultValue={config.value}
        submitLabel="Update"
      />
    </div>
  );
}
