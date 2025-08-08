import request from "supertest";
import app from "../../index";
import { User } from "../../models/User";
import { Post } from "../../models/Post";

let token: string;
let userId: number;
let postId: number;

describe("Post Endpoints", () => {
  beforeAll(async () => {
    await User.destroy({ where: { email: "posttest@example.com" } });
    const user = await request(app)
      .post("/register")
      .send({ name: "Post Tester", email: "posttest@example.com", password: "password123" });
    userId = user.body.data.id;

    const res = await request(app)
      .post("/login")
      .send({ email: "posttest@example.com", password: "password123" });
    token = res.body.data.token;
    await Post.destroy({ where: { authorId: userId } });
  });

  afterAll(async () => {
    await Post.destroy({ where: { authorId: userId } });
    await User.destroy({ where: { email: "posttest@example.com" } });
  });

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Hello World" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("content", "Hello World");
    postId = res.body.data.id;
  });

  it("should get all posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get a post by id", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("id", postId);
  });

  it("should update a post", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Updated Content" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("content", "Updated Content");
  });

  it("should not update a post with invalid input", async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });

  it("should return 404 for deleted post", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.statusCode).toEqual(404);
  });
});