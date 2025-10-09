import { useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";
import { getTime } from "../../utils/time";
import { useChat } from "../../context/chat";
import useSocket from "../../hooks/useSocket";
import { userData } from "../../utils/getUser";
import { showError } from "../../utils/toasterMessage";
import MenuPopup from "../MenuPopup";
import sweetAlert from "../../utils/sweetAlert2";
import FormikForm from "../FormikForm";
import Input from "../InputFields";
import Button from "../Button";
import generateConversationId from "../../utils/generateConversationId";
import api from "../../service/axios";

function PrivateChats() 
{
    // States
    const { selectedUser, privateMessages, setPrivateMessages, selectedUserRef } = useChat();
    const [error, setError] = useState("");
    const [editFieldId, setEditFieldId] = useState(null);
    const [oldMessage, setOldMessage] = useState("");
    const [isTyping, setTyping] = useState(false);
    const [typerName, setTyperName] = useState("");


    // Fetch chats
    useEffect(() => {
        if(!selectedUser?._id) return;
        selectedUserRef.current = generateConversationId(userData?._id, selectedUser?._id);
        setPrivateMessages([]);
        setError("");
        api.get({ url:`/chat/private-message/${selectedUser?._id}`, enableErrorMessage:false })
        .then((response) => setPrivateMessages(response.data))
        .catch((error) => setError(error.message));
    }, [selectedUser?._id]);

    // Edit message
    const editMessage = useCallback((message) => {
        if(!message?._id) return showError("Message ID is missing");
        setOldMessage(message.message);
        setEditFieldId(message._id);
    },[]);

    // Update message
    const updateMessage = useCallback(async (payload) => {
        if(!payload?._id) return showError("Message ID is missing");
        // If message was not modified
        if(payload.message.trim() === oldMessage.trim())
        {
            setEditFieldId(null);
            setOldMessage("");
            return;
        }

        try 
        {
            await api.patch({ url:`/chat/private-message/updateMessage/${payload._id}`, payload, enableSuccessMessage:false });
            setEditFieldId(null);
            setOldMessage("");
        } 
        catch(error) 
        {
            console.log(error.message);
        }
    },[oldMessage]);

    // Delete message
    const deleteMessage = useCallback(async (message) => {
        if(!message?._id) return showError("Message ID is missing");
        sweetAlert.confirm({ title:"Confirm?", text:"Are you sure to delete this message?", fn:async () => {
            try 
            {
                await api.delete({ url:`chat/private-message/deleteMessage/${message._id}`, enableSuccessMessage:false });
            } 
            catch(error) 
            {
                console.log(error.message);
            }
        }});
    },[]);
    
    // Message menu options
    const messageMenuOptions = [{ name:"Edit", handler:editMessage }, { name:"Delete", handler:deleteMessage }];    


    /* ==================== R E A L  T I M E  H A N D L E R S ==================== */

    // Listen for incoming messages in real time
    useSocket("private-message", useCallback((data) => {
        if(!data?._id) return;
        if(data?.conversationId !== selectedUserRef.current) return;
        setPrivateMessages((prev) => [...prev, data]);
    }, []));

    // Listen for message updation in real time
    useSocket("message-updated", useCallback((data) => {
        if(!data?._id) return;
        if(data?.conversationId !== selectedUserRef.current) return;
        setPrivateMessages(prev => prev.map(message => message?._id === data._id ? data : message));
    }, []));

    // Listen for message deletion in real time
    useSocket("message-deleted", useCallback((data) => {
        if(!data?._id) return;
        if(data?.conversationId !== selectedUserRef.current) return;
        setPrivateMessages(prev => prev.filter(message => message?._id !== data?._id));
    }, []));

    // Listen for start typing in real time for private chat
    useSocket("private-typing:start", useCallback(({ senderName, conversationId }) => {
        if(selectedUserRef.current === conversationId)
        {
            setTyperName(senderName);
            setTyping(true);
        }
    }, []));

    // Listen for stop typing in real time for private chat
    useSocket("private-typing:stop", useCallback(({ conversationId }) => {
        if(selectedUserRef.current === conversationId)
        {
            setTyperName("");
            setTyping(false);
        }
    }, []));

    return(
        <>
            {privateMessages && Array.isArray(privateMessages) && privateMessages.length > 0 ? (
                privateMessages.map((chat) => {
                    const isSender = userData?._id === chat?.from;
                    if(isSender)
                    {
                        {/* Edit Sender Message */}
                        if(editFieldId && editFieldId === chat?._id) return (
                            <div key={chat?._id} className={styles.editSenderMessage}>
                                <FormikForm initialValues={{ _id:chat?._id, message:chat?.message }} handlerFunction={updateMessage} className="/">
                                    <Input type="textarea" rows="3" name="message" placeholder="Edit Message" required />
                                    <div className="d-flex mt-2 gap-2">
                                        <Button type="submit"> Save </Button>
                                        <Button type="button" onClick={() => setEditFieldId(null)}> Cancel </Button>
                                    </div>                                    
                                </FormikForm>
                            </div>
                        );

                        {/* Sender Messages */}
                        return (
                            <div key={chat?._id} className={styles.senderMessage}>
                                <span className="me-1">
                                    {/* Message */}
                                    {chat?.message}

                                    {/* Message Bottom Content */}
                                    <small className={styles.messageBottomSection}>
                                        {/* Edit Flag */}
                                        {chat?.isEdited && (
                                            <> Edited </>
                                        )}

                                        {/* Timestamp */}
                                        { getTime(chat?.createdAt) } 
                                    </small>                                    
                                </span>

                                {/* Message menu popup */}
                                <MenuPopup item={chat} options={messageMenuOptions} />
                            </div>
                        );
                    }
                    else
                    {
                        {/* Receiver Messages */}
                        return (
                            <div key={chat?._id} className={styles.receiverMessage}>
                                <span> 
                                    {/* Message */}
                                    {chat?.message} 

                                    {/* Message Bottom Content */}
                                    <small className={styles.messageBottomSection}>
                                        {/* Edit Flag */}
                                        {chat?.isEdited && (
                                            <> Edited </>
                                        )}

                                        {/* Timestamp */}
                                        { getTime(chat?.createdAt) } 
                                    </small>                                     
                                </span>
                            </div>                                                                                                
                        );
                    }
                }
            ))
            : 
            (
                // No messages yet
                <span className="text-secondary"> { error || "No messages yet" } </span>
            )}

            {isTyping && typerName && (
                <div className="mt-2">
                    <span className="text-secondary"> { typerName } is typing... </span>
                </div>                
            )}
        </>
    );
}

export default PrivateChats;