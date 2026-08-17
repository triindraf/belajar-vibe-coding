import { describe, expect, it, spyOn } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";
import { UsersService } from "../src/services/users-service";

describe("Users Registration API", () => {
  const app = new Elysia().use(usersRoute);

  it("successfully registers a user and returns { data: 'OK' }", async () => {
    spyOn(UsersService, "register").mockResolvedValueOnce({ success: true } as any);

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "tri",
          email: "tri@localhost",
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ data: "OK" });
  });

  it("returns error response if email is already registered", async () => {
    spyOn(UsersService, "register").mockRejectedValueOnce(
      new Error("Email sudah terdaftar")
    );

    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "tri",
          email: "tri@localhost",
          password: "rahasia",
        }),
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "Email sudah terdaftar" });
  });

  it("returns 422 if payload is invalid (missing fields)", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "tri@localhost",
        }),
      })
    );

    expect(response.status).toBe(422);
  });
});
