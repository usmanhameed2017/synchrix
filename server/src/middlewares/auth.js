const jwt = require("../service/auth-token");
const ApiError = require("../utils/ApiError");

// Verify authentication
const authentication = (request, response, next) => {
    const token = request.signedCookies?.accessToken || request.headers?.["authorization"]?.split(" ")?.[1] || null;
    if(!token) throw new ApiError(401, "Login required!");

    const user = jwt.verifyAccessToken(token);
    if(!user) throw new ApiError(401, "Unauthenticated! Invalid access token");

    request.user = user || null;
    request.accessToken = token || null;
    return next();
};

// Authorization based on role
const authorization = (roles = []) => {
    return (request, response, next) => {
        if(!roles.includes(request.user?.role)) throw new ApiError(403, "Access denied");
        return next();
    }
};

module.exports = { authentication, authorization };