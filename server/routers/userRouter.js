const router = require("express").Router();
const UserController = require("../controllers/userController");
// const authentication = require("../middlewares/authentication");

router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.post("/login/google", UserController.loginByGoogle);

module.exports = router;