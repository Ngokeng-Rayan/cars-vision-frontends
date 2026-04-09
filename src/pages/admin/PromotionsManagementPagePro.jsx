import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, Tag, TrendingDown, Calendar, Percent
} from 'lucide-react'
import { promotionService } from '../../services/promotionService'
import { productService } from '../../services/productService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const PromotionsManagementPagePro = () => {
    const [promotions, setPromotions] = useState([])
    const [products, setProducts] = useState([])
    const [filteredPromotions, setFilteredPromotions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPromotion, setEditingPromotion] = useState(null)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        reduction_min: '',
        reduction_max: '',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        produit_id: '',
        reduction_pourcentage: '',
        date_debut_promotion: '',
        date_fin_promotion: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterPromotions()
    }, [promotions, filters])

    const loadData = async () => {
        try {
            setLoading(true)
            const [promoData, productsData] = await Promise.all([
                promotionService.getAllPromotions(),
                productService.getAllProducts()
            ])
            setPromotions(promoData.data || promoData)
            setProducts(productsData.produits || productsData)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const filterPromotions = () => {
        let filtered = [...promotions]

        if (filters.search) {
            filtered = filtered.filter(p =>
                p.nom?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            const now = new Date()
            filtered = filtered.filter(p => {
                const debut = new Date(p.date_debut_promotion)
                const fin = new Date(p.date_fin_promotion)

                switch (filters.statut) {
                    case 'actif':
                        return p.en_promotion && debut <= now && fin >= now
                    case 'expire':
                        return fin < now
                    case 'a_venir':
                        return debut > now
                    default:
                        return true
                }
            })
        }

        if (filters.reduction_min) {
            filtered = filtered.filter(p => p.reduction_pourcentage >= parseFloat(filters.reduction_min))
        }
        if (filters.reduction_max) {
            filtered = filtered.filter(p => p.reduction_pourcentage <= parseFloat(filters.reduction_max))
        }

        if (filters.date_debut) {
            filtered = filtered.filter(p => new Date(p.date_debut_promotion) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(p => new Date(p.date_fin_promotion) <= new Date(filters.date_fin))
        }

        switch (filters.sortBy) {
            case 'reduction_asc':
                filtered.sort((a, b) => a.reduction_pourcentage - b.reduction_pourcentage)
                break
            case 'reduction_desc':
                filtered.sort((a, b) => b.reduction_pourcentage - a.reduction_pourcentage)
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.date_debut_promotion) - new Date(a.date_debut_promotion))
        }

        setFilteredPromotions(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingPromotion) {
                await promotionService.updatePromotion(editingPromotion.id, formData)
                toast.success('Promotion modifiée avec succès')
            } else {
                await promotionService.createPromotion(formData)
                toast.success('Promotion créée avec succès')
            }
            setShowModal(false)
            resetForm()
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Désactiver cette promotion?')) return
        try {
            await promotionService.deactivatePromotion(id)
            toast.success('Promotion désactivée')
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingPromotion(null)
        setFormData({
            produit_id: '',
            reduction_pourcentage: '',
            date_debut_promotion: '',
            date_fin_promotion: ''
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            reduction_min: '',
            reduction_max: '',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price || 0)
    }

    const getPromotionStatus = (promo) => {
        const now = new Date()
        const debut = new Date(promo.date_debut_promotion)
        const fin = new Date(promo.date_fin_promotion)

        if (fin < now) return { label: 'Expirée', variant: 'error' }
        if (debut > now) return { label: 'À venir', variant: 'warning' }
        if (promo.en_promotion) return { label: 'Active', variant: 'success' }
        return { label: 'Inactive', variant: 'default' }
    }

    const stats = {
        total: promotions.length,
        actives: promotions.filter(p => {
            const now = new Date()
            return p.en_promotion &&
                new Date(p.date_debut_promotion) <= now &&
                new Date(p.date_fin_promotion) >= now
        }).length,
        expirees: promotions.filter(p => new Date(p.date_fin_promotion) < new Date()).length,
        reduction_moyenne: promotions.length > 0
            ? promotions.reduce((sum, p) => sum + p.reduction_pourcentage, 0) / promotions.length
            : 0
    }

    const columns = [
        {
            header: 'Produit',
            field: 'nom',
            sortable: true,
            render: (item) => (
                <div>
                    <p className="font-semibold text-gray-900">{item.nom}</p>
                    <p className="text-xs text-gray-500">{item.reference || 'N/A'}</p>
                </div>
            )
        },
        {
            header: 'Réduction',
            field: 'reduction_pourcentage',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Badge variant="error" size="lg">
                        -{item.reduction_pourcentage}%
                    </Badge>
                </div>
            )
        },
        {
            header: 'Prix',
            render: (item) => (
                <div>
                    <p className="text-sm text-gray-500 line-through">{formatPrice(item.prix)} FCFA</p>
                    <p className="font-bold text-[#4DB896]">{formatPrice(item.prix_promotion)} FCFA</p>
                </div>
            )
        },
        {
            header: 'Période',
            render: (item) => (
                <div className="text-xs text-gray-600">
                    <p>Du {new Date(item.date_debut_promotion).toLocaleDateString('fr-FR')}</p>
                    <p>Au {new Date(item.date_fin_promotion).toLocaleDateString('fr-FR')}</p>
                </div>
            )
        },
        {
            header: 'Statut',
            render: (item) => {
                const status = getPromotionStatus(item)
                return <Badge variant={status.variant} size="sm">{status.label}</Badge>
            }
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => {
                            setEditingPromotion(item)
                            setFormData({
                                produit_id: item.id,
                                reduction_pourcentage: item.reduction_pourcentage,
                                date_debut_promotion: item.date_debut_promotion?.split('T')[0] || '',
                                date_fin_promotion: item.date_fin_promotion?.split('T')[0] || ''
                            })
                            setShowModal(true)
                        }}
                        title="Modifier"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:bg-red-50"
                        title="Désactiver"
                    />
                </div>
            )
        }
    ]

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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Promotions</h1>
                    <p className="text-gray-600">Créez et gérez les promotions sur vos produits</p>
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
                    Nouvelle promotion
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-red-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Tag className="h-8 w-8 text-red-600" />
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
                            <TrendingDown className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Expirées</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.expirees}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Calendar className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Réduction moy.</p>
                            <p className="text-3xl font-bold text-orange-900">{stats.reduction_moyenne.toFixed(0)}%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Percent className="h-8 w-8 text-orange-600" />
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
                            placeholder="Rechercher par nom de produit..."
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
                            { value: 'expire', label: 'Expirées' },
                            { value: 'a_venir', label: 'À venir' }
                        ]}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récentes' },
                            { value: 'reduction_asc', label: 'Réduction croissante' },
                            { value: 'reduction_desc', label: 'Réduction décroissante' }
                        ]}
                    />

                    <Input
                        type="number"
                        placeholder="Réduction min (%)"
                        value={filters.reduction_min}
                        onChange={(e) => setFilters({ ...filters, reduction_min: e.target.value })}
                    />

                    <Input
                        type="number"
                        placeholder="Réduction max (%)"
                        value={filters.reduction_max}
                        onChange={(e) => setFilters({ ...filters, reduction_max: e.target.value })}
                    />

                    <Input
                        type="date"
                        label="Date début"
                        value={filters.date_debut}
                        onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                    />

                    <Input
                        type="date"
                        label="Date fin"
                        value={filters.date_fin}
                        onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.reduction_min || filters.reduction_max || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Promotions Table */}
            {filteredPromotions.length === 0 ? (
                <EmptyState
                    icon={Tag}
                    title="Aucune promotion trouvée"
                    description={filters.search || filters.statut !== 'all' ? "Aucune promotion ne correspond à vos critères" : "Commencez par créer votre première promotion"}
                    actionLabel={!filters.search && filters.statut === 'all' ? "Créer une promotion" : undefined}
                    onAction={!filters.search && filters.statut === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredPromotions}
                    loading={loading}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select
                        label="Produit"
                        required
                        value={formData.produit_id}
                        onChange={(e) => setFormData({ ...formData, produit_id: e.target.value })}
                        options={products.map(p => ({ value: p.id, label: `${p.nom} - ${formatPrice(p.prix)} FCFA` }))}
                    />

                    <Input
                        label="Réduction (%)"
                        type="number"
                        required
                        min="1"
                        max="99"
                        value={formData.reduction_pourcentage}
                        onChange={(e) => setFormData({ ...formData, reduction_pourcentage: e.target.value })}
                        placeholder="20"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Date début"
                            type="date"
                            required
                            value={formData.date_debut_promotion}
                            onChange={(e) => setFormData({ ...formData, date_debut_promotion: e.target.value })}
                        />

                        <Input
                            label="Date fin"
                            type="date"
                            required
                            value={formData.date_fin_promotion}
                            onChange={(e) => setFormData({ ...formData, date_fin_promotion: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingPromotion ? 'Modifier' : 'Créer'}
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

export default PromotionsManagementPagePro
