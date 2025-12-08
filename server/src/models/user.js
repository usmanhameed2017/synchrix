const { Schema, model } = require("mongoose");

// Schema
const userSchema = new Schema({
    gid:{ type:String, trim:true },
    name:{ type:String, trim:true, required:[true, "Name is required"] },
    email:{ type:String, trim:true, lowercase:true, unique:[true, "This email has already taken. Please try different email address"], required:true },
    username:{ type:String, trim:true, lowercase:true, unique:[true, "This username is already in use"], index:true, required:[true, "Username is required"] },
    password:{ type:String, trim:true, required:[true, "Password is required"] },
    onlineStatus:{ type:String, trim:true, enum:["Online", "Offline"], default:"Offline", required:true }
}, { timestamps:true });

// Model
const User = model("User", userSchema);

module.exports = User;