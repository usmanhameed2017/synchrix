const { serverStatus } = require("../controllers/status");

// Router instance
const statusRouter = require("express").Router();

// Get All Users
statusRouter.route("/").get(serverStatus);

module.exports = statusRouter;