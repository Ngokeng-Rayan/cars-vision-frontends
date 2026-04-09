import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,

            // Stockage dans Zustand persist + localStorage pour que api.js intercepteur puisse lire le token
            // BUG FIX : utilisation de 'token' et 'refreshToken' comme clés cohérentes avec api.js
            setAuth: (user, token, refreshToken) => {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken || '');
                localStorage.setItem('user', JSON.stringify(user)); // FIX #1
                set({ user, token, refreshToken, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user'); // FIX #1
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
            },

            // Appelé après un refresh automatique (depuis api.js) pour resynchroniser le store
            updateTokens: (token, refreshToken) => {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                set({ token, refreshToken });
            },

            updateUser: (userData) => {
                set((state) => ({ user: { ...state.user, ...userData } }));
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export { useAuthStore };
export default useAuthStore;
