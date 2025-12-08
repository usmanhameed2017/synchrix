import { useEffect } from "react";
import socket from "../service/socket";

function useSocket(event, callback)
{
    useEffect(() => {
        if(!socket || !event || typeof callback !== "function") return;

        // Listen for event
        socket.on(event, callback);

        // Cleanup on unmount
        return () => socket.off(event, callback);
    }, [event, callback]);
}

export default useSocket;