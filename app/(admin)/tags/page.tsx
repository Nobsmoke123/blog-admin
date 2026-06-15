import { listTags } from "@/actions/tag";
import { PageHeader } from "@/components/layout/PageHeader";
import { TagsTable } from "@/components/tags/TagsTable";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await listTags();

  const tagRows = tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Tags" subtitle="Manage blog tags" />
        <Link
          href="/tags/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Tag
        </Link>
      </div>
      <TagsTable tags={tagRows} />
    </div>
  );
}
