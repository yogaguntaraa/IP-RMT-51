const router = require("express").Router();
const ProductController = require("../controllers/productController");

const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post("/", ProductController.createProduct);
router.get("/", ProductController.getProduct);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.patch("/:id/img", upload.single("img"), ProductController.updateProductImgById);
router.delete("/:id", ProductController.deleteProduct);


module.exports = router;