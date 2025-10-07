const User = require("../models/user");
const Group = require("../models/group");
const generateConversationId = require("../utils/generateConversationId");

// Socket Service Blue Print
class SocketIOService
{
    // Constructor
    constructor(io)
    {
        this.io = io;
    }

    // Socket connection
    connect()
    {
        this.io.on("connection", async (socket) => {
            // Extract user object
            const { user } = socket;

            // Validate user
            if(!user) return;
            console.log("New client connected:", socket.id);

            // Join public room
            socket.join("public");
            
            // Join private room for user (one-to-one chat)
            const roomId = `user:${user._id}`;
            socket.join(roomId);

            // Join all group rooms
            const groups = await Group.find({ members: user._id }).select("_id");  
            groups.forEach(group => socket.join(`group:${group._id}`));            

            // Update status in DB as online if the first socket is connected that associated with the room ID
            const userSockets = await this.io.in(roomId).fetchSockets();
            if(userSockets.length === 1)
            {
                try 
                {
                    const data = await User.findByIdAndUpdate(user._id, { onlineStatus:"Online" }, { new:true });
                    this.io.to("public").emit("user-online", data);
                } 
                catch(error) 
                {
                    console.log(`Failed to update status: ${error.message}`);
                }
            }

            /* Listen Start & Stop Typing For Private Chats */
            // Start - Private
            socket.on("private-typing:start", ({ senderId, senderName, receiverId }) => {
                const conversationId = generateConversationId(senderId, receiverId);
                socket.to(`user:${receiverId}`).emit("private-typing:start", { senderName, conversationId });
            });

            // Stop - Private
            socket.on("private-typing:stop", ({ senderId, senderName, receiverId }) => {
                const conversationId = generateConversationId(senderId, receiverId);
                socket.to(`user:${receiverId}`).emit("private-typing:stop", { senderName, conversationId });
            });


            /* Listen Start & Stop Typing For Group Chats */
            // Start - Group
            socket.on("group-typing:start", ({ senderName, groupId }) => {
                socket.to(`group:${groupId}`).emit("group-typing:start", { senderName, conversationId:groupId });
            });

            // Stop - Group
            socket.on("group-typing:stop", ({ senderName, groupId }) => {
                socket.to(`group:${groupId}`).emit("group-typing:stop", { senderName, conversationId:groupId });
            });            

            // Disconnect
            socket.on("disconnect", async () => {
                // Validate user
                if(!user) return;

                // Update status in DB as offline if there's no sockets remaining that associated with the room ID
                const remainingSockets = await this.io.in(roomId).fetchSockets();
                if(remainingSockets.length === 0)
                {
                    try 
                    {
                        const data = await User.findByIdAndUpdate(user._id, { onlineStatus: "Offline" }, { new: true });
                        this.io.to("public").emit("user-offline", data);
                    } 
                    catch(error) 
                    {
                        console.log(`Failed to update status: ${error.message}`);
                    }
                }
                console.log("Client disconnected", socket.id);
            });
        });    
    }

    // Broadcast to public room sockets
    public(emitMessage, payload = null)
    {
        // Validate
        if(!this.io) return console.log("IO instance is missing");
        if(!emitMessage) return console.log("Please specify socket emitter message");
        
        // Emit for public sockets
        this.io.to("public").emit(emitMessage, payload);
    }

    // Broadcast to private room sockets (One to one)
    private(from, to, emitMessage, payload = null) 
    {
        // Validate
        if(!this.io) return console.log("IO instance is missing");
        if(!from) return console.log("Sender socket is missing");
        if(!to) return console.log("Receiver socket is missing");
        if(!emitMessage) return console.log("Please specify socket emitter message");

        // Emit for sender and receiver only
        this.io.to(`user:${to}`).to(`user:${from}`).emit(emitMessage, payload);
    }

    // Broadcast to group room sockets
    group(groupId, emitMessage, payload = null)
    {
        // Validate
        if(!this.io) return console.log("IO instance is missing");
        if(!emitMessage) return console.log("Please specify socket emitter message");

        // Emit for group members only
        this.io.to(`group:${groupId}`).emit(emitMessage, payload);
    }

    // Join specific group or room
    async joinRoom(roomIds, targetRoomIds)
    {
        // Validate
        if(!this.io) return console.log("IO instance is missing");

        // Normalize target room ids into array
        const targets = Array.isArray(targetRoomIds) ? targetRoomIds : [targetRoomIds];

        // Join rooms in a parallel way
        if(targets.length > 0) await Promise.all(targets.map(targetRoom => this.io.in(roomIds).socketsJoin(targetRoom)));
    }

    // Leave specific group or room
    async leaveRoom(roomIds, targetRoomIds)
    {
        // Validate
        if(!this.io) return console.log("IO instance is missing");

        // Normalize target room ids into array
        const targets = Array.isArray(targetRoomIds) ? targetRoomIds : [targetRoomIds];

        // Leave rooms in a parallel way
        if(targets.length > 0) await Promise.all(targets.map(targetRoom => this.io.in(roomIds).socketsLeave(targetRoom)));
    }

    // Live notifications
    async notify(roomIds, emitMessage, payload)
    {
        if(!this.io) return console.log("IO instance is missing");
        if(!emitMessage) return console.log("Please specify socket emitter message"); 
        
        // Normalize room ids
        const targets = Array.isArray(roomIds) ? roomIds : [roomIds];

        // Send notification
        if(targets.length > 0) targets.forEach(roomId => this.io.to(roomId).emit(emitMessage, payload));
    }
}

module.exports = SocketIOService;