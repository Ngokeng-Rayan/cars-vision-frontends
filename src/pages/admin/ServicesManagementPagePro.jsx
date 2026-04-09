import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, Wrench, TrendingUp, Upload, Image
} from 'lucide-react'
import { serviceService } from '../../services/serviceService'
import { getImageUrl } from '../../utils/imageUrl'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const ServicesManagementPagePro = () => {
    const [services, setServices] = useState([])
    const [filteredServices, setFilteredServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        est_actif: true
    })

    useEffect(() => {
        loadServices()
    }, [])

    useEffect(() => {
        filterServices()
    }, [services, filters])

    const loadServices = async () => {
        try {
            setLoading(true)
            const response = await serviceService.getAllAdmin()
            setServices(response.services || response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des services')
        } finally {
            setLoading(false)
        }
    }

    const filterServices = () => {
        let filtered = [...services]

        if (filters.search) {
            filtered = filtered.filter(s =>
                s.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                s.description?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(s =>
                filters.statut === 'actif' ? s.est_actif : !s.est_actif
            )
        }

        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.nom.localeCompare(b.nom))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredServices(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setUploading(true)
            let serviceId
            if (editingService) {
                await serviceService.update(editingService.id, formData)
                serviceId = editingService.id
                toast.success('Service modifié avec succès')
            } else {
                const result = await serviceService.create(formData)
                serviceId = result.service?.id
                toast.success('Service créé avec succès')
            }
            if (serviceId && imageFile) {
                await serviceService.uploadImage(serviceId, imageFile)
            }
            setShowModal(false)
            resetForm()
            loadServices()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce service?')) return
        try {
            await serviceService.delete(id)
            toast.success('Service supprimé')
            loadServices()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingService(null)
        setImageFile(null)
        setFormData({
            nom: '',
            description: '',
            est_actif: true
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            sortBy: 'recent'
        })
    }

    const stats = {
        total: services.length,
        actifs: services.filter(s => s.est_actif).length,
        inactifs: services.filter(s => !s.est_actif).length
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Services</h1>
                    <p className="text-gray-600">Gérez les services du garage Ndokoti</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    icon={Plus}
                    onClick={() => {
                        resetForm()
                        setShowModal(true)
                    }}
                >
                    Nouveau service
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-cyan-600 mb-1">Total services</p>
                            <p className="text-3xl font-bold text-cyan-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Wrench className="h-8 w-8 text-cyan-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Actifs</p>
                            <p className="text-3xl font-bold text-green-900">{stats.actifs}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <TrendingUp className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Inactifs</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.inactifs}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Wrench className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            icon={Search}
                            placeholder="Rechercher par nom, description..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        placeholder="Statut"
                        value={filters.statut}
                        onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'actif', label: 'Actifs' },
                            { value: 'inactif', label: 'Inactifs' }
                        ]}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récents' },
                            { value: 'name', label: 'Nom A-Z' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <EmptyState
                    icon={Wrench}
                    title="Aucun service trouvé"
                    description={filters.search || filters.statut !== 'all' ? "Aucun service ne correspond à vos critères" : "Commencez par ajouter votre premier service"}
                    actionLabel={!filters.search && filters.statut === 'all' ? "Ajouter un service" : undefined}
                    onAction={!filters.search && filters.statut === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Service Image */}
                            <div className="h-36 bg-gray-100 overflow-hidden">
                                {service.image ? (
                                    <img src={getImageUrl(service.image)} alt={service.nom} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <Image className="h-10 w-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{service.nom}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                                    </div>
                                    <Badge variant={service.est_actif ? 'success' : 'default'} size="sm">
                                        {service.est_actif ? 'Actif' : 'Inactif'}
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Edit2}
                                        onClick={() => {
                                            setEditingService(service)
                                            setFormData({
                                                nom: service.nom,
                                                description: service.description || '',
                                                est_actif: service.est_actif
                                            })
                                            setShowModal(true)
                                        }}
                                        className="flex-1"
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={Trash2}
                                        onClick={() => handleDelete(service.id)}
                                        className="text-red-600 hover:bg-red-50"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingService ? 'Modifier le service' : 'Nouveau service'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nom du service"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Ex: Vidange complète"
                    />

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="Décrivez le service..."
                    />

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image du service</label>
                        {editingService?.image && !imageFile && (
                            <div className="mb-3 rounded-lg overflow-hidden h-32 bg-gray-100">
                                <img src={getImageUrl(editingService.image)} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        {imageFile && (
                            <div className="mb-3 rounded-lg overflow-hidden h-32 bg-gray-100">
                                <img src={URL.createObjectURL(imageFile)} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <Upload className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{imageFile ? imageFile.name : 'Choisir une image'}</span>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => setImageFile(e.target.files[0] || null)}
                            />
                        </label>
                    </div>

                    <Switch
                        label="Service actif"
                        description="Le service sera visible pour les clients"
                        checked={formData.est_actif}
                        onChange={(checked) => setFormData({ ...formData, est_actif: checked })}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
                            {uploading ? 'Enregistrement...' : (editingService ? 'Modifier' : 'Créer')}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => { setShowModal(false); resetForm() }}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ServicesManagementPagePro
