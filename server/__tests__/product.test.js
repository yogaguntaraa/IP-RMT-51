const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt")
const { queryInterface } = sequelize;

const productData = require("../data/product.json");
const categoryData = require("../data/category.json");
// const userData = require("../data/user.json");

const registerUser = {
  email: "user1@mail.com",
  password: hashPassword("user123"),
  phoneNumber: "081234567890",
  username: "user1",
};

let registerUserToken = null;
let tokenAdmin = null;

beforeAll(async () => {
  let user = await User.create(registerUser)
  registerUserToken = signToken({ userId: user.id });
  tokenAdmin = signToken({ userId: 1 })
  await queryInterface.bulkInsert('Users', [{
    username: 'admin',
    email: 'admin@mail.com',
    password: hashPassword("admin123"),
    role: 'Admin',
    phoneNumber: "1234567890",
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {});
  await queryInterface.bulkInsert(
    "Categories",
    categoryData.map((e) => {
      delete e.id
      e.createdAt = e.updatedAt = new Date();
      return e;
    }, {})
  );
  await queryInterface.bulkInsert(
    "Products",
    productData.map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    }, {})
  );
});

afterAll(async () => {
  await queryInterface.bulkDelete("Products", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  });

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  });

  await queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true
  });

  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

});


describe("/products", () => {
  describe("POST /products", () => {
    test("Success create product", async () => {
      const { status, body } = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(201);
      expect(body).toEqual(
        expect.objectContaining({
          product: expect.objectContaining({
            name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL",
            description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
            price: 133000,
            stock: 100,
            imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
            CategoryId: 1,
          }),
        }),
      );
    });

    test("Failed to create product because not logged in ", async () => {
      const { status, body } = await request(app)
        .post("/products")
        .send({
          name: 'T-Shirt polos',
          description: 'T-Shirt polos dengan desain simpel dan nyaman dipakai sehari-hari.',
          price: 90000,
          stock: 27,
          imgUrl: 'https://res.cloudinary.com/dsqxenlvc/image/upload/v1721823817/xtckc6obuuvopulcf9an.jpg',
          categoryId: 1,
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to create product because token is invalid", async () => {
      const { status, body } = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${tokenAdmin}x`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to create a product because the request body did not match ", async () => {
      const { status, body } = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name: "",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Name cannot be empty",
      });
    });
  });

  describe("PUT /products/:id", () => {
    test("Success update product", async () => {
      const { status, body } = await request(app)
        .put("/products/1")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(200);
      expect(body).toMatchObject({
        product: {
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
          authorId: 1
        }
      })
    });

    test("Failed to update product because not logged in ", async () => {
      const { status, body } = await request(app)
        .put("/products/1")
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to update product because token is invalid", async () => {
      const { status, body } = await request(app)
        .put("/products/1")
        .set("Authorization", `Bearer ${tokenAdmin}x`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to update product because id not found ", async () => {
      const { status, body } = await request(app)
        .put("/products/1000000000")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(404);
      expect(body).toEqual({
        message: "Data Not Found",
      });
    });

    test("Failed to update product because empty description ", async () => {
      const { status, body } = await request(app)
        .put("/products/1")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL update",
          description: "",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
        });
      expect(status).toBe(400);
      expect(body).toEqual({
        message: "Description cannot be empty",
      });
    });
  });

  describe("DELETE /products/:id", () => {
    test("Success delete product", async () => {
      const { status, body } = await request(app)
        .delete("/products/3")
        .set("Authorization", `Bearer ${tokenAdmin}`)

      expect(status).toBe(200);
      expect(body).toEqual({
        message: "Product has been deleted"
      });
    });

    test("Failed to delete product because not logged in ", async () => {
      const { status, body } = await request(app)
        .delete("/products/1")

      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to delete product because token is invalid", async () => {
      const { status, body } = await request(app)
        .delete("/products/1")
        .set("Authorization", `Bearer ${tokenAdmin}x`)

      expect(status).toBe(401);
      expect(body).toEqual({
        message: "Unaunthenticated",
      });
    });

    test("Failed to delete product because id not found ", async () => {
      const { status, body } = await request(app)
        .delete("/products/1000000000")
        .set("Authorization", `Bearer ${tokenAdmin}`)

      expect(status).toBe(404);
      expect(body).toEqual({
        message: "Data Not Found",
      });
    });
  });
});

describe("/pub/products", () => {
  describe("GET /pub/products", () => {
    test("Success get all product public", async () => {
      const { status, body } = await request(app)
        .get("/pub/products")
        .set("Authorization", `Bearer ${registerUserToken}`)

      expect(status).toBe(200)
      expect(body).toEqual(
        expect.objectContaining({
          page: 1,
          data: expect.any(Array),
          totalData: 15,
          totalPage: 2,
          dataPerPage: 10
        }),
      );
    });

    test("Success get product use 1 query filter", async () => {
      const { status, body } = await request(app)
        .get("/pub/products?filter=1")
        .set("Authorization", `Bearer ${registerUserToken}`)

      expect(status).toBe(200)
      expect(body).toEqual(
        expect.objectContaining({
          page: 1,
          data: expect.any(Array),
          totalData: 1,
          totalPage: 1,
          dataPerPage: 10
        }),
      );
    });

    test("Success get product with pagination", async () => {
      const { status, body } = await request(app)
        .get("/pub/products?page[number]=2&page[size]=5")
        .set("Authorization", `Bearer ${registerUserToken}`)

      expect(status).toBe(200)
      expect(body).toMatchObject({
        page: 2,
        data: expect.any(Array),
        totalData: 13,
        totalPage: 3,
        dataPerPage: 5
      })
    });
  });
});

describe("GET /pub/products/:id", () => {
  test("Success get product public by id", async () => {
    const { status, body } = await request(app)
      .get("/pub/products/1")
      .set("Authorization", `Bearer ${registerUserToken}`)

    expect(status).toBe(200);
    expect(body).toMatchObject(
      {
        product: {
          id: 1,
          name: "SURIA GAMIS MALAYSIA CERUTY BABYDOLL",
          description: "ceruty babydoll premium, Full puring sampai bawah, Busui dan wudhu friendly, Model belah kiri kanan",
          price: 133000,
          stock: 100,
          imgUrl: "https://res.cloudinary.com/dsqxenlvc/image/upload/v1722939436/products/wszaexj3o3u0z9w83yim.png",
          CategoryId: 1,
          AuthorId: 1,
          User: {
            id: 1,
            username: "admin",
            email: "admin@mail.com",
            role: "Admin",
            phoneNumber: "1234567890"
          }
        }
      })
  });

  test("Failed to get product public by id because id not found", async () => {
    const { status, body } = await request(app)
      .get("/pub/products/10000")
      .set("Authorization", `Bearer ${registerUserToken}`)

    expect(status).toBe(404);
    expect(body).toEqual({
      message: "Data Not Found",
    });
  });
});
