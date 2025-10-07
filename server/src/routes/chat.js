const { sendPrivateMessage, fetchPrivateMessages, sendGroupMessage, fetchGroupMessages, updatePrivateMessage,
deletePrivateMessage, deleteGroupMessage, updateGroupMessage, 
clearPrivateChat} = require("../controllers/chat");
const { authentication } = require("../middlewares/auth");

// Router instance
const chatRouter = require("express").Router();

/* ================================== P R I V A T E ================================== */
// Send private message
chatRouter.route("/private-message").post(authentication, sendPrivateMessage);

// Get private messages (one-to-one chat)
chatRouter.route("/private-message/:to").get(authentication, fetchPrivateMessages);

// Update private message
chatRouter.route("/private-message/updateMessage/:id").patch(authentication, updatePrivateMessage);

// Delete private message
chatRouter.route("/private-message/deleteMessage/:id").delete(authentication, deletePrivateMessage);

// Clear private conversation
chatRouter.route("/private-chat/clear-conversation/:userId").delete(authentication, clearPrivateChat);


/* ================================== G R O U P ================================== */
// Send group message
chatRouter.route("/group-message").post(authentication, sendGroupMessage);

// Get group messages
chatRouter.route("/group-message/:conversationId").get(authentication, fetchGroupMessages);

// Update private message
chatRouter.route("/group-message/updateMessage/:id").patch(authentication, updateGroupMessage);

// Delete private message
chatRouter.route("/group-message/deleteMessage/:id").delete(authentication, deleteGroupMessage);

module.exports = chatRouter;