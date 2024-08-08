const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw { name: "Unauthorized" };
        }

        const [bearer, token] = authorization.split(" ");
        if (bearer !== "Bearer" || !token) {
            throw { name: "Unauthorized" };
        }

        const loggedInUser = verifyToken(token);
        const { userId } = loggedInUser;

        const user = await User.findByPk(userId);
        if (!user) {
            throw { name: "Unauthorized" };
        }
        req.user = { id: userId, role: user.role }
        next();
    } catch (err) {
        next(err)
    }
}

module.exports = authentication;