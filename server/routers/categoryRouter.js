const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory)

module.exports = router;