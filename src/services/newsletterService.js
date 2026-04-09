import api from '../lib/api'

export const newsletterService = {
    // Public - S'abonner
    subscribe: async (email) => {
        const response = await api.post('/newsletter/subscribe', { email })
        return response.data
    },

    // Public - Se désabonner
    unsubscribe: async (email) => {
        const response = await api.post('/newsletter/unsubscribe', { email })
        return response.data
    },

    // Admin - Liste abonnés
    getSubscribers: async () => {
        const response = await api.get('/newsletter/admin/subscribers')
        return response.data
    },

    // Admin - Liste abonnés (alias pour compatibilité)
    getAllSubscribers: async () => {
        const response = await api.get('/newsletter/admin/subscribers')
        return response.data
    },

    // Admin - Envoyer newsletter
    sendNewsletter: async (newsletterData) => {
        const response = await api.post('/newsletter/admin/send', newsletterData)
        return response.data
    }
}
