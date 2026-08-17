import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

describe("Elysia Health Check", () => {
  it("returns status ok from / endpoint", async () => {
    const app = new Elysia().get("/", () => ({
      status: "ok",
      message: "Server ElysiaJS + Bun + Drizzle + MySQL is running! 🚀",
      timestamp: new Date().toISOString(),
    }));

    const response = await app
      .handle(new Request("http://localhost/"))
      .then((res) => res.json());

    expect(response.status).toBe("ok");
    expect(response.message).toContain("ElysiaJS");
  });
});
