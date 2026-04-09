import api from '../lib/api'

export const promotionService = {
    // Public - Liste promotions actives
    getActivePromotions: async () => {
        const response = await api.get('/admin/promotions/active')
        return response.data
    },

    // Admin - Liste toutes les promotions (alias)
    getAllPromotions: async () => {
        const response = await api.get('/admin/promotions/active')
        return response.data
    },

    // Admin - Créer promotion
    createPromotion: async (promotionData) => {
        const response = await api.post('/admin/promotions/create', promotionData)
        return response.data
    },

    // Admin - Modifier promotion
    updatePromotion: async (productId, promotionData) => {
        const response = await api.put(`/admin/promotions/${productId}`, promotionData)
        return response.data
    },

    // Admin - Désactiver promotion
    deactivatePromotion: async (productId) => {
        const response = await api.delete(`/admin/promotions/${productId}`)
        return response.data
    }
}
