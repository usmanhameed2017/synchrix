import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLoadingFunction, setSavingFunction } from '../utils/loadingManager';
import { connectSocket, disconnectSocket } from '../service/socket';
import { useChat } from './chat';
import { getUser } from '../utils/getUser';
import api, { obtainXSRFToken } from '../service/axios';

// Create auth context
const AuthContext = createContext();

function AuthProvider({ children })
{
    // Global states
    const [user, setUser] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [savingChanges, setSavingChanges] = useState(false);
    const { setSelectedUser, setSelectedGroup } = useChat();

    // For navigation
    const navigate = useNavigate();

    // Signup
    const userSignup = useCallback(async (payload, action) => {
        try 
        {
            await api.post({ url:"/auth/user/signup", payload });
            action.resetForm();
            navigate("/login");
        } 
        catch(error) 
        {
            return error;
        }
    },[]);

    // User Login
    const userLogin = useCallback(async (payload, action) => {
        try
        {
            const response = await api.post({ url:"/auth/user/login", payload });
            connectSocket(response.data?.accessToken); // Connect socket
            setUser(response.data.user);
            setLoggedIn(response.success);
            getUser(response.data.user);
            action.resetForm();
            navigate('/home');
        }
        catch(error)
        {
            return error;
        }
    },[]);

    // User Logout
    const userLogout = useCallback(async () => {
        try 
        {
            await api.get({ url:"/auth/user/logout" });
            disconnectSocket(); // Disconnect socket

            setUser(null);
            setLoggedIn(false);
            getUser(null);
            setSelectedUser(null);
            setSelectedGroup(null);
            navigate("/", { replace:true });
        } 
        catch (error) 
        {
           return error;
        }
    },[]);   

    // Verify authentication
    const isAuthenticated = useCallback(async () => {
        try 
        {
            const response = await api.get({ url:"/auth/user/isAuthenticated", enableErrorMessage:false });
            connectSocket(response.data?.accessToken); // Connect socket
            setUser(response.data.user);
            setLoggedIn(response.success);
            getUser(response.data.user);
        } 
        catch(error) 
        {
            disconnectSocket(); // Disconnect socket
            setUser(null);
            setLoggedIn(false);
            getUser(null);
            return error;
        }
    },[]);

    // On app load
    useEffect(() => {
        obtainXSRFToken();
        isAuthenticated();
        setLoadingFunction(setLoading);
        setSavingFunction(setSavingChanges);
    },[]);

    return(
        <AuthContext.Provider value={{ userSignup, userLogin,  userLogout, loading, setLoading,
        savingChanges, setSavingChanges, isLoggedIn, setLoggedIn, user, setUser }}>
            { children }
        </AuthContext.Provider>
    );
}

// Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;