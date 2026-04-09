import api from '../lib/api'

export const userService = {
    // Client - Mon profil
    getProfile: async () => {
        const response = await api.get('/users/me')
        return response.data
    },

    // Client - Modifier mon profil
    updateProfile: async (profileData) => {
        const response = await api.put('/users/me', profileData)
        return response.data
    },

    // Client - Changer mon mot de passe
    changePassword: async (passwordData) => {
        const response = await api.put('/users/me/password', passwordData)
        return response.data
    },

    // Admin - Liste des utilisateurs
    getAllUsers: async (filters = {}) => {
        const response = await api.get('/admin/users', { params: filters })
        return response.data
    },

    // Admin - Créer un utilisateur backoffice
    createUser: async (userData) => {
        const response = await api.post('/admin/users', userData)
        return response.data
    },

    // Admin - Modifier un utilisateur
    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData)
        return response.data
    },

    // Admin - Supprimer un utilisateur
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`)
        return response.data
    }
}
