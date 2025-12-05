const { origin } = require("../constants");

const corsOptions = {
    origin:origin,
    credentials:true,
    methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization", "X-XSRF-TOKEN"]
};

const cookieOptions = {
    httpOnly:true,
    secure:true,
    maxAge: 1000 * 60 * 60 * 7, // 7 hours
    signed:true,
    sameSite:"none"
};

module.exports = { corsOptions, cookieOptions };