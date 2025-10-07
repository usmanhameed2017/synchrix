const { Schema, model } = require("mongoose");

// Schema
const userSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        required:true,       
    },
    username:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        index:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    onlineStatus:{
        type:String,
        trim:true,
        enum:["Online", "Offline"],
        default:"Offline",
        required:true
    }
}, { timestamps:true });

// Model
const User = model("User", userSchema);

module.exports = User;