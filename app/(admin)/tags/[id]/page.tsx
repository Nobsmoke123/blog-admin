import { getTag, updateTag } from "@/actions/tag";
import { TagForm } from "@/components/tags/TagForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tag = await getTag(id);

  if (!tag) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tag not found" backHref="/tags" />
        <EmptyState message={`No tag found with id "${id}".`} />
      </div>
    );
  }

  const updateTagWithId = updateTag.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Tag" backHref="/tags" />
      <TagForm
        action={updateTagWithId}
        defaultName={tag.name}
        submitLabel="Update"
      />
    </div>
  );
}
