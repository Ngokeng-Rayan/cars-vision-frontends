import api from '../lib/api'

export const dashboardService = {
    // Dashboard général (stats + recentOrders + recentAppointments)
    getStats: async () => {
        const response = await api.get('/admin/dashboard')
        return response.data
    },

    // Statistiques par période — FIX #4 : URL corrigée
    getStatsByPeriod: async (periode = 'mois') => {
        const response = await api.get('/admin/statistiques', {
            params: { periode }
        })
        return response.data
    },

    // Historique revenus mensuels pour les graphiques
    getRevenueHistory: async (mois = 6) => {
        const response = await api.get('/admin/dashboard/revenue-history', {
            params: { mois }
        })
        return response.data
    },

    // Commandes récentes
    getRecentOrders: async (limit = 5) => {
        const response = await api.get('/admin/commandes', {
            params: { page: 1, limite: limit }
        })
        return response.data
    },

    // Rendez-vous récents / du jour
    getRecentAppointments: async (limit = 5) => {
        const response = await api.get('/admin/rendezvous', {
            params: { page: 1, limite: limit }
        })
        return response.data
    },

    // Produits stock faible
    getLowStockProducts: async () => {
        const response = await api.get('/admin/produits/stock-faible')
        return response.data
    },

    // Avis en attente
    getPendingReviews: async () => {
        const response = await api.get('/admin/avis/en-attente', {
            params: { page: 1, limite: 10 }
        })
        return response.data
    }
}
