import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class UsersService {
  static async register(data: RegisterUserInput) {
    // 1. Check if user with given email already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUsers.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password with bcrypt
    const hashedPassword = await Bun.password.hash(data.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Insert new user into database
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return { success: true };
  }
}
