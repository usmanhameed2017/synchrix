const { fetchAllUsers } = require("../controllers/user");
const { authentication } = require("../middlewares/auth");

// Router instance
const userRouter = require("express").Router();

// Get All Users
userRouter.route("/").get(authentication, fetchAllUsers);

module.exports = userRouter;