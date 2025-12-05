const ApiError = require("../utils/ApiError");

// XSRF Token Middleware
const xsrfProtection = (request, response, next) => {
    // Validate xsrf token on state changing methods
    const httpMethods = ["POST", "PUT", "PATCH", "DELETE"];
    if(httpMethods.includes(request.method))
    {
        try 
        {
            // Get tokens
            const clientToken = request.headers?.['x-xsrf-token'];
            const serverToken = request.signedCookies?.['xsrf-token'];

            // Validate tokens
            if(!clientToken) throw new ApiError(400, "Client token is missing");
            if(serverToken === undefined) throw new ApiError(400, "Server token is missing");
            if(serverToken === false) throw new ApiError(403, "Invalid XSRF token — token integrity check failed");
            if(!serverToken) throw new ApiError(400, "Server token is missing");
            if(clientToken !== serverToken) throw new ApiError(403, "XSRF Token mismatch");
        } 
        catch(error) 
        {
            throw error;
        }
    }
    return next();
};

module.exports = { xsrfProtection };