import { useEffect, useRef, useState } from 'react';
import styles from "./style.module.css";
import { useChat } from '../../context/chat';
import { HiArrowLeft } from "react-icons/hi";
import GroupChats from '../GroupChats';
import SendGroupMessage from '../SendGroupMessage';
import { FaUsers } from "react-icons/fa";
import { BsPersonPlusFill } from "react-icons/bs";
import { useCallback } from 'react';
import { useUser } from '../../context/user';
import { userData } from '../../utils/getUser';
import MenuPopup from '../MenuPopup';
import sweetAlert from '../../utils/sweetAlert2';
import useSocket from '../../hooks/useSocket';
import AddNewMembersToGroup from '../AddNewMembersToGroup';
import ViewGroupMembers from '../ViewGroupMembers';
import api from '../../service/axios';

function GroupChatWindow() 
{
    // States
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const { selectedGroup, setSelectedGroup, selectedGroupRef, groupMessages } = useChat();
    const { setGroups } = useUser();

    // Created chat body reference
    const chatBodyRef = useRef(null);

    // Auto-scroll for new messages
    useEffect(() => {
        if(chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, [groupMessages]);

    // View members in group
    const viewMembers = useCallback((payload) => {
        if(!payload?._id) return;
        setShowModal2(true);
    },[]);

    // Leave group
    const leaveGroup = useCallback((payload) => {
        if(!payload?._id) return;
        if(!userData?._id) return;
        sweetAlert.confirm({ title:"Confirm?", text:"Are you sure to leave this group?", fn:async () => {
            try 
            {
                // Response
                const response = await api.patch({ url:`/group/${payload._id}/member/${userData._id}` });
                if(!response.data?._id) return;

                // Remove group chat window if opened
                if(response.data?._id === selectedGroupRef.current) setSelectedGroup(null);

                // Remove group from sidebar
                setGroups(prev => prev.filter(group => group?._id !== response.data?._id));
            } 
            catch(error) 
            {
                console.log(error.message);
            }
        } });
    },[]);

    // Listen for member leaving the group in real time
    useSocket("member-removed-from-group", useCallback(({ groupId, memberId }) => {
        if(!groupId || !memberId) return;

        // Update selected group if it is the same one
        if(selectedGroupRef.current === groupId) 
        {
            if(userData?._id === memberId)
            {
                setSelectedGroup(null); // Close the selected window on removed user's screen
                selectedGroupRef.current = null;
            }

            setSelectedGroup(prev => {
                if(!prev) return prev;
                return { 
                    ...prev, 
                    members: prev.members.filter(id => id !== memberId),
                    admins:  prev.admins.filter(id => id !== memberId)
                };
            });            
        }

        // Exclude member from the group
        setGroups(prev =>
            prev.map(group => {
                if(group._id !== groupId) return group;
                return { 
                    ...group, 
                    members: group.members.filter(id => id !== memberId),
                    admins:  group.admins.filter(id => id !== memberId)
                };
            }));
    },[]));

    // Group chat tab options
    const groupChatTabOptions = [{ name:"View members", handler:viewMembers }, { name:"Leave", handler:leaveGroup }];

    // Don't show window chat if user is not selected
    if(!selectedGroup) return null;

    return (
        <>
            {/* Wrapper for group menu */}
            <div className={styles.wrapper}>
                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    {/* Header Left */}
                    <div className={styles.headerLeft}>
                        {/* Back Button */}
                        <button onClick={() => setSelectedGroup(null)} className={styles.backBtn}> <HiArrowLeft /> </button>
                        {/* Group Name */}
                        <h4> <FaUsers size={25} /> {selectedGroup.name} </h4>
                    </div>

                    {/* Header right */}
                    <div className={styles.headerRight}>
                    {selectedGroup.admins.includes(userData?._id) && (
                        // Add new member icon (Only admin can add new members to the group)
                        <span className={styles.headerRightContent} title='Add new member' onClick={ () => setShowModal1(true) }> 
                            <BsPersonPlusFill size={25} /> 
                        </span>
                    )}

                        {/* Group chat tab menu icon */}
                        <span className={styles.headerRightContent}> 
                            <MenuPopup item={selectedGroup} options={groupChatTabOptions} iconSize={25} />                             
                        </span>                       
                    </div>
                </div>

                {/* Chat Body */}
                <div className={styles.chatBody} ref={chatBodyRef}>
                    <GroupChats />
                </div>

                {/* Chat Footer */}
                <div className={styles.chatFooter}>
                    <SendGroupMessage />
                </div>
            </div>

            {/* Adding New Members To Group */}
            <AddNewMembersToGroup showModal={showModal1} setShowModal={setShowModal1} />

            {/* View Group Members */}
            <ViewGroupMembers showModal={showModal2} setShowModal={setShowModal2} />           
        </>
    );
}

export default GroupChatWindow;