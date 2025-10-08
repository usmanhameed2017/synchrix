import { useState, createContext, useContext, useRef } from 'react';

// Create chat context
const ChatContext = createContext();

function ChatProvider({ children }) 
{
    // Global states
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [groupMessages, setGroupMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Global references
    const selectedUserRef = useRef(null);
    const selectedGroupRef = useRef(null);

    return (
        <ChatContext.Provider value={{ selectedUser, setSelectedUser, selectedGroup, setSelectedGroup, 
        privateMessages, setPrivateMessages, groupMessages, setGroupMessages, showModal, setShowModal, 
        selectedUserRef, selectedGroupRef }}>
            { children }
        </ChatContext.Provider>
    );
}

// Custom hook
export const useChat = () => useContext(ChatContext);

export default ChatProvider;