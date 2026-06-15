"use server";

import bcrypt from "bcryptjs";
import { sql } from "./database";

export interface UserSchema {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export async function getUserByEmail(
  email: string,
): Promise<UserSchema | undefined> {
  try {
    const [user] = await sql<UserSchema[]>`
      SELECT id, email, username, password, created_at, updated_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    return user;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}
