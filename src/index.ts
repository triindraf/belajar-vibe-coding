import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  // Health check endpoint
  .get("/", () => ({
    status: "ok",
    message: "Server ElysiaJS + Bun + Drizzle + MySQL is running! 🚀",
    timestamp: new Date().toISOString(),
  }))

  // Mount Users routes
  .use(usersRoute)
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
