const { cookieOptions } = require("../config");
const User = require("../models/user");
const jwt = require("../service/auth-token");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Initialize CSRF Token
const initCsrfToken = async (request, response) => {
    return response.status(200)
    .json(new ApiResponse(200, request.csrfToken(), "CSRF Token has been generated successfully"));
};

// User signup
const signup = async (request, response) => {
    try 
    {
        const user = await User.create(request.body);
        return response.status(201).json(new ApiResponse(201, user, "Account has been created"));
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
        const { username, password } = request.body || {};
        const user = await User.findOne({ username, password });
        if(!user) throw new ApiError(400, "Invalid username or password");

        // Generate access token
        const accessToken = jwt.generateAccessToken(user);
        return response.status(200).cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
    }
    catch(error)
    {
        throw error;
    }
};

// Verify authentication
const isAuthenticated = async (request, response) => {
    if(!request.user) throw new ApiError(401, "Unauthenticated");
    // await Chat.deleteMany();
    const user = request.user;
    const accessToken = request.accessToken;
    return response.status(200).json(new ApiResponse(200, { user, accessToken }, "Authenticated"));
};

// User logout
const logout = async (request, response) => {
    request.user = null;
    return response.status(200).clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logout successfully"));
};

module.exports = { initCsrfToken, signup, login, isAuthenticated, logout };