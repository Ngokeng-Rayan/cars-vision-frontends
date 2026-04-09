import api from '../lib/api'

export const blogService = {
    // Public - Liste articles publiés
    getPublishedArticles: async (params = {}) => {
        const response = await api.get('/blog', { params })
        return response.data
    },

    // Public - Détails article
    getArticle: async (slug) => {
        const response = await api.get(`/blog/${slug}`)
        return response.data
    },

    // Admin - Liste tous les articles (publiés + brouillons)
    getAllArticles: async (params = {}) => {
        const response = await api.get('/blog/admin/all', { params })
        return response.data
    },

    // Admin - Liste brouillons
    getDrafts: async (params = {}) => {
        const response = await api.get('/blog/admin/brouillons', { params })
        return response.data
    },

    // Admin - Créer article (supports FormData for image upload)
    createArticle: async (articleData) => {
        const isFormData = articleData instanceof FormData
        const response = await api.post('/blog/admin/create', articleData, isFormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {})
        return response.data
    },

    // Admin - Modifier article (supports FormData for image upload)
    updateArticle: async (id, articleData) => {
        const isFormData = articleData instanceof FormData
        const response = await api.put(`/blog/admin/${id}`, articleData, isFormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {})
        return response.data
    },

    // Admin - Publier article
    publishArticle: async (id) => {
        const response = await api.put(`/blog/admin/${id}/publier`)
        return response.data
    },

    // Admin - Dépublier article
    unpublishArticle: async (id) => {
        const response = await api.put(`/blog/admin/${id}/depublier`)
        return response.data
    },

    // Admin - Supprimer article
    deleteArticle: async (id) => {
        const response = await api.delete(`/blog/admin/${id}`)
        return response.data
    },

    // Admin - Statistiques SEO
    getSEOStats: async () => {
        const response = await api.get('/blog/admin/stats')
        return response.data
    }
}
