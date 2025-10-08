import { useCallback, useEffect, useRef } from 'react';
import styles from "./style.module.css";
import { useChat } from '../../context/chat';
import useSocket from '../../hooks/useSocket';
import { HiArrowLeft } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import SendPrivateMessage from '../SendPrivateMessage';
import PrivateChats from '../PrivateChats';
import MenuPopup from '../MenuPopup';
import sweetAlert from '../../utils/sweetAlert2';
import { userData } from '../../utils/getUser';
import { showError } from '../../utils/toasterMessage';
import api from '../../service/axios';

function PrivateChatWindow() 
{
    // Global States
    const { selectedUser, setSelectedUser, privateMessages, setPrivateMessages, selectedUserRef } = useChat();

    // Created chat body reference
    const chatBodyRef = useRef(null);

    // Auto-scroll for new messages
    useEffect(() => {
        if(chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, [privateMessages]);

    // Online statuses in real time
    const handleStatus = useCallback((data) =>  {
        if(data._id === selectedUser?._id) 
        {
            setSelectedUser(prev => ({ ...prev, onlineStatus: data.onlineStatus }));
        }
    },[selectedUser?._id]);

    // Clear conversation
    const clearChat = useCallback((payload) => {
        // Validate
        if(!userData?._id) return showError("Login required!");
        if(!payload?._id) return showError("Chat ID is missing");
        
        sweetAlert.confirm({ title:"Confirm?", text:"Are you sure to clear this conversation?", fn:async () => {
            try 
            {
                await api.delete({ url:`/chat/private-chat/clear-conversation/${payload._id}` });
            } 
            catch(error) 
            {
                console.log(error.message);
            }
        }});
    },[]);

    // Listen for online and offline statuses in real time
    useSocket("user-online", handleStatus);
    useSocket("user-offline", handleStatus);

    // Listen for clear conversation - (Private chat)
    useSocket("private:clear-chat", useCallback(({ conversationId }) => {
        if(selectedUserRef.current === conversationId) setPrivateMessages([]);
    },[]));

    // Private chat tab menu
    const privateChatTabMenu = [{ name:"Clear chat", handler:clearChat }];

    // Don't show window chat if user is not selected
    if(!selectedUser) return null;

    return (
        <div className={styles.wrapper}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                    {/* Back Button */}
                    <button onClick={() => setSelectedUser(null)} className={styles.backBtn}> <HiArrowLeft /> </button>
                    {/* Name */}
                    <h4> <FaUser size={20} /> { selectedUser.name } </h4>
                </div>

                {/* Online Status */}
                <span className={styles.status}>
                    {selectedUser.onlineStatus === "Online" ? "🟢 Online" : "⚪ Offline"}
                </span>
                <span>
                    <MenuPopup item={selectedUser} options={privateChatTabMenu} />
                </span>
            </div>

            {/* Chat Body */}
            <div className={styles.chatBody} ref={chatBodyRef}>
                <PrivateChats />
            </div>

            {/* Chat Footer */}
            <div className={styles.chatFooter}>
                <SendPrivateMessage />
            </div>
        </div>
    );
}

export default PrivateChatWindow;