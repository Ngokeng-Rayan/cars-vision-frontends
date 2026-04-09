import api from '../lib/api'

export const orderService = {
    // Admin - Liste toutes les commandes
    getAllOrders: async (filters = {}) => {
        const response = await api.get('/admin/commandes', { params: filters })
        return response.data
    },

    // Admin - Détails commande
    getOrderDetails: async (id) => {
        const response = await api.get(`/admin/commandes/${id}`)
        return response.data
    },

    // Admin - Modifier statut commande
    updateOrderStatus: async (id, statut) => {
        const response = await api.put(`/admin/commandes/${id}/statut`, { statut })
        return response.data
    },

    // Admin - Modifier statut paiement
    updatePaymentStatus: async (id, statut_paiement) => {
        const response = await api.put(`/admin/commandes/${id}/paiement`, { statut_paiement })
        return response.data
    },

    // Client - Mes commandes
    getMyOrders: async () => {
        const response = await api.get('/orders')
        return response.data
    },

    // Client - Détails de ma commande
    getMyOrderDetails: async (id) => {
        const response = await api.get(`/orders/${id}`)
        return response.data
    },

    // Client - Créer une commande
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData)
        return response.data
    },

    // Client - Annuler une commande
    cancelOrder: async (id) => {
        const response = await api.put(`/orders/${id}/cancel`)
        return response.data
    },

    // Guest - Créer une commande sans compte
    createGuestOrder: async (orderData) => {
        const response = await api.post('/orders/guest', orderData)
        return response.data
    }
}
