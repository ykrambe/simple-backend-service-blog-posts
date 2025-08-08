import request from "supertest";
import app from "../../index";
import { User } from "../../models/User";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await User.destroy({ where: { email: "test@example.com" } });
  });

  afterAll(async () => {
    await User.destroy({ where: { email: "test@example.com" } });
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ name: "Test User", email: "test@example.com", password: "password123" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "User created");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("email", "test@example.com");
    expect(res.body.data).toHaveProperty("name", "Test User");
    expect(res.body.data).toHaveProperty("createdAt");
    expect(res.body.data).toHaveProperty("updatedAt");
  });

  it("should login and return a JWT token", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Login successful");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data).toHaveProperty("user");
  });
});