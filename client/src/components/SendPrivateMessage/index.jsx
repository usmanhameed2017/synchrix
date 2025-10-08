import { useCallback, useRef } from 'react';
import styles from './style.module.css';
import FormikForm from '../FormikForm';
import Input from '../InputFields';
import { useChat } from '../../context/chat';
import socket from '../../service/socket';
import { userData } from '../../utils/getUser';
import { showError } from '../../utils/toasterMessage';
import api from '../../service/axios';

function SendPrivateMessage() 
{
    // States
    const { selectedUser } = useChat();

    // Refs
    const isTypingRef = useRef(null);
    const timerRef = useRef(null);
    
    // Initial values
    const initialValues = {
        to: selectedUser?._id || "",
        message: "",
    };

    // Send private message
    const sendPrivateMessage = useCallback(async (payload, action) => {
        if(!payload.message.trim()) return;

        // Destructure user object
        const { _id, name } = userData || {};
        if(!_id || !name) return showError("Login required!");

        // Force typing stop immediately
        isTypingRef.current = false;
        socket.emit("private-typing:stop", { senderId:_id, senderName:name, receiverId:payload.to });
        try 
        {
            await api.post({ url:"/chat/private-message", payload, enableSuccessMessage:false });
            action.resetForm();
        } 
        catch (error) 
        {
            console.log(error.message);
        }
    }, []);

    // Typing handler for private chat
    const handlePrivateTyping = useCallback((message, receiverId) => {
        if(!message.trim()) return;

        // Destructure user object
        const { _id, name } = userData || {};
        if(!_id || !name) return;

        if(!isTypingRef.current)
        {
            isTypingRef.current = true;
            socket.emit("private-typing:start", { senderId:_id, senderName:name, receiverId });
        }

        // Clear old timer
        if(timerRef.current) clearTimeout(timerRef.current); 

        // Start new timer
        timerRef.current = setTimeout(() => {
            isTypingRef.current = false;
            socket.emit("private-typing:stop", { senderId:_id, senderName:name, receiverId });
            timerRef.current = null;
        }, 1500);
    },[]);

    return (
        <>
            {/* Form */}
            <FormikForm initialValues={initialValues} handlerFunction={sendPrivateMessage} className="/">
                {/* Input Wrapper */}
                <div className={styles.inputWrapper}>
                    <Input type="text" name="message" placeholder="Type a message..." className={styles.messageInput} autoComplete="off"
                    onChange={ (e) => handlePrivateTyping(e.target.value, selectedUser?._id)} />
                    <button type="submit" className={styles.sendBtn}> ➤ </button>
                </div>
            </FormikForm>
        </>
    );
}

export default SendPrivateMessage;