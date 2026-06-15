import { getBlog, updateBlog } from "@/actions/blog";
import { listCategories } from "@/actions/category";
import { listTags } from "@/actions/tag";
import { BlogForm } from "@/components/blogs/BlogForm";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blog, categories, tags] = await Promise.all([
    getBlog(id),
    listCategories(),
    listTags(),
  ]);

  if (!blog) {
    return (
      <div className="space-y-6">
        <PageHeader title="Blog not found" backHref="/blogs" />
        <EmptyState message={`No blog post found with id "${id}".`} />
      </div>
    );
  }

  const updateBlogWithId = updateBlog.bind(null, id);
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
      <PageHeader title="Edit Blog Post" backHref="/blogs" />
      <BlogForm
        action={updateBlogWithId}
        defaultValues={{
          title: blog.title,
          summary: blog.summary,
          read_time: blog.read_time,
          category_id: blog.category_id,
          content: blog.content,
          tagIds: blog.tag_ids,
        }}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
        submitLabel="Update"
      />
    </div>
  );
}
