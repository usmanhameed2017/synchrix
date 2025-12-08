const Chat = require("../models/chat");
const Group = require("../models/group");
const SocketIOService = require("../service/socket");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const generateConversationId = require("../utils/generateConversationId");

/* ================================== P R I V A T E ================================== */
// Send private message (one-to-one chat)
const sendPrivateMessage = async (request, response) => {
    const senderId = request.user?._id;
    const receiverId = request.body?.to || null;
    request.body.from = senderId;

    // Validate reciever
    if(!receiverId) throw new ApiError(400, "Receiver ID is missing");

    // Generate unique id for conversation thread
    request.body.conversationId = generateConversationId(senderId, receiverId);

    try 
    {
        // Insert into database
        const chat = await Chat.create(request.body);
        if(!chat) throw new ApiError(400, "Failed to send message");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.private(senderId, receiverId, "private-message", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Message has been sent"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Fetch private messages (one-to-one chat)
const fetchPrivateMessages = async (request, response) => {
    const senderId = request.user?._id;
    const receiverId = request.params?.to || null;

    // Validate reciever
    if(!receiverId) throw new ApiError(400, "Receiver ID is missing");

    // Generate unique id for conversation thread
    const conversationId = generateConversationId(senderId, receiverId);
    try 
    {
        const chats = await Chat.find({ conversationId }).lean();
        if(!chats || chats.length <= 0) throw new ApiError(404, "No messages yet");
        return response.status(200).json(new ApiResponse(200, chats, "Messages has been fetched"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Update private message
const updatePrivateMessage = async (request, response) => {
    const { message } = request.body;
    try 
    {
        // Update in database
        const chat = await Chat.findByIdAndUpdate(request.params?.id, { message }, { new:true });
        if(!chat) throw new ApiError(404, "Message not found");

        // Mark message as edited
        if(!chat.isEdited)
        {
            chat.isEdited = true;
            await chat.save();
        }

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.private(chat.from, chat.to, "message-updated", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Messages has been updated"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Delete private message
const deletePrivateMessage = async (request, response) => {
    try 
    {
        // Delete from database
        const chat = await Chat.findByIdAndDelete(request.params?.id);
        if(!chat) throw new ApiError(404, "Message not found");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.private(chat.from, chat.to, "message-deleted", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Messages has been deleted"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Clear conversation
const clearPrivateChat = async (request, response) => {
    const { userId } = request.params || {};
    if(!userId) throw new ApiError(404, "User ID is missing");

    try 
    {
        // Generate conversation ID
        const conversationId = generateConversationId(request.user?._id, userId);

        // Delete from database
        const chats = await Chat.deleteMany({ conversationId:conversationId });
        if(chats.deletedCount === 0) throw new ApiError(404, "No chat history found for this conversation.");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.private(request.user?._id, userId, "private:clear-chat", { conversationId });

        // Response
        return response.status(200).json(new ApiResponse(200, { ...chats, conversationId }, "Chat has been cleared"));
    } 
    catch(error) 
    {
        throw error;
    }
};


/* ================================== G R O U P ================================== */
// Send group messages
const sendGroupMessage = async (request, response) => {
    request.body.from = request.user?._id;

    // Validate group ID
    if(!request.body?.conversationId) throw new ApiError(400, "Group ID is missing");

    try 
    {
        // Find group
        const group = await Group.findById(request.body?.conversationId);
        if(!group) throw new ApiError(404, "Group not found");

        // If the sender is not a member of a group
        const isMember = group.members.some(memberId => memberId.toString() === request.user._id.toString());
        if(!isMember) throw new ApiError(400, "Only members can send a message");

        // Insert into database and get data with sender name
        const chat = await (await Chat.create(request.body)).populate("from", "name");
        if(!chat) throw new ApiError(400, "Failed to send message");

        // Update group's last message with the latest message
        group.lastMessage = chat?._id;
        await group.save();

        // Broadcast to all group members
        const broadcast = new SocketIOService(request.io);
        broadcast.group(group._id, "group-message", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Message has been sent"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Fetch group messages
const fetchGroupMessages = async (request, response) => {
    // Validate reciever ID
    const { conversationId } = request.params || {};
    if(!conversationId) throw new ApiError(400, "Group ID is missing");

    try 
    {
        // Fetch group chats
        const chats = await Chat.find({ conversationId }).populate("from", "name").lean();
        if(!chats || chats.length <= 0) throw new ApiError(404, "No messages yet");

        // Response
        return response.status(200).json(new ApiResponse(200, chats, "Messages has been fetched"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Update group message
const updateGroupMessage = async (request, response) => {
    // Validate ID
    const { id } = request.params || {};
    if(!id) throw new ApiError(404, "Chat ID is missing");

    const { message } = request.body;
    try 
    {
        // Update in database
        const chat = await Chat.findByIdAndUpdate(id, { message }, { new:true }).populate("from", "name");
        if(!chat) throw new ApiError(404, "Message not found");

        // Mark message as edited
        if(!chat.isEdited)
        {
            chat.isEdited = true;
            await chat.save();
        }        

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.group(chat?.conversationId, "message-updated", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Messages has been updated"));
    } 
    catch(error) 
    {
        throw error;
    }
};

// Delete group message
const deleteGroupMessage = async (request, response) => {
    // Validate ID
    const { id } = request.params || {};
    if(!id) throw new ApiError(404, "Chat ID is missing");

    try 
    {
        // Delete from database
        const chat = await Chat.findByIdAndDelete(id);
        if(!chat) throw new ApiError(404, "Message not found");

        // Broadcast
        const broadcast = new SocketIOService(request.io);
        broadcast.group(chat?.conversationId, "message-deleted", chat);

        // Response
        return response.status(200).json(new ApiResponse(200, chat, "Messages has been deleted"));
    } 
    catch(error) 
    {
        throw error;
    }
};

module.exports = { 
    sendPrivateMessage, 
    fetchPrivateMessages,
    updatePrivateMessage,
    deletePrivateMessage,
    clearPrivateChat,
    sendGroupMessage, 
    fetchGroupMessages,
    deleteGroupMessage,
    updateGroupMessage
};