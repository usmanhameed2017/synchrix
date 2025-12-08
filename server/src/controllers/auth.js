const { cookieOptions } = require("../config");
const User = require("../models/user");
const jwt = require("../service/auth-token");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const crypto = require("crypto");
const { getAccessToken } = require("../utils/getAccessToken");
const { origin } = require("../constants");

// Initialize XSRF Token
const initXsrfToken = async (request, response) => {
    // Get token
    const token = crypto.randomBytes(32).toString('hex');

    // Response
    return response.status(200)
    .cookie("xsrf-token", token, cookieOptions)
    .json(new ApiResponse(200, token, "CSRF Token has been generated successfully"));
};

// User signup
const signup = async (request, response) => {
    try 
    {
        // Validate fields
        const { name, email, username, password, cpassword } = request.body;
        if(!name) throw new ApiError(400, "Name is required");
        if(!email) throw new ApiError(400, "Email is required");
        if(!username) throw new ApiError(400, "Username is required");
        if(!password) throw new ApiError(400, "Password is required");
        if(!cpassword) throw new ApiError(400, "Confirm Password is required");
        if(password !== cpassword) throw new ApiError(400, "Password and confirm password must be identical");

        // Prepare payload
        const payload = { name, email, username, password };

        // Insert in db
        const user = await User.create(payload);
        if(!user) throw new ApiError(400, "Failed to register user");

        // Exclude fields
        delete payload.password;
        delete payload.gid;
        return response.status(201).json(new ApiResponse(201, payload, "Account has been created"));
    } 
    catch (error) 
    {
        throw error;
    }
};

// User login
const login = async (request, response) => {
    try 
    {
        // Validate fields
        const { username, password } = request.body;
        if(!username) throw new ApiError(400, "Username is required");
        if(!password) throw new ApiError(400, "Password is required");

        // Find user
        const user = await User.findOne({ username });
        if(!user) throw new ApiError(400, "Invalid username");

        // Match password
        const isMatched = await user.matchPassword(password);
        if(!isMatched) throw new ApiError(400, "Incorrect password");

        // Generate access token
        const accessToken = jwt.generateAccessToken(user);
        if(!accessToken) throw new ApiError(500, "Failed to generate access token");

        // Prepare payload
        const payload = {
            user:{ _id:user._id, name:user.name, email:user.email, username:user.username },
            accessToken
        };

        // Response
        return response.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200, payload, "Login successful"));
    }
    catch(error)
    {
        throw error;
    }
};

// Login as gmail
const googleLogin = async (request, response) => {
    if(!request.user) throw new ApiError(404, "User not found");

    // Generate access token
    const accessToken = jwt.generateAccessToken(request.user);
    if(!accessToken) throw new ApiError(400, "Failed to generate access token");

    // Redirect to application
    return response.status(303)
    .cookie("accessToken", accessToken, cookieOptions)
    .redirect(`${origin}/home`);
}

// Verify authentication
const isAuthenticated = async (request, response) => {
    // Get token
    const accessToken = getAccessToken(request);
    if(!accessToken) return response.status(200).json(new ApiResponse(200, null, "Not logged-in"));

    // Verify token
    const user = jwt.verifyAccessToken(accessToken);
    if(!user) throw new ApiError(401, "Invalid or expired token");

    // Response
    return response.status(200).json(new ApiResponse(200, { user, accessToken }, "Authenticated"));
};

// User logout
const logout = async (request, response) => {
    request.user = null;
    return response.status(200).clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logout successfully"));
};

module.exports = { initXsrfToken, signup, login, googleLogin, isAuthenticated, logout };