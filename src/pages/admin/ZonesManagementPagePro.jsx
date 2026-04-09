import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, MapPin, Truck, Clock, DollarSign
} from 'lucide-react'
import { zoneService } from '../../services/zoneService'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const ZonesManagementPagePro = () => {
    const [zones, setZones] = useState([])
    const [filteredZones, setFilteredZones] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingZone, setEditingZone] = useState(null)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        frais_min: '',
        frais_max: '',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        frais_livraison: '',
        delai_livraison_jours: '',
        est_actif: true
    })

    useEffect(() => {
        loadZones()
    }, [])

    useEffect(() => {
        filterZones()
    }, [zones, filters])

    const loadZones = async () => {
        try {
            setLoading(true)
            const response = await zoneService.getAllZones()
            setZones(response.zones || response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des zones')
        } finally {
            setLoading(false)
        }
    }

    const filterZones = () => {
        let filtered = [...zones]

        if (filters.search) {
            filtered = filtered.filter(z =>
                z.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                z.description?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(z =>
                filters.statut === 'actif' ? z.est_actif : !z.est_actif
            )
        }

        if (filters.frais_min) {
            filtered = filtered.filter(z => z.frais_livraison >= parseFloat(filters.frais_min))
        }
        if (filters.frais_max) {
            filtered = filtered.filter(z => z.frais_livraison <= parseFloat(filters.frais_max))
        }

        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.nom.localeCompare(b.nom))
                break
            case 'frais_asc':
                filtered.sort((a, b) => a.frais_livraison - b.frais_livraison)
                break
            case 'frais_desc':
                filtered.sort((a, b) => b.frais_livraison - a.frais_livraison)
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredZones(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingZone) {
                await zoneService.updateZone(editingZone.id, formData)
                toast.success('Zone modifiée avec succès')
            } else {
                await zoneService.createZone(formData)
                toast.success('Zone créée avec succès')
            }
            setShowModal(false)
            resetForm()
            loadZones()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette zone?')) return
        try {
            await zoneService.deleteZone(id)
            toast.success('Zone supprimée')
            loadZones()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingZone(null)
        setFormData({
            nom: '',
            description: '',
            frais_livraison: '',
            delai_livraison_jours: '',
            est_actif: true
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            frais_min: '',
            frais_max: '',
            sortBy: 'recent'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price || 0)
    }

    const stats = {
        total: zones.length,
        actives: zones.filter(z => z.est_actif).length,
        inactives: zones.filter(z => !z.est_actif).length,
        frais_moyen: zones.length > 0
            ? zones.reduce((sum, z) => sum + z.frais_livraison, 0) / zones.length
            : 0
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Zones de Livraison</h1>
                    <p className="text-gray-600">Gérez les zones de livraison depuis Bonamoussadi</p>
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
                    Nouvelle zone
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">Total zones</p>
                            <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <MapPin className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Actives</p>
                            <p className="text-3xl font-bold text-green-900">{stats.actives}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Truck className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Inactives</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.inactives}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <MapPin className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-teal-600 mb-1">Frais moyen</p>
                            <p className="text-2xl font-bold text-teal-900">{formatPrice(stats.frais_moyen)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <DollarSign className="h-8 w-8 text-teal-600" />
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
                            { value: 'all', label: 'Toutes' },
                            { value: 'actif', label: 'Actives' },
                            { value: 'inactif', label: 'Inactives' }
                        ]}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récentes' },
                            { value: 'name', label: 'Nom A-Z' },
                            { value: 'frais_asc', label: 'Frais croissants' },
                            { value: 'frais_desc', label: 'Frais décroissants' }
                        ]}
                    />

                    <Input
                        type="number"
                        placeholder="Frais min (FCFA)"
                        value={filters.frais_min}
                        onChange={(e) => setFilters({ ...filters, frais_min: e.target.value })}
                    />

                    <Input
                        type="number"
                        placeholder="Frais max (FCFA)"
                        value={filters.frais_max}
                        onChange={(e) => setFilters({ ...filters, frais_max: e.target.value })}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.frais_min || filters.frais_max || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Zones Grid */}
            {filteredZones.length === 0 ? (
                <EmptyState
                    icon={MapPin}
                    title="Aucune zone trouvée"
                    description={filters.search || filters.statut !== 'all' ? "Aucune zone ne correspond à vos critères" : "Commencez par ajouter votre première zone"}
                    actionLabel={!filters.search && filters.statut === 'all' ? "Ajouter une zone" : undefined}
                    onAction={!filters.search && filters.statut === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredZones.map((zone) => (
                        <div
                            key={zone.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="h-5 w-5 text-indigo-600" />
                                            <h3 className="font-bold text-gray-900 text-lg">{zone.nom}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{zone.description}</p>
                                    </div>
                                    <Badge variant={zone.est_actif ? 'success' : 'default'} size="sm">
                                        {zone.est_actif ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="text-sm">Frais de livraison</span>
                                        </div>
                                        <span className="text-lg font-bold text-[#4DB896]">
                                            {formatPrice(zone.frais_livraison)} FCFA
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-sm">Délai</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            {zone.delai_livraison_jours} jour{zone.delai_livraison_jours > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Edit2}
                                        onClick={() => {
                                            setEditingZone(zone)
                                            setFormData({
                                                nom: zone.nom,
                                                description: zone.description || '',
                                                frais_livraison: zone.frais_livraison,
                                                delai_livraison_jours: zone.delai_livraison_jours,
                                                est_actif: zone.est_actif
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
                                        onClick={() => handleDelete(zone.id)}
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
                title={editingZone ? 'Modifier la zone' : 'Nouvelle zone'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nom de la zone"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Ex: Douala Centre"
                    />

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Décrivez la zone..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Frais de livraison (FCFA)"
                            type="number"
                            required
                            min="0"
                            value={formData.frais_livraison}
                            onChange={(e) => setFormData({ ...formData, frais_livraison: e.target.value })}
                            placeholder="2000"
                        />

                        <Input
                            label="Délai (jours)"
                            type="number"
                            required
                            min="1"
                            value={formData.delai_livraison_jours}
                            onChange={(e) => setFormData({ ...formData, delai_livraison_jours: e.target.value })}
                            placeholder="1"
                        />
                    </div>

                    <Switch
                        label="Zone active"
                        description="La zone sera disponible pour les livraisons"
                        checked={formData.est_actif}
                        onChange={(checked) => setFormData({ ...formData, est_actif: checked })}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingZone ? 'Modifier' : 'Créer'}
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

export default ZonesManagementPagePro
