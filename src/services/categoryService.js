import api from '../lib/api'

export const categoryService = {
    // Public - Liste catégories actives
    getCategories: async () => {
        const response = await api.get('/categories')
        return response.data
    },

    // Admin - Liste toutes les catégories (utilise la route publique car admin/categories n'a pas de GET /)
    getAllCategories: async () => {
        const response = await api.get('/categories')
        return response.data
    },

    // Admin - Créer catégorie
    createCategory: async (categoryData) => {
        const response = await api.post('/admin/categories', categoryData)
        return response.data
    },

    // Admin - Modifier catégorie
    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/admin/categories/${id}`, categoryData)
        return response.data
    },

    // Admin - Supprimer catégorie
    deleteCategory: async (id) => {
        const response = await api.delete(`/admin/categories/${id}`)
        return response.data
    }
}
