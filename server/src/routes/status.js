const { serverStatus } = require("../controllers/status");

// Router instance
const statusRouter = require("express").Router();

// Indicate server status
statusRouter.route("/").get(serverStatus);

module.exports = statusRouter;