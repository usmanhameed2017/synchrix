// Store to local storage
export const setToLocalStorage = (key, value) => {
    if(!key) return;
    if(typeof value === "object")
    {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    else
    {
        localStorage.setItem(key, value);
        return true;
    }
};

// Get from local storage
export const getFromLocalStorage = (key) => {
    if(!key) return;
    try 
    {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } 
    catch(error) 
    {
        return localStorage.getItem(key);
    }
};

// Remove from local storage
export const removeFromLocalStorage = (key) => {
    if(!key) return;
    try 
    {
        localStorage.removeItem(key);
        return true;
    } 
    catch(error) 
    {
        console.log("Failed to delete item from local storage", error.message);
        return false;
    }
};

// Clear local storage
export const clearLocalStorage = () => {
    try 
    {
        localStorage.clear();
        return true;
    } 
    catch(error) 
    {
        console.log("Failed to clear local storage", error.message);
        return false;
    }
};