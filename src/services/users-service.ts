import { eq } from "drizzle-orm";
import { db } from "../db";
import { session, users } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
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

  static async login(data: LoginUserInput) {
    // 1. Check if user with given email exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUsers.length === 0) {
      throw new Error("Email atau Password Salah");
    }

    const user = existingUsers[0];

    // 2. Verify password with bcrypt hash
    const isPasswordValid = await Bun.password.verify(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email atau Password Salah");
    }

    // 3. Generate UUID token
    const token = crypto.randomUUID();

    // 4. Store session in database
    await db.insert(session).values({
      token,
      userId: user.id,
    });

    return { token };
  }

  static async getCurrentUser(token: string) {
    // Join session and users table to find active user by session token
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(session)
      .innerJoin(users, eq(session.userId, users.id))
      .where(eq(session.token, token))
      .limit(1);

    if (result.length === 0) {
      throw new Error("Unauthorized");
    }

    return result[0];
  }
}
