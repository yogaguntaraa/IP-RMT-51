const router = require("express").Router();
const PublicController = require("../controllers/publicController");
const CategoryController = require("../controllers/categoryController")
const authentication = require("../middlewares/authentication");


router.use(authentication);

router.get("/products", PublicController.getProductPublic);
router.get("/categories", CategoryController.getCategory);
router.get("/products/:id", PublicController.getProductByIdPublic);
router.get("/payment/midtrans/:productId", PublicController.paymentMidtrans);
router.get("/recomendation/:id", PublicController.getRecomendationAi);
router.patch("/payment/midtrans/approve", PublicController.approvePayment);

module.exports = router;