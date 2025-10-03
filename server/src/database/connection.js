const mongoose = require("mongoose");
const { mongoURL, dbName } = require("../constants");

const connectDB = async () => {
    try 
    {
        const response = await mongoose.connect(`${mongoURL}/${dbName}`);
        console.log(`Database connected to ${response.connection.host}`);
    } 
    catch (error) 
    {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;