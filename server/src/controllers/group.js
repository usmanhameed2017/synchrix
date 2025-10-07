const Chat = require("../models/chat");
const Group = require("../models/group");
const SocketIOService = require("../service/socket");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Create group
const createGroup = async (request, response) => {
    request.body.createdBy = request.user?._id;
    try 
    {
        // Group must contain at least 3 members including creator, during the creation
        if(request.body.members?.length < 2) throw new ApiError(400, "Please add at least 2 members to create a group");
        
        // Create group
        const group = await Group.create(request.body);
        if(!group) throw new ApiError(500, "Failed to create a group");

        // Get room id of new members
        const roomIds = group.members.map(memberId => `user:${memberId}`);
        const targetedRoomId = `group:${group._id}`; // Room to join

        // Broadcast group creation in real time
        const broadcast = new SocketIOService(request.io);
        await broadcast.joinRoom(roomIds, targetedRoomId);
        broadcast.group(group._id, "group-created", group);

        // Response
        return response.status(201).json(new ApiResponse(200, group, "Group has been created successfully"));
    } 
    catch(error)
    {
        throw error;
    }
};

// Fetch all groups
const fetchAllGroups = async (request, response) => {
    try 
    {
        // Fetch groups with detailed info
        const groups = await Group.find({}).populate({
            path:"lastMessage",
            select:"message createdAt",
            populate:{
                path:"from",
                select:"name"
            }
        });

        // No group found
        if(!groups) throw new ApiError(404, "No group found");

        // Response
        return response.status(200).json(new ApiResponse(200, groups, "Group fetched successfully"));
    } 
    catch (error) 
    {
        throw error;
    }
};

// Edit group
const editGroup = async (request, response) => {
    const id = request.params?.id;
    try 
    {
        // Update
        const group = await Group.findByIdAndUpdate(id, request.body, { new:true });
        if(!group) throw new ApiError(404, "Group not found");

        // Broadcast group updation in real time
        const broadcast = new SocketIOService(request.io);
        broadcast.group(group._id, "group-updated", group);

        // Response
        return response.status(200).json(new ApiResponse(200, group, "Group name has been edited"));
    } 
    catch (error) 
    {
        throw error;
    }
};

// Delete group
const deleteGroup = async (request, response) => {
    const id = request.params?.id;
    try 
    {
        // Delete group
        const group = await Group.findByIdAndDelete(id);
        if(!group) throw new ApiError(404, "Group not found");

        // Delete all the chats that associated with this group
        const chats = await Chat.deleteMany({ conversationId:group._id });
        if(!chats) throw new ApiError(500, "Unable to delete chats");

        // Broadcast group deletion in real time
        const broadcast = new SocketIOService(request.io);
        broadcast.group(group._id, "group-deleted", group);

        // Response
        return response.status(200).json(new ApiResponse(200, group, "Group has been deleted"));
    } 
    catch (error) 
    {
        throw error;
    }
};

// Add new members to group
const addNewMembersToGroup = async (request, response) => {
    const { id } = request.params;
    const { members } = request.body;
    try 
    {
        // Add members to existing group
        const updatedGroup = await Group.findByIdAndUpdate(id, { $addToSet: { members: { $each: members } } }, { new: true });
        if(!updatedGroup) throw new ApiError(500, "Failed to add members");

        // Let new members join the group manually
        const broadcast = new SocketIOService(request.io);
        const roomIds = members.map(memberId => `user:${memberId}`);
        const targetedRoomId = `group:${updatedGroup._id}`;
        await broadcast.joinRoom(roomIds, targetedRoomId);

        // Broadcast
        broadcast.group(id, "members-added", { groupId:id, newMembers:members, groupData:updatedGroup });

        // Dynamic message based on members quantity
        const msg = members.length > 1 ? "Members have been added successfully" : "Member has been added successfully";

        // Response
        return response.status(200).json(new ApiResponse(200, updatedGroup, msg));
    } 
    catch(error)
    {
        throw error;
    }
};

// Remove member from the group
const removeMember = async (request, response) => {
    const { id, memberId } = request.params;
    try 
    {
        // Remove from group
        const group = await Group.findByIdAndUpdate(id, { $pull: { members:memberId, admins:memberId } }, { new:true });
        if(!group) throw new ApiError(404, "Group not found");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.group(group._id, "member-removed-from-group", { groupId:group._id, memberId:memberId });

        // Remove member from room
        await broadcast.leaveRoom(`user:${memberId}`, `group:${id}`);

        // Response
        return response.status(200).json(new ApiResponse(200, group, "Member has been removed"));
    } 
    catch(error)
    {
        throw error;
    }
};

// Make group admin
const makeGroupAdmin = async (request, response) => {
    const { id:groupId, memberId } = request.params;
    try 
    {
        // Push member id into admins array in mongo
        const updatedGroup = await Group.findByIdAndUpdate(groupId, { $addToSet: { admins: memberId } }, { new: true });
        if(!updatedGroup) throw new ApiError(500, "Group not found");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.group(groupId, "promoted-to-admin", { groupName:updatedGroup.name, groupId, memberId });

        // Response
        return response.status(200).json(new ApiResponse(200, updatedGroup, "Member promoted to admin successfully"));
    } 
    catch(error)
    {
        throw error;
    }
};

// Remove member from the group (By admin)
const removeFromAdmin = async (request, response) => {
    const { id, memberId } = request.params;
    try 
    {
        // Remove from group
        const group = await Group.findByIdAndUpdate(id, { $pull: { admins:memberId } }, { new:true });
        if(!group) throw new ApiError(404, "Group not found");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.group(group._id, "removed-as-admin", { groupId:group._id, memberId:memberId });       

        // Response
        return response.status(200).json(new ApiResponse(200, group, "Admin has been removed"));
    } 
    catch(error)
    {
        throw error;
    }
};

module.exports = { createGroup, fetchAllGroups, editGroup, deleteGroup, addNewMembersToGroup, removeMember, makeGroupAdmin, removeFromAdmin };