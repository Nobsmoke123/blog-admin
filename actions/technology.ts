"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface TechnologySchema {
  id: string;
  name: string;
  deleted_at: Date | null;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  deleted_at: z.date(),
});

const CreateTechnology = FormSchema.omit({ id: true, deleted_at: true });
const UpdateTechnology = FormSchema.omit({ id: true, deleted_at: true });

export type TechnologyState = {
  errors: {
    name?: string;
  };
  message?: string;
};

export async function createTechnology(
  _prevState: TechnologyState,
  formData: FormData,
) {
  const validatedFields = CreateTechnology.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to create technology.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`INSERT INTO technologies (name) VALUES(${name})`;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create technology.",
    };
  }
  revalidatePath("/technologies");
  redirect("/technologies");
}

export async function listTechnologies(): Promise<
  postgres.RowList<TechnologySchema[]>
> {
  try {
    const data = await sql<
      TechnologySchema[]
    >`SELECT * FROM technologies WHERE deleted_at IS NULL ORDER BY id ASC`;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch technologies data.");
  }
}

export async function updateTechnology(
  id: string,
  _prevState: TechnologyState,
  formData: FormData,
) {
  const validatedFields = UpdateTechnology.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
      },
      message: "Missing fields. Failed to update technology.",
    };
  }

  const { name } = validatedFields.data;

  try {
    await sql`UPDATE technologies SET name=${name} WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update technology.",
    };
  }

  revalidatePath("/technologies");
  redirect("/technologies");
}

export async function getTechnology(
  id: string,
): Promise<TechnologySchema | undefined> {
  try {
    const [technology] = await sql<
      TechnologySchema[]
    >`SELECT * FROM technologies WHERE id=${id} AND deleted_at IS NULL`;
    return technology;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch technology.");
  }
}

export async function deleteTechnology(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE technologies SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete technology.");
  }

  revalidatePath("/technologies");
  redirect("/technologies");
}
