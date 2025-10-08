import { toast, Zoom, Icons } from 'react-toastify';

// Success
export const showSuccess = (msg) => {
    toast.success(msg, {
        position: 'bottom-left',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
        theme: 'colored',
        icon: Icons.success,
        transition: Zoom,
    });
};

// Error
export const showError = (msg) => {
    toast.error(msg, {
        position: 'bottom-left',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true,
        theme: 'colored',
        icon: Icons.warning,
        transition: Zoom,
    });
};