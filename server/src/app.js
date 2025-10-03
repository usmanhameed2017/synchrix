const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { corsOptions } = require("./config");
const { cookieParserSecret } = require("./constants");
const errorHandler = require("./middlewares/errorHandler");
const { Server } = require("socket.io");
const http = require("http");
const socketAuthentication = require("./middlewares/socket");
const SocketIOService = require("./service/socket");

// Express app
const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Binding with socket server
const io = new Server(server, { cors:corsOptions });

// ************* MIDDLEWARES ************* //
app.use(cors(corsOptions));
app.use(cookieParser(cookieParserSecret));
app.use(express.urlencoded({ extended:true, limit:"50kb" }));
app.use(express.json({ limit:"50kb" }));
app.use("/public", express.static(path.resolve("public")));

// Share io instance across all controllers
app.use((request, response, next) => {
    request.io = io;
    next();
});

// Socket middleware for authentication
io.use(socketAuthentication);

// Socket connection
const socketio = new SocketIOService(io);
socketio.connect();

// ************* IMPORT ROUTES ************* //
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const groupRouter = require("./routes/group");

// Registered routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/group", groupRouter);

// Error handling middleware
app.use(errorHandler);

module.exports = { app, server };