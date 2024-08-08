const { Category } = require("../models");

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            const { name } = req.body;
            const category = await Category.create({ name });
            res.status(201).json({ category })
        } catch (err) {
            next(err)
        }
    }

    static async getCategory(req, res, next) {
        try {
            const category = await Category.findAll();
            res.status(200).json({ category })
        } catch (err) {
            next()
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const category = await Category.findByPk(id);

            if (!category) {
                throw { name: "NotFound" }
            };

            category.name = name;
            await category.save();
            res.status(200).json({
                msg: "Category has been Update"
            })
        } catch (err) {
            next()
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                throw { name: "NotFound" }
            };

            await category.destroy();
            res.status(200).json({
                msg: "Category has been deleted"
            })
        } catch (err) {
            next()
        }
    }
}

module.exports = CategoryController;