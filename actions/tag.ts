"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface TagSchema {
  id: string;
  name: string;
  deleted_at: Date | null;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  deleted_at: z.date(),
});

const CreateTag = FormSchema.omit({ id: true, deleted_at: true });
const UpdateTag = FormSchema.omit({ id: true, deleted_at: true });

export type TagState = {
  errors: {
    name?: string;
  };
  message?: string;
};

export async function createTag(
  _prevState: TagState,
  formData: FormData,
) {
  const validatedFields = CreateTag.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to create tag.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`INSERT INTO tags (name) VALUES(${name})`;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create tag.",
    };
  }
  revalidatePath("/tags");
  redirect("/tags");
}

export async function listTags(): Promise<postgres.RowList<TagSchema[]>> {
  try {
    const data = await sql<
      TagSchema[]
    >`SELECT * FROM tags WHERE deleted_at IS NULL ORDER BY id ASC`;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch tags data.");
  }
}

export async function updateTag(
  id: string,
  _prevState: TagState,
  formData: FormData,
) {
  const validatedFields = UpdateTag.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to update tag.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`UPDATE tags SET name=${name} WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update tag.",
    };
  }

  revalidatePath("/tags");
  redirect("/tags");
}

export async function getTag(id: string): Promise<TagSchema | undefined> {
  try {
    const [tag] = await sql<
      TagSchema[]
    >`SELECT * FROM tags WHERE id=${id} AND deleted_at IS NULL`;
    return tag;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch tag.");
  }
}

export async function deleteTag(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE tags SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete tag.");
  }

  revalidatePath("/tags");
  redirect("/tags");
}
