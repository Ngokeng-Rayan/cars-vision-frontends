import api from '../lib/api'

export const reviewService = {
    // Public - Avis d'un produit
    getProductReviews: async (productId, params = {}) => {
        const response = await api.get(`/reviews/${productId}/reviews`, { params })
        return response.data
    },

    // Public - Résumé avis produit
    getProductReviewSummary: async (productId) => {
        const response = await api.get(`/reviews/${productId}/reviews/summary`)
        return response.data
    },

    // Client - Créer avis
    createReview: async (productId, reviewData) => {
        const response = await api.post(`/reviews/${productId}/reviews`, reviewData)
        return response.data
    },

    // Client - Modifier mon avis
    updateReview: async (reviewId, reviewData) => {
        const response = await api.put(`/reviews/reviews/${reviewId}`, reviewData)
        return response.data
    },

    // Client - Supprimer mon avis
    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/reviews/${reviewId}`)
        return response.data
    },

    // Admin - Liste tous les avis (= avis en attente de modération)
    getAllReviews: async (params = {}) => {
        const response = await api.get('/reviews/admin/reviews/pending', { params })
        return response.data
    },

    // Admin - Avis en attente
    getPendingReviews: async (params = {}) => {
        const response = await api.get('/reviews/admin/reviews/pending', { params })
        return response.data
    },

    // Admin - Modérer avis
    moderateReview: async (reviewId, statut) => {
        const response = await api.put(`/reviews/admin/reviews/${reviewId}/moderate`, { statut })
        return response.data
    }
}
