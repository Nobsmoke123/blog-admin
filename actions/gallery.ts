"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface GallerySchema {
  id: string;
  project_id: string;
  image: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface GalleryListItem {
  id: string;
  project_id: string;
  project_name: string;
  image: string;
}

const FormSchema = z.object({
  id: z.string(),
  project_id: z.string().min(1),
  image: z.string().min(1),
  deleted_at: z.date().optional(),
});

const CreateGallery = FormSchema.omit({ id: true, deleted_at: true });
const UpdateGallery = FormSchema.omit({ id: true, deleted_at: true });

export type GalleryState = {
  errors: {
    project_id?: string;
    image?: string;
  };
  message?: string;
};

export async function createGallery(
  _prevState: GalleryState,
  formData: FormData,
) {
  const validatedFields = CreateGallery.safeParse({
    project_id: formData.get("project_id"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        project_id: fieldErrors.project_id?.[0],
        image: fieldErrors.image?.[0],
      },
      message: "Missing fields. Failed to create gallery item.",
    };
  }

  const { project_id, image } = validatedFields.data;

  try {
    await sql`
      INSERT INTO gallery (project_id, image, updated_at)
      VALUES (${project_id}, ${image}, NOW())
    `;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create gallery item.",
    };
  }

  revalidatePath("/gallery");
  redirect("/gallery");
}

export async function listGallery(): Promise<
  postgres.RowList<GalleryListItem[]>
> {
  try {
    const data = await sql<GalleryListItem[]>`
      SELECT g.id, g.project_id, g.image, p.name AS project_name
      FROM gallery g
      JOIN projects p ON g.project_id = p.id
      WHERE g.deleted_at IS NULL
      ORDER BY g.created_at DESC
    `;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch gallery data.");
  }
}

export async function updateGallery(
  id: string,
  _prevState: GalleryState,
  formData: FormData,
) {
  const validatedFields = UpdateGallery.safeParse({
    project_id: formData.get("project_id"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        project_id: fieldErrors.project_id?.[0],
        image: fieldErrors.image?.[0],
      },
      message: "Missing fields. Failed to update gallery item.",
    };
  }

  const { project_id, image } = validatedFields.data;

  try {
    await sql`
      UPDATE gallery
      SET project_id=${project_id}, image=${image}, updated_at=NOW()
      WHERE id=${id}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update gallery item.",
    };
  }

  revalidatePath("/gallery");
  redirect("/gallery");
}

export async function getGallery(
  id: string,
): Promise<GallerySchema | undefined> {
  try {
    const [item] = await sql<
      GallerySchema[]
    >`SELECT * FROM gallery WHERE id=${id} AND deleted_at IS NULL`;
    return item;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch gallery item.");
  }
}

export async function deleteGallery(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE gallery SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete gallery item.");
  }

  revalidatePath("/gallery");
  redirect("/gallery");
}
