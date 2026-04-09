import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Ne pas intercepter les 401 des endpoints d'auth (login/register/refresh)
        const authPaths = ['/auth/login', '/auth/register', '/auth/refresh'];
        const isAuthRequest = authPaths.some(path => originalRequest.url?.includes(path));
        if (isAuthRequest) {
            return Promise.reject(error);
        }

        // FIX #6 : Flag _retry pour éviter la boucle infinie
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/auth/refresh`, {
                        refresh_token: refreshToken,
                    });
                    localStorage.setItem('token', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    // FIX #7 : Synchroniser le store Zustand
                    useAuthStore.getState().updateTokens(data.accessToken, data.refreshToken);

                    // Retry la requête originale
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api.request(originalRequest);
                } catch (refreshError) {
                    // Refresh échoué : FIX #7 — Vider le store Zustand proprement
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                }
            } else {
                // Pas de refresh token : déconnexion propre
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
