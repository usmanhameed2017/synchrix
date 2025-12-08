import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { FaSignOutAlt, FaUserAlt, FaUsers, FaLayerGroup, FaPlus, FaCircle  } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import useSocket from "../../hooks/useSocket";
import { useCallback } from "react";
import { useChat } from "../../context/chat";
import { userData } from "../../utils/getUser";
import CreateGroup from "../CreateGroup";
import Button from "../Button";
import { useUser } from "../../context/user";
import { showError, showSuccess } from "../../utils/toasterMessage";
import FormikForm from "../FormikForm";
import Input from "../InputFields";
import sweetAlert from "../../utils/sweetAlert2";
import MenuPopup from "../MenuPopup";
import api from "../../service/axios";

function Sidebar() 
{
    // States
    const { users, setUsers, groups, setGroups } = useUser();
    const { userLogout } = useAuth();
    const { setSelectedUser, setSelectedGroup, selectedGroupRef } = useChat();
    const [editFieldId, setEditFieldId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Close modal
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    // Fetch all users on page load
    useEffect(() => {
        // Users
        api.get({ url:"/user" })
        .then(response => setUsers(response.data))
        .catch(error => console.log(error.message));

        // Groups
        api.get({ url:"/group" })
        .then(response => setGroups(response.data))
        .catch(error => console.log(error.message));
    },[]);

    // Select user to start chatting with
    const selectUser = useCallback((user) => {
        setSelectedUser(user);
    },[]);

    // Select group to start chatting
    const selectGroup = useCallback((group) => {
        setSelectedGroup(group);
    },[]);

    // Edit group name
    const editGroup = useCallback(async (group) => {
        if(!group?._id) return showError("Group ID is missing");
        setEditFieldId(group._id);
    },[]);

    // Update group name
    const updateGroup = useCallback(async (payload) => {
        try 
        {
            await api.patch({ url:`group/edit/${payload?._id}`, payload });
            setEditFieldId(null);
        } 
        catch(error) 
        {
            console.log(error.message);
        }
    },[]);    

    // Delete group
    const deleteGroup = useCallback(async (group) => {
        if(!group?._id) return showError("Group not found");
        sweetAlert.confirm({ title:"Confirm?", text:"Are you sure to delete this group?", fn:async () => {
            try 
            {
                await api.delete({ url:`/group/delete/${group._id}` });
            } 
            catch(error) 
            {
                console.log(error.message);
            }
        }});
    },[]);

    // Group menu options
    const groupMenuOptions = [{ name:"Edit", handler:editGroup }, { name:"Delete", handler:deleteGroup }];

    /* ==================== R E A L  T I M E  H A N D L E R S ==================== */

    // Listen for online users
    useSocket("user-online", useCallback((updatedUser) => {
        if(!updatedUser?._id) return;
        setUsers(prev => prev.map(user => user._id === updatedUser?._id ? updatedUser : user));
    }, []));

    // Listen for offline users
    useSocket("user-offline", useCallback((updatedUser) => {
        if(!updatedUser?._id) return;
        setUsers(prev => prev.map(user => user._id === updatedUser?._id ? updatedUser : user));
    }, []));

    // Listen for newly created groups
    useSocket("group-created", useCallback((data) => {
        if(!data?._id) return;
        setGroups(prev => [...prev, data]);
    }, []));
    
    // Listen for group updation
    useSocket("group-updated", useCallback((data) => {
        if(!data?._id) return;

        // Case:01 Update the group name on sidebar
        setGroups(prev => prev.map(group => group?._id === data?._id ? data : group));

        // Case:02 Update the group name on window chat as well
        if(data?._id === selectedGroupRef.current) setSelectedGroup(data); 
    }, []));

    // Listen for group deletion
    useSocket("group-deleted", useCallback((data) => {
        if(!data?._id) return;

        // Case:01 Exclude group from gorup's list in sidebar
        setGroups(prev => prev.filter(group => group?._id !== data?._id));

        // Case:02 Close the window only if deleted chat is the selected one
        if(data?._id === selectedGroupRef.current) setSelectedGroup(null);
    }, []));
    
    // Listen for member's inclusion to the group
    useSocket("members-added", useCallback(({ groupId, newMembers, groupData }) => {
        if(!groupId) return;

        // Case:01 Append group for new members
        if(newMembers.includes(userData?._id))
        {
            showSuccess(`You have been added to ${groupData?.name} group 🎉`);
            setGroups(prev => [...prev, groupData]);
        }

        // Case:02 Update member list for old members if they currently selected this group
        if(groupId === selectedGroupRef.current)
        {
            setSelectedGroup(prev => {
                if(!prev) return prev;
                return {
                    ...prev,
                    members: [...prev.members, ...newMembers]
                };
            });
        }
    }, []));

    // Listen for promotion to admin in real time
    useSocket("promoted-to-admin", useCallback(({ groupName, groupId, memberId }) => {
        if(!groupName || !groupId || !memberId) return;

        // Case:01 Update in group list
        setGroups(prev => 
            prev.map(group => {
                if(group._id !== groupId) return group;
                return {
                    ...group,
                    admins: group.admins.includes(memberId) ? group.admins : [...group.admins, memberId]
                };
            }
        ));

        // Case:02 Update if group is currently selected
        if(selectedGroupRef.current === groupId)
        {
            setSelectedGroup(prev => {
                if(!prev) return prev;
                return {
                    ...prev,
                    admins: prev.admins.includes(memberId) ? prev.admins : [...prev.admins, memberId]
                };
            });
        }
        
        // Case:03 Notify to promoted member
        if(userData?._id === memberId) showSuccess(`You have been promoted to admin in ${groupName} group 🎉`);
    },[]));

    // Listen for removal of admin access
    useSocket("removed-as-admin", useCallback(({ groupId, memberId }) => {
        if(!groupId || !memberId) return;

        // Case:01 Update in group list
        setGroups(prev => 
            prev.map(group => {
                if(group?._id !== groupId) return group;
                return {
                    ...group,
                    admins: group?.admins.filter(adminId => adminId !== memberId)
                };
            })
        );

        // Case:02 Update if group is currently selected
        if(selectedGroupRef.current === groupId)
        {
            setSelectedGroup(prev => {
                if(!prev) return prev;
                return {
                    ...prev,
                    admins: prev?.admins.filter(adminId => adminId !== memberId)
                };
            });
        }        
    },[]));

    return (
        <>
            <aside className={`${styles.sidebar}`}> 
                {/* User name */}
                <div className={styles.logo}>
                    <FaUserAlt size={25} />
                    <span> { userData?.name } </span>
                </div>

                <nav className={styles.nav}>
                    {/* Users section */}
                    <h4 className={styles.heading}> <FaUsers size={35} /> Users </h4>
                    
                    {/* User list */}
                    {users.map(user => (
                        user?._id !== userData?._id && (
                            <NavLink className={styles.navItem} key={user?._id} onClick={ () => selectUser(user) }>
                                { user.name }  
                                <span className="me-1"> 
                                    { <FaCircle color={user.onlineStatus === "Online" ? "green" : "gray"} size={12} /> } 
                                </span>
                            </NavLink>
                        )
                    ))}
                    <hr />                 

                    {/* Groups section */}
                    <h4 className={styles.heading}> <FaLayerGroup size={35} /> Groups </h4>

                    {/* Create group button */}
                    <div className="mt-2 ms-3">
                        <Button type="button" onClick={ () => setShowModal(true) }> <FaPlus /> Create group </Button>
                    </div>   

                    {/* Group list */}
                    {groups.map(group => (
                        group?.members?.includes(userData?._id) && (
                            <div key={group?._id} className={styles.groupItem}>
                            {editFieldId && editFieldId === group?._id ? (
                                <div style={{ width:"100%", marginBottom:"5px" }}>
                                    {/* Editing Field */}
                                    <FormikForm initialValues={{ _id:group?._id, name:group?.name }} handlerFunction={updateGroup} className="/">
                                        <Input type="text" name="name" className="input mt-3 mb-2" placeholder="Edit Name" required />
                                        <div className="d-flex mt-2 gap-2">
                                            <Button type="submit"> Save </Button>
                                            <Button type="button" onClick={() => setEditFieldId(null)}> Cancel </Button>
                                        </div>
                                    </FormikForm>
                                </div>
                            )
                            :
                            (
                                <>
                                    {/* Group names */}
                                    <NavLink className={styles.navItem} onClick={() => selectGroup(group)}>
                                        <FaUsers size={25} /> {group?.name} 
                                        {/* <br />
                                        { group?.lastMessage?.from?.name }: { group?.lastMessage?.message.substring(0, 20) } */}
                                    </NavLink>

                                    {/* Group menu */}
                                    <MenuPopup item={group} options={groupMenuOptions} />
                                </>
                            )}
                            </div>
                        )
                    ))}
                    <hr />                    

                    {/* Logout */}
                    <NavLink onClick={userLogout} className={styles.navItem}>
                        <FaSignOutAlt size={25} /> <div className={styles.logoutLink}> Logout </div>
                    </NavLink>
                </nav>

                {/* Create group */}
                <CreateGroup showModal={showModal} handleCloseModal={handleCloseModal} />
            </aside> 
        </>
    );
}

export default Sidebar;