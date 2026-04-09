import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, Eye, Download, Printer,
    ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, Package
} from 'lucide-react'
import { orderService } from '../../services/orderService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const OrdersManagementPagePro = () => {
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const toast = useToast()

    // Filtres
    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        statut_paiement: 'all',
        date_debut: '',
        date_fin: '',
        montant_min: '',
        montant_max: '',
        sortBy: 'recent'
    })

    useEffect(() => {
        loadOrders()
    }, [])

    useEffect(() => {
        filterOrders()
    }, [orders, filters])

    const loadOrders = async () => {
        try {
            setLoading(true)
            const response = await orderService.getAllOrders()
            setOrders(response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des commandes')
        } finally {
            setLoading(false)
        }
    }

    const filterOrders = () => {
        let filtered = [...orders]

        // Recherche
        if (filters.search) {
            const s = filters.search.toLowerCase()
            filtered = filtered.filter(o =>
                o.numero_commande?.toLowerCase().includes(s) ||
                o.utilisateur?.nom?.toLowerCase().includes(s) ||
                o.utilisateur?.email?.toLowerCase().includes(s) ||
                o.nom_invite?.toLowerCase().includes(s) ||
                o.email_invite?.toLowerCase().includes(s)
            )
        }

        // Statut commande
        if (filters.statut !== 'all') {
            filtered = filtered.filter(o => o.statut === filters.statut)
        }

        // Statut paiement
        if (filters.statut_paiement !== 'all') {
            filtered = filtered.filter(o => o.statut_paiement === filters.statut_paiement)
        }

        // Date
        if (filters.date_debut) {
            filtered = filtered.filter(o => new Date(o.cree_le) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(o => new Date(o.cree_le) <= new Date(filters.date_fin))
        }

        // Montant
        if (filters.montant_min) {
            filtered = filtered.filter(o => o.total >= parseFloat(filters.montant_min))
        }
        if (filters.montant_max) {
            filtered = filtered.filter(o => o.total <= parseFloat(filters.montant_max))
        }

        // Tri
        switch (filters.sortBy) {
            case 'montant_asc':
                filtered.sort((a, b) => a.total - b.total)
                break
            case 'montant_desc':
                filtered.sort((a, b) => b.total - a.total)
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredOrders(filtered)
    }

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await orderService.updateOrderStatus(orderId, newStatus)
            // Optimistic update: update local state immediately
            setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                    const updated = { ...o, statut: newStatus }
                    // Auto-update payment status if backend did it
                    if (response?.data?.statut_paiement) {
                        updated.statut_paiement = response.data.statut_paiement
                    } else if (newStatus === 'LIVREE') {
                        updated.statut_paiement = 'PAID'
                    }
                    return updated
                }
                return o
            }))
            toast.success('Statut modifié avec succès')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
            loadOrders()
        }
    }

    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updatePaymentStatus(orderId, newStatus)
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, statut_paiement: newStatus } : o
            ))
            toast.success('Statut de paiement modifié')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
            loadOrders()
        }
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            statut_paiement: 'all',
            date_debut: '',
            date_fin: '',
            montant_min: '',
            montant_max: '',
            sortBy: 'recent'
        })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price || 0)
    }

    const getAvailableStatuses = (currentStatut) => {
        const allStatuses = [
            { value: 'EN_ATTENTE', label: 'En attente', level: 0 },
            { value: 'CONFIRMEE', label: 'Confirmée', level: 1 },
            { value: 'EXPEDIEE', label: 'Expédiée', level: 2 },
            { value: 'LIVREE', label: 'Livrée', level: 3 },
            { value: 'ANNULEE', label: 'Annulée', level: 4 }
        ]
        const currentLevel = allStatuses.find(s => s.value === currentStatut)?.level ?? 0
        return allStatuses
            .filter(s => s.level >= currentLevel || s.value === 'ANNULEE')
            .map(({ value, label }) => ({ value, label }))
    }

    const getStatusBadge = (statut) => {
        const variants = {
            'EN_ATTENTE': 'warning',
            'CONFIRMEE': 'info',
            'EXPEDIEE': 'primary',
            'LIVREE': 'success',
            'ANNULEE': 'error'
        }
        return <Badge variant={variants[statut] || 'default'} size="sm">{statut}</Badge>
    }

    const getPaymentBadge = (statut) => {
        const variants = {
            'PENDING': 'warning',
            'PAID': 'success',
            'FAILED': 'error'
        }
        return <Badge variant={variants[statut] || 'default'} size="sm">{statut}</Badge>
    }

    const stats = {
        total: orders.length,
        en_attente: orders.filter(o => o.statut === 'EN_ATTENTE').length,
        confirmees: orders.filter(o => o.statut === 'CONFIRMEE').length,
        livrees: orders.filter(o => o.statut === 'LIVREE').length,
        ca_total: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    }

    const columns = [
        {
            header: 'Numéro',
            field: 'numero_commande',
            sortable: true,
            render: (item) => (
                <div>
                    <p className="font-semibold text-gray-900">#{item.numero_commande}</p>
                    <p className="text-xs text-gray-500">
                        {new Date(item.cree_le).toLocaleDateString('fr-FR')}
                    </p>
                </div>
            )
        },
        {
            header: 'Client',
            render: (item) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {item.utilisateur
                            ? `${item.utilisateur.prenom || ''} ${item.utilisateur.nom || ''}`.trim()
                            : item.nom_invite || 'Invité'
                        }
                    </p>
                    <p className="text-xs text-gray-500">
                        {item.utilisateur?.email || item.email_invite || ''}
                    </p>
                    {!item.utilisateur && item.nom_invite && (
                        <span className="inline-block mt-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Invité</span>
                    )}
                </div>
            )
        },
        {
            header: 'Montant',
            field: 'total',
            sortable: true,
            render: (item) => (
                <p className="font-bold text-[#4DB896]">{formatPrice(item.total)} FCFA</p>
            )
        },
        {
            header: 'Statut',
            field: 'statut',
            render: (item) => getStatusBadge(item.statut)
        },
        {
            header: 'Paiement',
            field: 'statut_paiement',
            render: (item) => getPaymentBadge(item.statut_paiement)
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                            setSelectedOrder(item)
                            setShowDetailsModal(true)
                        }}
                        title="Détails"
                    />
                    <Select
                        value={item.statut}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        options={getAvailableStatuses(item.statut)}
                        className="text-sm"
                        disabled={item.statut === 'LIVREE' || item.statut === 'ANNULEE'}
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Commandes</h1>
                    <p className="text-gray-600">Gérez toutes les commandes de la boutique</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <ShoppingCart className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 mb-1">En attente</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.en_attente}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Confirmées</p>
                            <p className="text-3xl font-bold text-purple-900">{stats.confirmees}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Livrées</p>
                            <p className="text-3xl font-bold text-green-900">{stats.livrees}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Package className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-teal-600 mb-1">CA Total</p>
                            <p className="text-2xl font-bold text-teal-900">{formatPrice(stats.ca_total)}</p>
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
                            placeholder="Rechercher par numéro, client, email..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        placeholder="Statut commande"
                        value={filters.statut}
                        onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'EN_ATTENTE', label: 'En attente' },
                            { value: 'CONFIRMEE', label: 'Confirmée' },
                            { value: 'EXPEDIEE', label: 'Expédiée' },
                            { value: 'LIVREE', label: 'Livrée' },
                            { value: 'ANNULEE', label: 'Annulée' }
                        ]}
                    />

                    <Select
                        placeholder="Statut paiement"
                        value={filters.statut_paiement}
                        onChange={(e) => setFilters({ ...filters, statut_paiement: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'PENDING', label: 'En attente' },
                            { value: 'PAID', label: 'Payé' },
                            { value: 'FAILED', label: 'Échoué' }
                        ]}
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

                    <Input
                        type="number"
                        placeholder="Montant min (FCFA)"
                        value={filters.montant_min}
                        onChange={(e) => setFilters({ ...filters, montant_min: e.target.value })}
                    />

                    <Input
                        type="number"
                        placeholder="Montant max (FCFA)"
                        value={filters.montant_max}
                        onChange={(e) => setFilters({ ...filters, montant_max: e.target.value })}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récentes' },
                            { value: 'montant_asc', label: 'Montant croissant' },
                            { value: 'montant_desc', label: 'Montant décroissant' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.statut_paiement !== 'all' || filters.date_debut || filters.date_fin || filters.montant_min || filters.montant_max || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <EmptyState
                    icon={ShoppingCart}
                    title="Aucune commande trouvée"
                    description={filters.search || filters.statut !== 'all' ? "Aucune commande ne correspond à vos critères" : "Aucune commande pour le moment"}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredOrders}
                    loading={loading}
                />
            )}

            {/* Details Modal */}
            {selectedOrder && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={`Commande #${selectedOrder.numero_commande}`}
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Client Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Client</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                {selectedOrder.utilisateur ? (
                                    <>
                                        <p className="font-medium">{selectedOrder.utilisateur.prenom} {selectedOrder.utilisateur.nom}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.utilisateur.email}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.utilisateur.telephone}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium">{selectedOrder.nom_invite || 'Invité'}</p>
                                            <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Invité</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{selectedOrder.email_invite}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.telephone_invite || selectedOrder.telephone_livraison}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Statut:</span>
                                    {getStatusBadge(selectedOrder.statut)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Paiement:</span>
                                    {getPaymentBadge(selectedOrder.statut_paiement)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Date:</span>
                                    <span className="text-sm font-medium">{new Date(selectedOrder.cree_le).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Montant:</span>
                                    <span className="text-lg font-bold text-[#4DB896]">{formatPrice(selectedOrder.total)} FCFA</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button variant="outline" icon={Printer} className="flex-1">
                                Imprimer
                            </Button>
                            <Button variant="outline" icon={Download} className="flex-1">
                                Télécharger PDF
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default OrdersManagementPagePro
