const { signup, login, isAuthenticated, logout, initCsrfToken } = require("../controllers/auth");
const { authentication } = require("../middlewares/auth");

// Router instance
const authRouter = require("express").Router();

// Initialize CSRF Token
authRouter.route("/csrfToken").get(initCsrfToken);

// Signup
authRouter.route("/user/signup").post(signup);

// User Login
authRouter.route("/user/login").post(login);

// Verify access token
authRouter.route("/user/isAuthenticated").get(authentication, isAuthenticated);

// Logout
authRouter.route("/user/logout").get(authentication, logout);

module.exports = authRouter;