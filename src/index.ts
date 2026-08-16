import { Elysia, t } from "elysia";
import { db, schema } from "./db";
import { users } from "./db/schema";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  // Health check endpoint
  .get("/", () => ({
    status: "ok",
    message: "Server ElysiaJS + Bun + Drizzle + MySQL is running! 🚀",
    timestamp: new Date().toISOString(),
  }))

  // Example CRUD routes for Users
  .group("/api/users", (app) =>
    app
      .get("/", async () => {
        try {
          const allUsers = await db.select().from(users);
          return {
            success: true,
            data: allUsers,
          };
        } catch (error: any) {
          return {
            success: false,
            message: "Failed to fetch users or database is not connected yet.",
            error: error?.message,
          };
        }
      })
      .post(
        "/",
        async ({ body, set }) => {
          try {
            const result = await db.insert(users).values({
              name: body.name,
              email: body.email,
            });
            set.status = 201;
            return {
              success: true,
              message: "User created successfully",
              data: result,
            };
          } catch (error: any) {
            set.status = 500;
            return {
              success: false,
              message: "Failed to create user.",
              error: error?.message,
            };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
          }),
        }
      )
  )
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
