import api from '../lib/api'

export const zoneService = {
    // Public - Liste des zones de livraison
    getZones: async () => {
        const response = await api.get('/zones')
        return response.data
    },

    // Admin - Liste des zones
    getAdminZones: async () => {
        const response = await api.get('/admin/zones')
        return response.data
    },

    // Admin - Liste des zones (alias pour compatibilité)
    getAllZones: async () => {
        const response = await api.get('/admin/zones')
        return response.data
    },

    // Admin - Créer une zone
    createZone: async (zoneData) => {
        const response = await api.post('/admin/zones', zoneData)
        return response.data
    },

    // Admin - Modifier une zone
    updateZone: async (id, zoneData) => {
        const response = await api.put(`/admin/zones/${id}`, zoneData)
        return response.data
    },

    // Admin - Supprimer une zone
    deleteZone: async (id) => {
        const response = await api.delete(`/admin/zones/${id}`)
        return response.data
    }
}
