const getAccessToken = (request) => {
    try 
    {
        if(!request) return null;
        const accessToken = request?.signedCookies?.accessToken ||
        request?.cookies?.accessToken ||
        request.headers?.["authorization"]?.split(" ")?.[1] || null;
        return accessToken;
    } 
    catch(error) 
    {
        console.log("Failed to extract token", error.message);
        return null;
    }
};

module.exports = { getAccessToken };