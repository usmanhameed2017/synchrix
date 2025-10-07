const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Fetch all users
const fetchAllUsers = async (request, response) => {
    try 
    {
        const users = await User.find({});
        if(!users) throw new ApiError(404, "No user found");
        return response.status(200).json(new ApiResponse(200, users, "User fetched successfully"));
    } 
    catch (error) 
    {
        throw error;
    }
};

module.exports = { fetchAllUsers };