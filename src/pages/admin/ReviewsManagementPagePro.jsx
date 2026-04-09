import { useState, useEffect } from 'react'
import {
    Search, Filter, Star, CheckCircle, XCircle, Clock, MessageSquare
} from 'lucide-react'
import { reviewService } from '../../services/reviewService'
import { productService } from '../../services/productService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const ReviewsManagementPagePro = () => {
    const [reviews, setReviews] = useState([])
    const [products, setProducts] = useState([])
    const [filteredReviews, setFilteredReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        note: 'all',
        produit: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterReviews()
    }, [reviews, filters])

    const loadData = async () => {
        try {
            setLoading(true)
            const [reviewsData, productsData] = await Promise.all([
                reviewService.getAllReviews(),
                productService.getAllProducts()
            ])
            setReviews(reviewsData.avis || reviewsData.data || [])
            setProducts(productsData.produits || productsData)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const filterReviews = () => {
        let filtered = [...reviews]

        if (filters.search) {
            filtered = filtered.filter(r =>
                r.utilisateur?.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.produit?.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                r.commentaire?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(r => r.statut === filters.statut)
        }

        if (filters.note !== 'all') {
            filtered = filtered.filter(r => r.note === parseInt(filters.note))
        }

        if (filters.produit !== 'all') {
            filtered = filtered.filter(r => r.produit_id === filters.produit)
        }

        if (filters.date_debut) {
            filtered = filtered.filter(r => new Date(r.cree_le) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(r => new Date(r.cree_le) <= new Date(filters.date_fin))
        }

        switch (filters.sortBy) {
            case 'note_asc':
                filtered.sort((a, b) => a.note - b.note)
                break
            case 'note_desc':
                filtered.sort((a, b) => b.note - a.note)
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredReviews(filtered)
    }

    const handleModerate = async (reviewId, statut) => {
        try {
            await reviewService.moderateReview(reviewId, statut)
            toast.success(`Avis ${statut === 'APPROVED' ? 'approuvé' : 'rejeté'}`)
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            note: 'all',
            produit: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const getStatusBadge = (statut) => {
        const variants = {
            'PENDING': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'error'
        }
        return <Badge variant={variants[statut] || 'default'} size="sm">{statut}</Badge>
    }

    const renderStars = (note) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        )
    }

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.statut === 'PENDING').length,
        approved: reviews.filter(r => r.statut === 'APPROVED').length,
        rejected: reviews.filter(r => r.statut === 'REJECTED').length,
        note_moyenne: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length
            : 0
    }

    const columns = [
        {
            header: 'Client',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar name={`${item.utilisateur?.prenom} ${item.utilisateur?.nom}`} size="sm" />
                    <div>
                        <p className="font-medium text-gray-900">
                            {item.utilisateur?.prenom} {item.utilisateur?.nom}
                        </p>
                        <p className="text-xs text-gray-500">{item.utilisateur?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Produit',
            render: (item) => (
                <div>
                    <p className="font-medium text-gray-900">{item.produit?.nom}</p>
                    <p className="text-xs text-gray-500">{item.produit?.reference}</p>
                </div>
            )
        },
        {
            header: 'Note',
            field: 'note',
            sortable: true,
            render: (item) => renderStars(item.note)
        },
        {
            header: 'Commentaire',
            render: (item) => (
                <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                    {item.commentaire || 'Aucun commentaire'}
                </p>
            )
        },
        {
            header: 'Date',
            field: 'cree_le',
            sortable: true,
            render: (item) => (
                <p className="text-sm text-gray-600">
                    {new Date(item.cree_le).toLocaleDateString('fr-FR')}
                </p>
            )
        },
        {
            header: 'Statut',
            field: 'statut',
            render: (item) => getStatusBadge(item.statut)
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={MessageSquare}
                        onClick={() => {
                            setSelectedReview(item)
                            setShowDetailsModal(true)
                        }}
                        title="Détails"
                    />
                    {item.statut === 'PENDING' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => handleModerate(item.id, 'APPROVED')}
                                className="text-green-600 hover:bg-green-50"
                                title="Approuver"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={XCircle}
                                onClick={() => handleModerate(item.id, 'REJECTED')}
                                className="text-red-600 hover:bg-red-50"
                                title="Rejeter"
                            />
                        </>
                    )}
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Avis</h1>
                    <p className="text-gray-600">Modérez les avis clients sur vos produits</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-amber-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Star className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 mb-1">En attente</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Approuvés</p>
                            <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 mb-1">Rejetés</p>
                            <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Note moy.</p>
                            <p className="text-3xl font-bold text-orange-900">{stats.note_moyenne.toFixed(1)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Star className="h-8 w-8 text-orange-600 fill-orange-600" />
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
                            placeholder="Rechercher par produit, client, commentaire..."
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
                            { value: 'PENDING', label: 'En attente' },
                            { value: 'APPROVED', label: 'Approuvés' },
                            { value: 'REJECTED', label: 'Rejetés' }
                        ]}
                    />

                    <Select
                        placeholder="Note"
                        value={filters.note}
                        onChange={(e) => setFilters({ ...filters, note: e.target.value })}
                        options={[
                            { value: 'all', label: 'Toutes' },
                            { value: '5', label: '5 étoiles' },
                            { value: '4', label: '4 étoiles' },
                            { value: '3', label: '3 étoiles' },
                            { value: '2', label: '2 étoiles' },
                            { value: '1', label: '1 étoile' }
                        ]}
                    />

                    <Select
                        placeholder="Produit"
                        value={filters.produit}
                        onChange={(e) => setFilters({ ...filters, produit: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            ...products.map(p => ({ value: p.id, label: p.nom }))
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

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récents' },
                            { value: 'note_asc', label: 'Note croissante' },
                            { value: 'note_desc', label: 'Note décroissante' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.note !== 'all' || filters.produit !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Reviews Table */}
            {filteredReviews.length === 0 ? (
                <EmptyState
                    icon={Star}
                    title="Aucun avis trouvé"
                    description={filters.search || filters.statut !== 'all' ? "Aucun avis ne correspond à vos critères" : "Aucun avis pour le moment"}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredReviews}
                    loading={loading}
                />
            )}

            {/* Details Modal */}
            {selectedReview && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title="Détails de l'avis"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar name={`${selectedReview.utilisateur?.prenom} ${selectedReview.utilisateur?.nom}`} size="lg" />
                            <div>
                                <p className="font-bold text-gray-900">
                                    {selectedReview.utilisateur?.prenom} {selectedReview.utilisateur?.nom}
                                </p>
                                <p className="text-sm text-gray-600">{selectedReview.utilisateur?.email}</p>
                                <div className="mt-1">{renderStars(selectedReview.note)}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Produit</p>
                            <p className="font-medium">{selectedReview.produit?.nom}</p>
                        </div>

                        {selectedReview.commentaire && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Commentaire</p>
                                <p className="text-gray-700">{selectedReview.commentaire}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-medium">{new Date(selectedReview.cree_le).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Statut</p>
                                {getStatusBadge(selectedReview.statut)}
                            </div>
                        </div>

                        {selectedReview.statut === 'PENDING' && (
                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="success"
                                    icon={CheckCircle}
                                    onClick={() => {
                                        handleModerate(selectedReview.id, 'APPROVED')
                                        setShowDetailsModal(false)
                                    }}
                                    className="flex-1"
                                >
                                    Approuver
                                </Button>
                                <Button
                                    variant="danger"
                                    icon={XCircle}
                                    onClick={() => {
                                        handleModerate(selectedReview.id, 'REJECTED')
                                        setShowDetailsModal(false)
                                    }}
                                    className="flex-1"
                                >
                                    Rejeter
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ReviewsManagementPagePro
