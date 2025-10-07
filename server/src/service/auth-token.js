const jsonwebtoken = require("jsonwebtoken");
const { accessTokenSecret, accessTokenExpiry } = require("../constants");

// Auth Token Service
class AuthToken
{
    // Generate access token
    generateAccessToken(user)
    {
        if(!user) return null;
        try 
        {
            // Payload
            const payload = {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            };

            // Sign the token
            return jsonwebtoken.sign(payload, accessTokenSecret, { expiresIn:accessTokenExpiry });
        } 
        catch(error) 
        {
            console.log(`Failed to generate access token ${error.message}`);
            return null;
        }
    };

    // Verify access token
    verifyAccessToken(accessToken) 
    {
        if(!accessToken) return null;
        try 
        {
            return jsonwebtoken.verify(accessToken, accessTokenSecret);
        } 
        catch(error) 
        {
            console.log(`Failed to verify access token ${error.message}`);
            return null;
        }
    };    
}

// Instance
const jwt = new AuthToken();

module.exports = jwt;