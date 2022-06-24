export const parseJWT = () => {
    const token = localStorage.getItem('session-token');
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const parsedJwt = JSON.parse(window.atob(base64));
        return {
            role: parsedJwt.role,
            id: parsedJwt._id,
            fullName: parsedJwt.fullName
        }
    }
};