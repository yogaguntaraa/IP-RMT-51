const { Product, User, Category } = require("../models");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
})

class ProductController {

    static async getProduct(req, res, next) {
        const options = {
            order: [["id", "ASC"]],
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: "password"
                    }
                },
                {
                    model: Category,
                    attributes: ["name"]
                },
            ],
        }
        try {
            const product = await Product.findAll(options);
            res.status(200).json({ product });
        } catch (err) {
            next(err)
        }
    }

    static async createProduct(req, res, next) {
        try {
            const { name, description, price, stock, imgUrl, CategoryId } = req.body;
            const product = await Product.create({
                name,
                description,
                price,
                stock,
                imgUrl,
                AuthorId: req.user.id,
                CategoryId,
            });
            console.log(product)
            res.status(201).json({ product });
        } catch (err) {
            next(err)
        }
    }

    static async getProductById(req, res, next) {
        const options = {
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: "password"
                    }
                },
                {
                    model: Category,
                    attributes: ["name"]
                },
            ],
        }
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, options)

            if (!product) {
                throw { name: "NotFound" }
            }
            res.status(200).json({ product })
        } catch (err) {
            next(err)
        }
    }

    static async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description, price, stock, imgUrl, CategoryId } = req.body;

            const product = await Product.findByPk(id);

            if (!product) {
                throw { name: "NotFound" }
            }
            await product.update({
                name,
                description,
                price,
                stock,
                imgUrl,
                CategoryId
            });

            res.status(200).json( {product} )
        } catch (err) {
            next(err)
        }
    }

    static async updateProductImgById(req, res, next) {
        try {
            const { id } = req.params;
            const { file } = req;

            if (!file) {
                throw { name: "Image is required" };
            }

            const product = await Product.findByPk(id);
            if (!product) {
                throw { name: "NotFound" };
            }

            const base64 = file.buffer.toString("base64");
            const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64}`);

            await product.update({ imgUrl: result.secure_url });
            res.status(200).json({ message: "product imgUrl has been changed to " + result.url })
        } catch (err) {
            next(err)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);

            if (!product) {
                throw { name: "NotFound" }
            }
            await product.destroy();
            res.status(200).json({
                message: "Product has been deleted"
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = ProductController;