import { listBlogs } from "@/actions/blog";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogsTable } from "@/components/blogs/BlogsTable";
import Link from "next/link";

export default async function BlogsPage() {
  const blogs = await listBlogs();

  const blogRows = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    summary: blog.summary,
    tag_names: blog.tag_names,
    read_time: blog.read_time,
    created_at: blog.created_at.toISOString(),
    updated_at: blog.updated_at.toISOString(),
    category_name: blog.category_name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader title="Blogs" subtitle="Manage blog posts" />
        <Link
          href="/blogs/create"
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-md font-medium bg-foreground text-background hover:opacity-90 border border-transparent shrink-0"
        >
          Create Blog Post
        </Link>
      </div>
      <BlogsTable blogs={blogRows} />
    </div>
  );
}
