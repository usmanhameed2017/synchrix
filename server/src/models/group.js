const { Schema, model, Types } = require("mongoose");

// Schema
const groupSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    }],
    admins:[{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    }],
    lastMessage:{  // Pointer to latest message
        type: Schema.Types.ObjectId,
        ref: "Chat",
        default: null,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }     
}, { timestamps:true });

// Pre save hook
groupSchema.pre("save", function(next) {
    if(!this.members) this.members = [];
    if(!this.admins) this.admins = [];

    // Make members and admin array
    const members = this.members.map(id => id.toString());
    const admins = this.admins.map(id => id.toString());

    if(this.createdBy)
    {
        // Get creator ID
        const creatorId = this.createdBy.toString();

        // Always add group creator into the group which he created
        if(!members.includes(creatorId)) members.push(creatorId);

        // Always mark group creator as admin
        if(!admins.includes(creatorId)) admins.push(creatorId);
    }

    // Convertion to Object IDs
    const toObjectIds = (arr) => [...new Set(arr)].map(id => new Types.ObjectId((String(id))));
    
    // Convert back to ObjectId
    const uniqueMembers = toObjectIds(members);
    const uniqueAdmins = toObjectIds(admins);

    this.members = uniqueMembers;
    this.admins = uniqueAdmins;
    return next();
});

// Model
const Group = model("Group", groupSchema);

module.exports = Group;