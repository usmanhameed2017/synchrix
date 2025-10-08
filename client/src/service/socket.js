import { io } from "socket.io-client";
import { backendURL } from "../constants";

// Configuration
const socket = io(backendURL, { 
    withCredentials: true, 
    autoConnect: false // Connect socket after login
});

// Connect socket
export const connectSocket = (authToken = null) => {
    try 
    {
        // Destroy previous instance and event listeners if exist
        if(socket.connected)
        {
            socket.removeAllListeners();
            socket.disconnect();
        }
        
        // Connect socket only if user is login
        if(authToken)
        {
            socket.auth = { authToken: authToken };
            socket.connect();
        }
    } 
    catch(error) 
    {
       console.log("Failed to connect socket", error.message);
    }
};

// Disconnect socket
export const disconnectSocket = () => {
    try 
    {
        if(socket.connected)
        {
            socket.removeAllListeners();
            socket.disconnect();
        }
    } 
    catch(error) 
    {
        console.log("Failed to disconnect socket", error.message);
    }
};

export default socket;