import api from '../lib/api'

export const serviceService = {
    getAll: async () => {
        const response = await api.get('/services')
        return response.data
    },

    // Admin
    getAllAdmin: async () => {
        const response = await api.get('/admin/services')
        return response.data
    },

    create: async (serviceData) => {
        const response = await api.post('/admin/services', serviceData)
        return response.data
    },

    update: async (id, serviceData) => {
        const response = await api.put(`/admin/services/${id}`, serviceData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/services/${id}`)
        return response.data
    },

    uploadImage: async (id, file) => {
        const formData = new FormData()
        formData.append('image', file)
        const response = await api.post(`/admin/services/${id}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    }
}
