const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// Schema
const userSchema = new Schema({
    gid:{ type:String, trim:true },
    fid:{ type:String, trim:true },
    name:{ type:String, trim:true, required:[true, "Name is required"] },
    email:{ type:String, trim:true, lowercase:true, unique:[true, "This email has already taken. Please try different email address"], required:true },
    username:{ type:String, trim:true, lowercase:true, unique:[true, "This username is already in use"], index:true, required:[true, "Username is required"] },
    password:{ type:String, trim:true, required:[true, "Password is required"] },
    status:{ type:String, trim:true, enum:["Pending", "Approved", "Block"], default:"Pending", required:true },
    onlineStatus:{ type:String, trim:true, enum:["Online", "Offline"], default:"Offline", required:true }
}, { timestamps:true });

// Hash password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    try 
    {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } 
    catch(error) 
    {
        console.log(error.message);
        return next();
    }
});

// Match password
userSchema.methods.matchPassword = async function(password) {
    if(!password) return false;
    try 
    {
       return await bcrypt.compare(password, this.password);
    } 
    catch (error) 
    {
        console.log(error.message);
        return false;
    }
}

// Model
const User = model("User", userSchema);

module.exports = User;