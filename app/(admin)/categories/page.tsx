import { listCategories } from "@/actions/category";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await listCategories();

  const categoryRows = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Categories" subtitle="Manage blog categories" />
        <Link
          href="/categories/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Category
        </Link>
      </div>
      <CategoriesTable categories={categoryRows} />
    </div>
  );
}
