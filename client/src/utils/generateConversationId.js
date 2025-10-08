const generateConversationId = (senderId, receiverId) => {
    return [senderId.toString(), receiverId.toString()].sort().join("-");
};

export default generateConversationId;