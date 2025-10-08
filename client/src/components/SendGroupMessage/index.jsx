import { useCallback, useRef } from 'react';
import styles from './style.module.css';
import FormikForm from '../FormikForm';
import Input from '../InputFields';
import { useChat } from '../../context/chat';
import { userData } from '../../utils/getUser';
import socket from '../../service/socket';
import api from '../../service/axios';

function SendGroupMessage() 
{
    // States
    const { selectedGroup } = useChat();

    // Refs
    const isTypingRef = useRef(null);
    const timerRef = useRef(null);
    
    // Initial values
    const initialValues = {
        conversationId: selectedGroup?._id || "",
        message: "",
    };

    // Send group message
    const sendGroupMessage = useCallback(async (payload, action) => {
        if(!payload.message.trim()) return;

        // Force typing stop immediately
        isTypingRef.current = false;
        socket.emit("group-typing:stop", { senderName:userData?.name, groupId:selectedGroup?._id });
        try 
        {
            await api.post({ url:"/chat/group-message", payload, enableSuccessMessage:false });
            action.resetForm();
        } 
        catch (error) 
        {
            console.log(error.message);
        }
    }, []);

    // Typing handler for group chat
    const handleGroupTyping = useCallback((message, senderName, groupId) => {
        if(!message.trim()) return;

        if(!isTypingRef.current)
        {
            isTypingRef.current = true;
            socket.emit("group-typing:start", { senderName, groupId });
        }

        // Clear old timer
        if(timerRef.current) clearTimeout(timerRef.current); 

        // Start new timer
        timerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            socket.emit("group-typing:stop", { senderName, groupId });
            timerRef.current = null;
        }, 1500);
    }, []);


    return (
        <>
            {/* Form */}
            <FormikForm initialValues={initialValues} handlerFunction={sendGroupMessage} className="/">
                {/* Input Wrapper */}
                <div className={styles.inputWrapper}>
                    <Input type="text" name="message" placeholder="Type a message..." className={styles.messageInput} autoComplete="off"
                    onChange={ (e) => handleGroupTyping(e.target.value, userData?.name, selectedGroup?._id) } />
                    <button type="submit" className={styles.sendBtn}> ➤ </button>
                </div>
            </FormikForm>        
        </>
    );
}

export default SendGroupMessage;