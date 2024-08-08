const router = require("express").Router();
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const userRouter = require("./userRouter");
const publicRouter = require("./publicRouter");
const errorHandling = require("../middlewares/errorHandling");

router.use("/pub", publicRouter);

router.use("/", userRouter);

router.use("/products", productRouter);

router.use("/categories", categoryRouter);

router.use(errorHandling);

module.exports = router;