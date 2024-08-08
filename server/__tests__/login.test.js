const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");



beforeAll(async () => {
  await User.create({
    email: "user1@mail.com",
    password: hashPassword("user123"),
    phoneNumber: "081234567890",
    username: "user1",
  });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /login", () => {
  test("Success login", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "user123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", expect.any(String));
    expect(response.body).toHaveProperty("role", expect.any(String));
    expect(response.body).toHaveProperty("username", expect.any(String));
  });

  test("Failed login because empty email", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "user123",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and Password are required",
    });
  });

  test("Failed login because empty password", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and Password are required",
    });
  });

  test("Failed login because invalid email", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.coma",
      password: "user123",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Email or Password is incorrect",
    });
  });

  test("Failed login because invalid password", async () => {
    const response = await request(app).post("/login").send({
      email: "user1@mail.com",
      password: "user123a",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Email or Password is incorrect",
    });
  });
});
