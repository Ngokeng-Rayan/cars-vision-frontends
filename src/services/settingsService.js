import api from '../lib/api'

export const settingsService = {
    // Admin - Liste paramètres
    getAllSettings: async () => {
        const response = await api.get('/admin/parametres')
        return response.data
    },

    // Admin - Voir paramètre
    getSetting: async (key) => {
        const response = await api.get(`/admin/parametres/${key}`)
        return response.data
    },

    // Admin - Créer paramètre
    createSetting: async (settingData) => {
        const response = await api.post('/admin/parametres', settingData)
        return response.data
    },

    // Admin - Modifier paramètre
    updateSetting: async (key, settingData) => {
        const response = await api.put(`/admin/parametres/${key}`, settingData)
        return response.data
    },

    // Admin - Supprimer paramètre
    deleteSetting: async (key) => {
        const response = await api.delete(`/admin/parametres/${key}`)
        return response.data
    }
}
