const { initXsrfToken, signup, login, googleLogin, isAuthenticated, logout } = require("../controllers/auth");
const { authentication } = require("../middlewares/auth");
const { xsrfProtection } = require("../middlewares/xsrfProtection");
const passport = require("passport");

// Router instance
const authRouter = require("express").Router();

// Initialize CSRF Token
authRouter.route("/xsrfToken").get(xsrfProtection, initXsrfToken);

// Signup
authRouter.route("/user/signup").post(signup);

// User Login
authRouter.route("/user/login").post(login);

// Login as google
authRouter.route('/google').get(passport.authenticate('google', { scope:['profile', 'email'], prompt:"select_account" }));
authRouter.route('/google/callback').get(passport.authenticate('google', { session: false }), googleLogin);

// Verify access token
authRouter.route("/user/isAuthenticated").get(isAuthenticated);

// Logout
authRouter.route("/user/logout").get(authentication, logout);

module.exports = authRouter;