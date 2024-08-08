const { Product, User, Category, Order } = require("../models");
const { Op } = require("sequelize");
const midtransClient = require('midtrans-client');
const getGeminiResponse = require("../helpers/gemini");
const axios = require("axios")

class PublicController {
    static async getProductPublic(req, res, next) {
        try {
            console.log(req.query)
            const { search, sort, filter, page } = req.query;

            const options = {
                include: {
                    model: User,
                    attributes: {
                        exclude: "password",
                    },
                },
                where: {}
            };

            if (search) {
                options.where.name = {
                    [Op.iLike]: `%${search}%`,
                }
            }

            if (filter) {
                options.where.CategoryId = filter;
            }

            if (sort) {
                const order = sort[0] === "-" ? "DESC" : "ASC";
                const key = sort.replace("-", "");
                options.order = [[key, order]]
            }

            let limit = 10;
            let pageNumber = 1;

            if (page) {
                if (page.size) {
                    limit = page.size;
                    options.limit = limit;
                }
                if (page.number) {
                    pageNumber = page.number;
                    options.offset = (pageNumber - 1) * limit;
                }
            }

            const { count, rows } = await Product.findAndCountAll(options);
            res.status(200).json({
                page: +pageNumber,
                data: rows,
                totalData: count,
                totalPage: Math.ceil(count / limit),
                dataPerPage: +limit,
            });
        } catch (err) {
            next()
        }
    }

    static async getProductByIdPublic(req, res, next) {
        const options = {
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: "password"
                    }
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

    static async getRecomendationAi(req, res, next) {

        try {
            const { id } = req.params
            const product = await Product.findByPk(id)
            if (!product) {
                throw { name: "NotFound" }
            }
            const products = await Product.findAll()

            const prompt = `provide a list of product recommendations like ${product.name} from the following data ${JSON.stringify(products)}.
            Provide the response results in valid json form. Don't have any other words/characters besides the JSON data`
            let responseAI = await getGeminiResponse(prompt);

            res.status(200).json(responseAI)
        } catch (err) {
            next(err)
        }
    }

    static async paymentMidtrans(req, res, next) {

        try {
            const snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });
            const { productId } = req.params
            const product = await Product.findByPk(productId)
            if (!product) {
                throw { name: "NotFound" }
            }

            const orderId = Math.random().toString();
            const amount = product.price

            let parameter = {
                "transaction_details": {
                    "order_id": orderId,
                    "gross_amount": amount
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "first_name": req.user.name,
                    "email": req.user.email,
                }
            };

            const transaction = await snap.createTransaction(parameter)
            const transactionToken = transaction.token;

            await Order.create({
                orderId,
                amount,
                userId: req.user.id,
                productId
            })


            res.json({ message: "Order created", transactionToken })
        } catch (err) {
            next(err)
        }
    }

    static async approvePayment(req, res, next) {

        try {
            const { orderId } = req.body
            const order = await Order.findOne({ where: { orderId } })
            if (!order) {
                throw { name: "NotFound" }
            }

            const serverKey = "SB-Mid-server-U9B4hcpiB96TddwBqcP8wsZL".toString("base64");
            const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");
            const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
                headers: {
                    Authorization: `Basic ${base64ServerKey}`
                }
            })
            console.log(response.data)
            res.json({ message: "payment success" })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = PublicController;



