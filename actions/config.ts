"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface ConfigSchema {
  id: string;
  key: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

const FormSchema = z.object({
  id: z.string(),
  key: z.string().min(1),
  value: z.string().min(1),
  deleted_at: z.date(),
});

const CreateConfig = FormSchema.omit({ id: true, deleted_at: true });
const UpdateConfig = FormSchema.omit({ id: true, deleted_at: true });

export type ConfigState = {
  errors: {
    key?: string;
    value?: string;
  };
  message?: string;
};

export async function createConfig(
  _prevState: ConfigState,
  formData: FormData,
) {
  const validatedFields = CreateConfig.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        key: fieldErrors.key?.[0],
        value: fieldErrors.value?.[0],
      },
      message: "Missing fields. Failed to create config.",
    };
  }

  const { key, value } = validatedFields.data;

  try {
    await sql`INSERT INTO configs (key, value, updated_at) VALUES(${key}, ${value}, NOW())`;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create config.",
    };
  }
  revalidatePath("/configs");
  redirect("/configs");
}

export async function listConfigs(): Promise<postgres.RowList<ConfigSchema[]>> {
  try {
    const data = await sql<
      ConfigSchema[]
    >`SELECT * FROM configs WHERE deleted_at IS NULL ORDER BY key ASC`;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch configs data.");
  }
}

export async function updateConfig(
  id: string,
  _prevState: ConfigState,
  formData: FormData,
) {
  const validatedFields = UpdateConfig.safeParse({
    key: formData.get("key"),
    value: formData.get("value"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        key: fieldErrors.key?.[0],
        value: fieldErrors.value?.[0],
      },
      message: "Missing fields. Failed to update config.",
    };
  }

  const { key, value } = validatedFields.data;

  try {
    await sql`UPDATE configs SET key=${key}, value=${value}, updated_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update config.",
    };
  }

  revalidatePath("/configs");
  redirect("/configs");
}

export async function getConfig(
  id: string,
): Promise<ConfigSchema | undefined> {
  try {
    const [config] = await sql<
      ConfigSchema[]
    >`SELECT * FROM configs WHERE id=${id} AND deleted_at IS NULL`;
    return config;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch config.");
  }
}

export async function deleteConfig(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE configs SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete config.");
  }

  revalidatePath("/configs");
  redirect("/configs");
}
