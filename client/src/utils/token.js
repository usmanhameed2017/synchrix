export let csrfToken = null;

// Get CSRF Token
export const getCsrfToken = (token) => {
    csrfToken = token;
}