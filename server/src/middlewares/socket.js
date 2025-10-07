const jwt = require("../service/auth-token");
const ApiError = require("../utils/ApiError");

// Socket authentication
const socketAuthentication = (socket, next) => {
    try 
    {
        const { authToken } = socket.handshake.auth;
        if(!authToken) throw new ApiError(401, "Auth token is missing");

        const user = jwt.verifyAccessToken(authToken);
        if(!user) throw new ApiError(400, "Invalid access token");

        socket.user = user || null;
        return next();    
    } 
    catch (error) 
    {
        console.log(error.message);
    }
};

module.exports = socketAuthentication;