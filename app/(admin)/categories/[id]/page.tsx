import { getCategory, updateCategory } from "@/actions/category";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Category not found" backHref="/categories" />
        <EmptyState message={`No category found with id "${id}".`} />
      </div>
    );
  }

  const updateCategoryWithId = updateCategory.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" backHref="/categories" />
      <CategoryForm
        action={updateCategoryWithId}
        defaultName={category.name}
        submitLabel="Update"
      />
    </div>
  );
}
