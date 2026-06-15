import { createCategory } from "@/actions/category";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Category" backHref="/categories" />
      <CategoryForm action={createCategory} submitLabel="Create" />
    </div>
  );
}
