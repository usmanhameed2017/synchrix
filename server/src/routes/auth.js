const { initXsrfToken, signup, login, isAuthenticated, logout } = require("../controllers/auth");
const { authentication } = require("../middlewares/auth");
const { xsrfProtection } = require("../middlewares/xsrfProtection");

// Router instance
const authRouter = require("express").Router();

// Initialize CSRF Token
authRouter.route("/xsrfToken").get(xsrfProtection, initXsrfToken);

// Signup
authRouter.route("/user/signup").post(signup);

// User Login
authRouter.route("/user/login").post(login);

// Verify access token
authRouter.route("/user/isAuthenticated").get(isAuthenticated);

// Logout
authRouter.route("/user/logout").get(authentication, logout);

module.exports = authRouter;