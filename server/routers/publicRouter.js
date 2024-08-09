const router = require("express").Router();
const PublicController = require("../controllers/publicController");
const CategoryController = require("../controllers/categoryController")
const authentication = require("../middlewares/authentication");


router.get("/products", PublicController.getProductPublic);
router.get("/products/:id", PublicController.getProductByIdPublic);
router.get("/categories", CategoryController.getCategory);
router.get("/recomendation/:id", PublicController.getRecomendationAi);

router.use(authentication);

router.get("/payment/midtrans/:productId", PublicController.paymentMidtrans);
router.patch("/payment/midtrans/approve", PublicController.approvePayment);

module.exports = router;