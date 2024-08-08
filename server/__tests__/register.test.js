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

describe("POST /register", () => {
    test("Success register", async () => {
        const response = await request(app).post("/register").send({
            email: "user1@mail.com",
            password: "user123",
            phoneNumber: "081234567890",
            username: "user1",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id", expect.any(Number));
        expect(response.body).toHaveProperty("email", expect.any(String));
    });
});