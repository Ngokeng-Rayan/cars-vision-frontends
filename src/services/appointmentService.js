import api from '../lib/api'

export const appointmentService = {
    // Public - Liste des services
    getServices: async () => {
        const response = await api.get('/services')
        return response.data
    },

    // Public - Créneaux disponibles
    getAvailableSlots: async (date, serviceId, site) => {
        const response = await api.get('/appointments/slots', {
            params: { date, service_id: serviceId, site }
        })
        return response.data
    },

    // Client - Créer un rendez-vous
    createAppointment: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData)
        return response.data
    },

    // Client - Mes rendez-vous
    getMyAppointments: async () => {
        const response = await api.get('/appointments/my')
        return response.data
    },

    // Client - Annuler un rendez-vous
    cancelAppointment: async (id) => {
        const response = await api.put(`/appointments/${id}/cancel`)
        return response.data
    },

    // Admin - Liste tous les rendez-vous (admin routes are in same router)
    getAllAppointments: async (filters = {}) => {
        const response = await api.get('/appointments', { params: filters })
        return response.data
    },

    // Admin - Changer le statut d'un rendez-vous
    updateAppointmentStatus: async (id, statut) => {
        const response = await api.put(`/appointments/${id}`, { statut })
        return response.data
    },

    // Admin - Supprimer un rendez-vous
    deleteAppointment: async (id) => {
        const response = await api.delete(`/appointments/${id}`)
        return response.data
    },

    // Admin - CRUD Services
    createService: async (serviceData) => {
        const response = await api.post('/admin/services', serviceData)
        return response.data
    },

    updateService: async (id, serviceData) => {
        const response = await api.put(`/admin/services/${id}`, serviceData)
        return response.data
    },

    deleteService: async (id) => {
        const response = await api.delete(`/admin/services/${id}`)
        return response.data
    },

    getAdminServices: async () => {
        const response = await api.get('/admin/services')
        return response.data
    }
}
