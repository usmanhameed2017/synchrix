const { createGroup, fetchAllGroups, deleteGroup, editGroup, addNewMembersToGroup, 
removeMember, makeGroupAdmin, 
removeFromAdmin} = require("../controllers/group");
const { authentication } = require("../middlewares/auth");

// Router instance
const groupRouter = require("express").Router();

// Create group
groupRouter.route("/create").post(authentication, createGroup);

// Get all groups
groupRouter.route("/").get(authentication, fetchAllGroups);

// Edit group
groupRouter.route("/edit/:id").patch(authentication, editGroup);

// Delete group
groupRouter.route("/delete/:id").delete(authentication, deleteGroup);

// Add new members to group
groupRouter.route("/addNewMembers/:id").patch(authentication, addNewMembersToGroup);

// Remove member from the group
groupRouter.route("/:id/member/:memberId").patch(authentication, removeMember);

// Make group admin
groupRouter.route("/:id/make-group-admin/:memberId").patch(authentication, makeGroupAdmin);

// Remove from admin
groupRouter.route("/:id/remove-from-admin/:memberId").patch(authentication, removeFromAdmin);

module.exports = groupRouter;