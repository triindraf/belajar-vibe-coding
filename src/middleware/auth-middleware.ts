import { Elysia } from "elysia";

export const authMiddleware = new Elysia({ name: "auth" })
  .derive({ as: "scoped" }, ({ headers }) => {
    const authorization = headers["authorization"];
    const token =
      authorization && authorization.startsWith("Bearer ")
        ? authorization.slice(7).trim() || null
        : null;

    return { token };
  });
