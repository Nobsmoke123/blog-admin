"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface CategorySchema {
  id: string;
  name: string;
  deleted_at: Date | null;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  deleted_at: z.date(),
});

const CreateCategory = FormSchema.omit({ id: true, deleted_at: true });
const UpdateCategory = FormSchema.omit({ id: true, deleted_at: true });

export type CategoryState = {
  errors: {
    name?: string;
  };
  message?: string;
};

export async function createCategory(
  _prevState: CategoryState,
  formData: FormData,
) {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to create category.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`INSERT INTO categories (name) VALUES(${name})`;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create catagory.",
    };
  }
  revalidatePath("/categories");
  redirect("/categories");
}

export async function listCategories(): Promise<
  postgres.RowList<CategorySchema[]>
> {
  try {
    const data = await sql<
      CategorySchema[]
    >`SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY id ASC`;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch categories data.");
  }
}

export async function updateCategory(
  id: string,
  _prevState: CategoryState,
  formData: FormData,
) {
  const validatedFields = UpdateCategory.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to update category.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`UPDATE categories SET name=${name} WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update category.",
    };
  }

  revalidatePath("/categories");
  redirect("/categories");
}

export async function getCategory(
  id: string,
): Promise<CategorySchema | undefined> {
  try {
    const [category] = await sql<
      CategorySchema[]
    >`SELECT * FROM categories WHERE id=${id} AND deleted_at IS NULL`;
    return category;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch category.");
  }
}

export async function deleteCategory(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE categories SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete category.");
  }

  revalidatePath("/categories");
  redirect("/categories");
}
