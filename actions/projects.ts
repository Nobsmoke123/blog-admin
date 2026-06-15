"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface ProjectSchema {
  id: string;
  name: string;
  summary: string;
  overview: string;
  year: string;
  category_id: string;
  cover_image: string;
  live_url: string;
  source_code: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  technology_ids: string[];
}

export interface ProjectListItem {
  id: string;
  name: string;
  year: string;
  live_url: string;
  cover_image: string;
  source_code: string;
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  summary: z.string().min(1),
  overview: z.string().min(1),
  year: z.string().min(1),
  category_id: z.string().min(1),
  cover_image: z.string(),
  live_url: z.string(),
  source_code: z.string(),
  deleted_at: z.date().optional(),
});

const CreateProject = FormSchema.omit({ id: true, deleted_at: true });
const UpdateProject = FormSchema.omit({ id: true, deleted_at: true });

export type ProjectState = {
  errors: {
    name?: string;
    summary?: string;
    overview?: string;
    year?: string;
    category_id?: string;
    cover_image?: string;
    live_url?: string;
    source_code?: string;
  };
  message?: string;
};

function getTechnologyIds(formData: FormData): string[] {
  return formData.getAll("technologyIds").map(String);
}

async function getProjectTechnologyIds(projectId: string): Promise<string[]> {
  const rows = await sql<{ technology_id: string }[]>`
    SELECT technology_id
    FROM projects_technologies
    WHERE project_id=${projectId}
  `;

  return rows.map((row) => row.technology_id);
}

export async function createProject(
  _prevState: ProjectState,
  formData: FormData,
) {
  const validatedFields = CreateProject.safeParse({
    name: formData.get("name"),
    summary: formData.get("summary"),
    overview: formData.get("overview"),
    year: formData.get("year"),
    category_id: formData.get("category_id"),
    cover_image: formData.get("cover_image") || "",
    live_url: formData.get("live_url") || "",
    source_code: formData.get("source_code") || "",
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
        summary: fieldErrors.summary?.[0],
        overview: fieldErrors.overview?.[0],
        year: fieldErrors.year?.[0],
        category_id: fieldErrors.category_id?.[0],
        cover_image: fieldErrors.cover_image?.[0],
        live_url: fieldErrors.live_url?.[0],
        source_code: fieldErrors.source_code?.[0],
      },
      message: "Missing fields. Failed to create project.",
    };
  }

  const technologyIds = getTechnologyIds(formData);
  const {
    name,
    summary,
    overview,
    year,
    category_id,
    cover_image,
    live_url,
    source_code,
  } = validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      const [project] = await transaction<{ id: string }[]>`
        INSERT INTO projects (
          name,
          summary,
          overview,
          year,
          category_id,
          cover_image,
          live_url,
          source_code,
          updated_at
        )
        VALUES (
          ${name},
          ${summary},
          ${overview},
          ${year},
          ${category_id},
          ${cover_image},
          ${live_url},
          ${source_code},
          NOW()
        )
        RETURNING id
      `;

      for (const technologyId of technologyIds) {
        await transaction`
          INSERT INTO projects_technologies (project_id, technology_id)
          VALUES (${project.id}, ${technologyId})
        `;
      }
    });
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create project.",
    };
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function listProjects(): Promise<
  postgres.RowList<ProjectListItem[]>
> {
  try {
    const data = await sql<ProjectListItem[]>`
      SELECT id, name, year, live_url, source_code, cover_image
      FROM projects
      WHERE deleted_at IS NULL
      ORDER BY year DESC
    `;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch projects data.");
  }
}

export async function updateProject(
  id: string,
  _prevState: ProjectState,
  formData: FormData,
) {
  const validatedFields = UpdateProject.safeParse({
    name: formData.get("name"),
    summary: formData.get("summary"),
    overview: formData.get("overview"),
    year: formData.get("year"),
    category_id: formData.get("category_id"),
    cover_image: formData.get("cover_image") || "",
    live_url: formData.get("live_url") || "",
    source_code: formData.get("source_code") || "",
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        name: fieldErrors.name?.[0],
        summary: fieldErrors.summary?.[0],
        overview: fieldErrors.overview?.[0],
        year: fieldErrors.year?.[0],
        category_id: fieldErrors.category_id?.[0],
        cover_image: fieldErrors.cover_image?.[0],
        live_url: fieldErrors.live_url?.[0],
        source_code: fieldErrors.source_code?.[0],
      },
      message: "Missing fields. Failed to update project.",
    };
  }

  const technologyIds = getTechnologyIds(formData);
  const {
    name,
    summary,
    overview,
    year,
    category_id,
    cover_image,
    live_url,
    source_code,
  } = validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      await transaction`
        UPDATE projects
        SET name=${name},
            summary=${summary},
            overview=${overview},
            year=${year},
            category_id=${category_id},
            cover_image=${cover_image},
            live_url=${live_url},
            source_code=${source_code},
            updated_at=NOW()
        WHERE id=${id}
      `;

      await transaction`DELETE FROM projects_technologies WHERE project_id=${id}`;

      for (const technologyId of technologyIds) {
        await transaction`
          INSERT INTO projects_technologies (project_id, technology_id)
          VALUES (${id}, ${technologyId})
        `;
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update project.",
    };
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function getProject(
  id: string,
): Promise<ProjectSchema | undefined> {
  try {
    const [project] = await sql<
      Omit<ProjectSchema, "technology_ids">[]
    >`SELECT * FROM projects WHERE id=${id} AND deleted_at IS NULL`;

    if (!project) {
      return undefined;
    }

    return {
      ...project,
      technology_ids: await getProjectTechnologyIds(id),
    };
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch project.");
  }
}

export async function deleteProject(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE projects SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete project.");
  }

  revalidatePath("/projects");
  redirect("/projects");
}
