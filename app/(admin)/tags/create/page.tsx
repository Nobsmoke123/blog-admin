import { createTag } from "@/actions/tag";
import { TagForm } from "@/components/tags/TagForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CreateTagPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Tag" backHref="/tags" />
      <TagForm action={createTag} submitLabel="Create" />
    </div>
  );
}
