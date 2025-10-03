// Ports and origins
const port = process.env.PORT || 8000;
const origin = process.env.ORIGIN;

// Database
const mongoURL = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

// JWT
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

// Cookie parser secret
const cookieParserSecret = process.env.COOKIE_PARSER_SECRET;

module.exports = { 
    port, 
    origin, 
    mongoURL, 
    dbName, 
    accessTokenSecret, 
    accessTokenExpiry,
    cookieParserSecret
};