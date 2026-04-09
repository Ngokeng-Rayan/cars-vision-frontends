import api from '../lib/api'

export const productService = {
    // Admin - Liste tous les produits
    getAllProducts: async (filters = {}) => {
        const response = await api.get('/admin/products', { params: filters })
        return response.data
    },

    // Admin - Créer un produit
    createProduct: async (productData) => {
        const response = await api.post('/admin/products', productData)
        return response.data
    },

    // Admin - Modifier un produit
    updateProduct: async (id, productData) => {
        const response = await api.put(`/admin/products/${id}`, productData)
        return response.data
    },

    // Admin - Mettre à jour le stock
    updateStock: async (id, stock) => {
        const response = await api.patch(`/admin/products/${id}/stock`, { stock })
        return response.data
    },

    // Admin - Désactiver un produit
    deactivateProduct: async (id) => {
        const response = await api.delete(`/admin/products/${id}`)
        return response.data
    },

    // Admin - Upload image (fichier)
    uploadImage: async (id, formData) => {
        const response = await api.post(`/admin/products/${id}/images/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    },

    // Admin - Supprimer image
    deleteImage: async (productId, imageId) => {
        const response = await api.delete(`/admin/products/${productId}/images/${imageId}`)
        return response.data
    },

    // Admin - Produits stock faible
    getLowStockProducts: async (threshold = 10) => {
        const response = await api.get('/admin/products/low-stock', {
            params: { seuil: threshold }
        })
        return response.data
    },

    // Public - Liste produits actifs
    getPublicProducts: async (filters = {}) => {
        const response = await api.get('/products', { params: filters })
        return response.data
    },

    // Public - Détails produit par slug
    getProductDetails: async (slug) => {
        const response = await api.get(`/products/${slug}`)
        return response.data
    },

    // Public - Détails produit par ID
    getById: async (id) => {
        const response = await api.get(`/products/${id}`)
        return response.data
    }
}
