"use server";

import z from "zod";
import { sql } from "./database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import postgres from "postgres";

export interface TaskSchema {
  id: string;
  experience_id: string;
  task: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TaskListItem extends TaskSchema {
  experience_name: string;
}

const FormSchema = z.object({
  id: z.string(),
  experience_id: z.string().min(1),
  task: z.string().min(1),
  deleted_at: z.date().optional(),
});

const CreateTask = FormSchema.omit({ id: true, deleted_at: true });
const UpdateTask = FormSchema.omit({ id: true, deleted_at: true });

export type TaskState = {
  errors: {
    experience_id?: string;
    task?: string;
  };
  message?: string;
};

export async function createTask(_prevState: TaskState, formData: FormData) {
  const validatedFields = CreateTask.safeParse({
    experience_id: formData.get("experience_id"),
    task: formData.get("task"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        experience_id: fieldErrors.experience_id?.[0],
        task: fieldErrors.task?.[0],
      },
      message: "Missing fields. Failed to create task.",
    };
  }

  const { experience_id, task } = validatedFields.data;

  try {
    await sql`INSERT INTO tasks (experience_id, task, updated_at) VALUES(${experience_id}, ${task}, NOW())`;
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message: "Database Error: Failed to create task.",
    };
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function listTasks(): Promise<postgres.RowList<TaskListItem[]>> {
  try {
    const data = await sql<TaskListItem[]>`
      SELECT t.id, t.task, t.created_at, t.updated_at, e.company AS experience_name
      FROM tasks t
      JOIN experiences e ON t.experience_id = e.id
      WHERE t.deleted_at IS NULL
      ORDER BY e.year DESC
    `;
    return data;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch tasks data.");
  }
}

export async function updateTask(
  id: string,
  _prevState: TaskState,
  formData: FormData,
) {
  const validatedFields = UpdateTask.safeParse({
    experience_id: formData.get("experience_id"),
    task: formData.get("task"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    return {
      errors: {
        experience_id: fieldErrors.experience_id?.[0],
        task: fieldErrors.task?.[0],
      },
      message: "Missing fields. Failed to update task.",
    };
  }

  const { experience_id, task } = validatedFields.data;

  try {
    await sql`
      UPDATE tasks
      SET experience_id=${experience_id}, task=${task}, updated_at=NOW()
      WHERE id=${id}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to update task.",
    };
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function getTask(id: string): Promise<TaskSchema | undefined> {
  try {
    const [task] = await sql<
      TaskSchema[]
    >`SELECT * FROM tasks WHERE id=${id} AND deleted_at IS NULL`;
    return task;
  } catch (error) {
    console.error("Database error ", error);
    throw new Error("Failed to fetch task.");
  }
}

export async function deleteTask(id: string, _formData?: FormData) {
  try {
    await sql`UPDATE tasks SET deleted_at=NOW() WHERE id=${id}`;
  } catch (error) {
    console.error("Database Error: ", error);
    throw new Error("Database Error: Failed to delete task.");
  }

  revalidatePath("/tasks");
  redirect("/tasks");
}
