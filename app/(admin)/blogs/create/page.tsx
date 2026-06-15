import { createBlog } from "@/actions/blog";
import { listCategories } from "@/actions/category";
import { listTags } from "@/actions/tag";
import { BlogForm } from "@/components/blogs/BlogForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function CreateBlogPage() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Create Blog Post" backHref="/blogs" />
      <BlogForm
        action={createBlog}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
        submitLabel="Create"
      />
    </div>
  );
}
