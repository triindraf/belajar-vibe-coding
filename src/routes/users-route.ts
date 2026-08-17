import { Elysia, t } from "elysia";
import { UsersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        await UsersService.register(body);
        return {
          data: "OK",
        };
      } catch (error: any) {
        if (error?.message === "Email sudah terdaftar") {
          set.status = 400;
          return {
            error: "Email sudah terdaftar",
          };
        }

        set.status = 500;
        return {
          error: error?.message || "Terjadi kesalahan pada server",
        };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const result = await UsersService.login(body);
        return {
          data: result.token,
        };
      } catch (error: any) {
        if (error?.message === "Email atau Password Salah") {
          set.status = 400;
          return {
            error: "Email atau Password Salah",
          };
        }

        set.status = 500;
        return {
          error: error?.message || "Terjadi kesalahan pada server",
        };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/current", async ({ headers, set }) => {
    try {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      const token = authorization.slice(7).trim();
      if (!token) {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      const user = await UsersService.getCurrentUser(token);
      return {
        data: user,
      };
    } catch (error: any) {
      if (error?.message === "Unauthorized") {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      set.status = 500;
      return {
        error: error?.message || "Terjadi kesalahan pada server",
      };
    }
  })
  .delete("/logout", async ({ headers, set }) => {
    try {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      const token = authorization.slice(7).trim();
      if (!token) {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      await UsersService.logout(token);
      return {
        data: "OK",
      };
    } catch (error: any) {
      if (error?.message === "Unauthorized") {
        set.status = 401;
        return {
          error: "Unauthorized",
        };
      }

      set.status = 500;
      return {
        error: error?.message || "Terjadi kesalahan pada server",
      };
    }
  });
