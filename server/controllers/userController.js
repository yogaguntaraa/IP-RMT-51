const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client();

class UserController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw { name: "Email and Password are required" }
            };

            const user = await User.findOne({
                where: { email }
            });

            if (!user) {
                throw { name: "Invalid Email or Password" };
            }
            const isValidPassword = comparePassword(password, user.password);

            if (!user || !isValidPassword) {
                throw { name: "Invalid Email or Password" }
            };

            const token = signToken(
                { userId: user.id }
            );
            res.status(200).json({ token, role: user.role, username: user.username });
        } catch (err) {
            next(err)
        }
    }

    static async createUser(req, res, next) {
        try {
            const { email, password, phoneNumber, username } = req.body;
            const user = await User.create({
                email,
                password: hashPassword(password),
                phoneNumber,
                username
            });
            res.status(201).json({
                id: user.id,
                email: user.email
            });
        } catch (err) {
            next(err)
        }
    }

    static async loginByGoogle(req, res, next) {
        try {
            if (!req.body.googleToken) {
                throw { name: "MissingGoogleToken" }
            }

            const ticket = await client.verifyIdToken({
                idToken: req.body.googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const { email } = ticket.getPayload();

            const [user] = await User.findOrCreate({
                where: { email: email },
                defaults: {
                    username: email,
                    email: email,
                    password: `${Math.random() * 100}`,
                    role: "Customer",
                    phoneNumber: "-"
            
                },
            });

            const token = signToken(
                { userId: user.id }
            );
            res.status(200).json({ token });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = UserController;