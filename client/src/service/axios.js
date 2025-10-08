import axios from "axios";
import { backendURL } from "../constants";
// import { csrfToken } from "../utils/token";
import { startLoading, startSaving, stopLoading, stopSaving } from '../utils/loadingManager';
import { showSuccess, showError } from '../utils/toasterMessage';


// Create instance
const client = axios.create({
    baseURL: `${backendURL}/api/v1`,
    withCredentials: true,
    withXSRFToken: true, 
    xsrfCookieName: '_csrf',
    xsrfHeaderName: 'CSRF-Token'
});

// Request interceptor
client.interceptors.request.use(async (request) => {
    // if(csrfToken) request.headers["CSRF-Token"] = csrfToken; // Inject token in header
    return request;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor
client.interceptors.response.use((response) => {
    const { data, message, statusCode, success } = response.data;
    const headers = response.headers;
    return { data, message, statusCode, success, headers };    
}, (error) => {
    const data = error?.response?.data || null;
    const success = data?.success || false;
    const message = data?.message || "An unknown error occur";
    const statusCode = error?.response?.status || null;
    const stack = error?.stack || null;  
    return Promise.reject({ data, message, success, statusCode, stack });
});

// Blue Print For API Request Service Provider
class ApiRequest
{
    // Get request
    async get({ url, activateLoader = true, enableSuccessMessage = false, enableErrorMessage = true }) 
    {
        if(activateLoader) startLoading();
        try 
        {
            const response = await client.get(url);
            if(enableSuccessMessage) showSuccess(response.message);
            return response;
        } 
        catch(error) 
        {
            if(enableErrorMessage) showError(error.message);
            throw error;
        }
        finally
        {
            stopLoading();
        }
    };

    // Post request
    async post({ url, payload, fileAttachment = false, activateLoader = true, enableSuccessMessage = true, enableErrorMessage = true })
    {
        if(activateLoader) startSaving();
        try 
        {
            let options = {};
            if(fileAttachment) options = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await client.post(url, payload, options);
            if(enableSuccessMessage) showSuccess(response.message);
            return response;
        } 
        catch(error) 
        {
            if(enableErrorMessage) showError(error.message);
            throw error;
        }
        finally
        {
            stopSaving();
        }
    }; 
    
    // Put request
    async put({ url, payload, fileAttachment = false, activateLoader = true, enableSuccessMessage = true, enableErrorMessage = true }) 
    {
        if(activateLoader) startSaving();
        try 
        {
            let options = {};
            if(fileAttachment) options = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await client.put(url, payload, options);
            if(enableSuccessMessage) showSuccess(response.message);
            return response;
        } 
        catch(error) 
        {
            if(enableErrorMessage) showError(error.message);
            throw error;
        }
        finally
        {
            stopSaving();
        }
    };
    
    // Patch request
    async patch({ url, payload, fileAttachment = false, activateLoader = true, enableSuccessMessage = true, enableErrorMessage = true }) 
    {
        if(activateLoader) startSaving();
        try 
        {
            let options = {};
            if(fileAttachment) options = { headers: { "Content-Type": "multipart/form-data" } };
            const response = await client.patch(url, payload, options);
            if(enableSuccessMessage) showSuccess(response.message);
            return response;
        } 
        catch(error) 
        {
            if(enableErrorMessage) showError(error.message);
            throw error;
        }
        finally
        {
            stopSaving();
        }
    };
    
    // Delete request
    async delete({ url, activateLoader = true, enableSuccessMessage = true, enableErrorMessage = true })
    {
        if(activateLoader) startSaving();
        try 
        {
            const response = await client.delete(url);
            if(enableSuccessMessage) showSuccess(response.message);
            return response;
        } 
        catch(error) 
        {
            if(enableErrorMessage) showError(error.message);
            throw error;
        }
        finally
        {
            stopSaving();
        }
    };
}

// Instance
const api = new ApiRequest();

export default api;