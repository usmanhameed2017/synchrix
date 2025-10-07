const { signup, login, isAuthenticated, logout } = require("../controllers/auth");
const { authentication } = require("../middlewares/auth");

// Router instance
const authRouter = require("express").Router();

// Signup
authRouter.route("/user/signup").post(signup);

// User Login
authRouter.route("/user/login").post(login);

// Verify access token
authRouter.route("/user/isAuthenticated").get(authentication, isAuthenticated);

// Logout
authRouter.route("/user/logout").get(authentication, logout);

module.exports = authRouter;