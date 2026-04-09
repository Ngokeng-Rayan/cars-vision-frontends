import api from '../lib/api'

export const activityService = {
    // Admin - Liste journal
    getActivityLog: async (params = {}) => {
        const response = await api.get('/admin/journal', { params })
        return response.data
    },

    // Admin - Liste journal (alias pour compatibilité)
    getAllActivities: async (params = {}) => {
        const response = await api.get('/admin/journal', { params })
        return response.data
    },

    // Admin - Détails action
    getActionDetails: async (id) => {
        const response = await api.get(`/admin/journal/${id}`)
        return response.data
    },

    // Admin - Statistiques journal
    getActivityStats: async (params = {}) => {
        const response = await api.get('/admin/journal/statistiques', { params })
        return response.data
    }
}
