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
  );
