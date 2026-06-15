"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface BlogSchema {
  id: string;
  title: string;
  summary: string;
  read_time: number;
  category_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  tag_ids: string[];
}

export interface BlogListItem {
  id: string;
  title: string;
  summary: string;
  read_time: number;
  category_id: string;
  category_name: string;
  tag_names: string;
  created_at: Date;
  updated_at: Date;
}

const FormSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1),
  read_time: z.coerce.number().min(1),
  category_id: z.string().min(1),
  content: z.string().min(1),
  deleted_at: z.date().optional(),
});

const CreateBlog = FormSchema.omit({ id: true, deleted_at: true });
const UpdateBlog = FormSchema.omit({ id: true, deleted_at: true });

export type BlogState = {
  errors: {
    title?: string;
    summary?: string;
    read_time?: string;
    category_id?: string;
    content?: string;
  };
  message?: string;
};

function getTagIds(formData: FormData): string[] {
  return formData.getAll("tagIds").map(String);
}

async function getBlogTagIds(blogId: string): Promise<string[]> {
  const rows = await sql<{ tag_id: string }[]>`
    SELECT tag_id
    FROM blogs_tags
    WHERE blog_id=${blogId}
  `;

  return rows.map((row) => row.tag_id);
}

export async function createBlog(_prevState: BlogState, formData: FormData) {
  const validatedFields = CreateBlog.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    read_time: formData.get("read_time"),
    category_id: formData.get("category_id"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        title: fieldErrors.title?.[0],
        summary: fieldErrors.summary?.[0],
        read_time: fieldErrors.read_time?.[0],
        category: fieldErrors.category_id?.[0],
        content: fieldErrors.content?.[0],
      },
      message: "Missing fields. Failed to create blog post.",
    };
  }

  const tagIds = getTagIds(formData);
  const { title, summary, read_time, category_id, content } =
    validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      const [blog] = await transaction<{ id: string }[]>`
        INSERT INTO blogs (title, summary, read_time, category_id, content, updated_at)
        VALUES (${title}, ${summary}, ${read_time}, ${category_id}, ${content}, NOW())
        RETURNING id
      `;

      for (const tagId of tagIds) {
        await transaction`
          INSERT INTO blogs_tags (blog_id, tag_id)
          VALUES (${blog.id}, ${tagId})
        `;
      }
    });
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create blog post.",
    };
  }

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function listBlogs(): Promise<postgres.RowList<BlogListItem[]>> {
  try {
    const data = await sql<BlogListItem[]>`
      SELECT
        b.id,
        b.title,
        b.summary,
        b.read_time,
        b.category_id,
        c.name AS category_name,
        b.created_at,
        b.updated_at,
        COALESCE(STRING_AGG(t.name, ', ' ORDER BY t.name), '') AS tag_names
      FROM blogs b
      JOIN categories c ON b.category_id = c.id
      LEFT JOIN blogs_tags tb ON b.id = tb.blog_id
      LEFT JOIN tags t ON tb.tag_id = t.id AND t.deleted_at IS NULL
      WHERE b.deleted_at IS NULL
      GROUP BY b.id, c.name
      ORDER BY b.created_at DESC
    `;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch blogs data.");
  }
}

export async function updateBlog(
  id: string,
  _prevState: BlogState,
  formData: FormData,
) {
  const validatedFields = UpdateBlog.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    read_time: formData.get("read_time"),
    category_id: formData.get("category_id"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        title: fieldErrors.title?.[0],
        summary: fieldErrors.summary?.[0],
        read_time: fieldErrors.read_time?.[0],
        category_id: fieldErrors.category_id?.[0],
        content: fieldErrors.content?.[0],
      },
      message: "Missing fields. Failed to update blog post.",
    };
  }

  const tagIds = getTagIds(formData);
  const { title, summary, read_time, category_id, content } =
    validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      await transaction`
        UPDATE blogs
        SET title=${title},
            summary=${summary},
            read_time=${read_time},
            category_id=${category_id},
            content=${content},
            updated_at=NOW()
        WHERE id=${id}
      `;

      await transaction`DELETE FROM blogs_tags WHERE blog_id=${id}`;

      for (const tagId of tagIds) {
        await transaction`
          INSERT INTO blogs_tags (blog_id, tag_id)
          VALUES (${id}, ${tagId})
        `;
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update blog post.",
    };
  }

  revalidatePath("/blogs");
  redirect("/blogs");
}

export async function getBlog(id: string): Promise<BlogSchema | undefined> {
  try {
    const [blog] = await sql<
      Omit<BlogSchema, "tag_ids">[]
    >`SELECT * FROM blogs WHERE id=${id} AND deleted_at IS NULL`;

    if (!blog) {
      return undefined;
    }

    return {
      ...blog,
      tag_ids: await getBlogTagIds(id),
    };
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch blog post.");
  }
}

export async function deleteBlog(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE blogs SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete blog post.");
  }

  revalidatePath("/blogs");
  redirect("/blogs");
}
