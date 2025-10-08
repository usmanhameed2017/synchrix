import { useState, createContext, useContext, useEffect } from 'react';
import { useAuth } from './auth';
import api from '../service/axios';

// Create user context
const UserContext = createContext();

function UserProvider({ children }) 
{
    // Global state
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const { isLoggedIn } = useAuth();

    // Fetch all users and groups on app load
    useEffect(() => {
        // Api call only if user is logged in
        if(isLoggedIn === true)
        {
            // Users
            api.get({ url:"/user" })
            .then(response => setUsers(response.data))
            .catch(error => console.log(error.message));

            // Groups
            api.get({ url:"/group" })
            .then(response => setGroups(response.data))
            .catch(error => console.log(error.message));
        }
        else
        {
            if(users.length > 0) setUsers([]);
            if(groups.length > 0) setGroups([]);
        }
    },[isLoggedIn]); 

    return (
        <UserContext.Provider value={{ users, setUsers, groups, setGroups }}>
            { children }
        </UserContext.Provider>
    );
}

// Custom hook
export const useUser = () => useContext(UserContext);

export default UserProvider;