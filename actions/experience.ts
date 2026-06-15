"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface ExperienceSchema {
  id: string;
  company: string;
  role: string;
  duration: string;
  year: string;
  summary: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  technology_ids: string[];
}

const FormSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  duration: z.string().min(1),
  year: z.string().min(1),
  summary: z.string().min(1),
  deleted_at: z.date().optional(),
});

const CreateExperience = FormSchema.omit({ id: true, deleted_at: true });
const UpdateExperience = FormSchema.omit({ id: true, deleted_at: true });

export type ExperienceState = {
  errors: {
    company?: string;
    role?: string;
    duration?: string;
    year?: string;
    summary?: string;
  };
  message?: string;
};

function getTechnologyIds(formData: FormData): string[] {
  return formData.getAll("technologyIds").map(String);
}

async function getExperienceTechnologyIds(
  experienceId: string,
): Promise<string[]> {
  const rows = await sql<{ technology_id: string }[]>`
    SELECT technology_id
    FROM experiences_technologies
    WHERE experience_id=${experienceId}
  `;

  return rows.map((row) => row.technology_id);
}

export async function createExperience(
  _prevState: ExperienceState,
  formData: FormData,
) {
  const validatedFields = CreateExperience.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    duration: formData.get("duration"),
    year: formData.get("year"),
    summary: formData.get("summary"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        company: fieldErrors.company?.[0],
        role: fieldErrors.role?.[0],
        duration: fieldErrors.duration?.[0],
        year: fieldErrors.year?.[0],
        summary: fieldErrors.summary?.[0],
      },
      message: "Missing fields. Failed to create experience.",
    };
  }

  const technologyIds = getTechnologyIds(formData);

  const { company, role, duration, year, summary } = validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      const [experience] = await transaction<{ id: string }[]>`
        INSERT INTO experiences (company, role, duration, year, summary, updated_at)
        VALUES (${company}, ${role}, ${duration}, ${year}, ${summary}, NOW())
        RETURNING id
      `;

      for (const technologyId of technologyIds) {
        await transaction`
          INSERT INTO experiences_technologies (experience_id, technology_id)
          VALUES (${experience.id}, ${technologyId})
        `;
      }
    });
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create experience.",
    };
  }

  revalidatePath("/experiences");
  redirect("/experiences");
}

export async function listExperiences(): Promise<ExperienceSchema[]> {
  try {
    const experiences = await sql<
      Omit<ExperienceSchema, "technology_ids">[]
    >`SELECT id, company, role, duration, created_at, updated_at FROM experiences WHERE deleted_at IS NULL ORDER BY year DESC`;

    return Promise.all(
      experiences.map(async (experience) => ({
        ...experience,
        technology_ids: await getExperienceTechnologyIds(experience.id),
      })),
    );
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch experiences data.");
  }
}

export async function updateExperience(
  id: string,
  _prevState: ExperienceState,
  formData: FormData,
) {
  const validatedFields = UpdateExperience.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    duration: formData.get("duration"),
    year: formData.get("year"),
    summary: formData.get("summary"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        company: fieldErrors.company?.[0],
        role: fieldErrors.role?.[0],
        duration: fieldErrors.duration?.[0],
        year: fieldErrors.year?.[0],
        summary: fieldErrors.summary?.[0],
      },
      message: "Missing fields. Failed to update experience.",
    };
  }

  const technologyIds = getTechnologyIds(formData);
  const { company, role, duration, year, summary } = validatedFields.data;

  try {
    await sql.begin(async (transaction) => {
      await transaction`
        UPDATE experiences
        SET company=${company},
            role=${role},
            duration=${duration},
            year=${year},
            summary=${summary},
            updated_at=NOW()
        WHERE id=${id}
      `;

      await transaction`DELETE FROM experiences_technologies WHERE experience_id=${id}`;

      for (const technologyId of technologyIds) {
        await transaction`
          INSERT INTO experiences_technologies (experience_id, technology_id)
          VALUES (${id}, ${technologyId})
        `;
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update experience.",
    };
  }

  revalidatePath("/experiences");
  redirect("/experiences");
}

export async function getExperience(
  id: string,
): Promise<ExperienceSchema | undefined> {
  try {
    const [experience] = await sql<
      Omit<ExperienceSchema, "technology_ids">[]
    >`SELECT * FROM experiences WHERE id=${id} AND deleted_at IS NULL`;

    if (!experience) {
      return undefined;
    }

    return {
      ...experience,
      technology_ids: await getExperienceTechnologyIds(id),
    };
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch experience.");
  }
}

export async function deleteExperience(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE experiences SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete experience.");
  }

  revalidatePath("/experiences");
  redirect("/experiences");
}
