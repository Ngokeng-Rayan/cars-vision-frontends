import api from '../lib/api';

export const authService = {
    register: async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        return data;
    },

    login: async (credentials) => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },

    // BUG FIX : envoyer le refresh token dans le body pour que le backend l'invalide en BDD
    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await api.post('/auth/logout', { refresh_token: refreshToken });
        return data;
    },

    // BUG FIX : le backend attend { refresh_token } (snake_case), pas { refreshToken }
    refreshToken: async (refreshToken) => {
        const { data } = await api.post('/auth/refresh', { refresh_token: refreshToken });
        return data;
    },

    forgotPassword: async (email) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
    },

    resetPassword: async (token, newPassword) => {
        const { data } = await api.post('/auth/reset-password', { token, nouveau_mot_de_passe: newPassword });
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/users/profile');
        return data;
    },

    updateProfile: async (userData) => {
        const { data } = await api.put('/users/profile', userData);
        return data;
    },
};
