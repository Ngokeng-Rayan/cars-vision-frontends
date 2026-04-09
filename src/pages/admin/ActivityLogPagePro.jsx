import { useState, useEffect } from 'react'
import {
    Search, Filter, Activity, User, Package, ShoppingCart, FileText
} from 'lucide-react'
import { activityService } from '../../services/activityService'
import DataTable from '../../components/common/DataTable'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const ActivityLogPagePro = () => {
    const [activities, setActivities] = useState([])
    const [filteredActivities, setFilteredActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        utilisateur: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    useEffect(() => {
        loadActivities()
    }, [])

    useEffect(() => {
        filterActivities()
    }, [activities, filters])

    const loadActivities = async () => {
        try {
            setLoading(true)
            const response = await activityService.getAllActivities()
            setActivities(response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement du journal')
        } finally {
            setLoading(false)
        }
    }

    const filterActivities = () => {
        let filtered = [...activities]

        if (filters.search) {
            filtered = filtered.filter(a =>
                a.action?.toLowerCase().includes(filters.search.toLowerCase()) ||
                a.utilisateur?.nom?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.type !== 'all') {
            filtered = filtered.filter(a => a.type_action === filters.type)
        }

        if (filters.utilisateur !== 'all') {
            filtered = filtered.filter(a => a.utilisateur_id === filters.utilisateur)
        }

        if (filters.date_debut) {
            filtered = filtered.filter(a => new Date(a.cree_le) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(a => new Date(a.cree_le) <= new Date(filters.date_fin))
        }

        switch (filters.sortBy) {
            case 'oldest':
                filtered.sort((a, b) => new Date(a.cree_le) - new Date(b.cree_le))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredActivities(filtered)
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            type: 'all',
            utilisateur: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const getTypeIcon = (type) => {
        const icons = {
            'produit': Package,
            'commande': ShoppingCart,
            'utilisateur': User,
            'autre': FileText
        }
        return icons[type] || Activity
    }

    const getTypeBadge = (type) => {
        const variants = {
            'produit': 'primary',
            'commande': 'success',
            'utilisateur': 'warning',
            'autre': 'default'
        }
        return <Badge variant={variants[type] || 'default'} size="sm">{type}</Badge>
    }

    const columns = [
        {
            header: 'Date & Heure',
            field: 'cree_le',
            sortable: true,
            render: (item) => (
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        {new Date(item.cree_le).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(item.cree_le).toLocaleTimeString('fr-FR')}
                    </p>
                </div>
            )
        },
        {
            header: 'Utilisateur',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Avatar name={item.utilisateur?.nom || 'Système'} size="sm" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {item.utilisateur?.nom || 'Système'}
                        </p>
                        <p className="text-xs text-gray-500">{item.utilisateur?.email || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            field: 'type_action',
            render: (item) => {
                const Icon = getTypeIcon(item.type_action)
                return (
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-400" />
                        {getTypeBadge(item.type_action)}
                    </div>
                )
            }
        },
        {
            header: 'Action',
            field: 'action',
            render: (item) => (
                <p className="text-sm text-gray-700 max-w-md line-clamp-2">{item.action}</p>
            )
        }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Journal d'Activité</h1>
                <p className="text-gray-600">Suivez toutes les actions effectuées sur la plateforme</p>
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
                            placeholder="Rechercher par action, utilisateur..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        placeholder="Type d'action"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'produit', label: 'Produits' },
                            { value: 'commande', label: 'Commandes' },
                            { value: 'utilisateur', label: 'Utilisateurs' },
                            { value: 'autre', label: 'Autres' }
                        ]}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récents' },
                            { value: 'oldest', label: 'Plus anciens' }
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
                </div>

                {(filters.search || filters.type !== 'all' || filters.utilisateur !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Activities Table */}
            {filteredActivities.length === 0 ? (
                <EmptyState
                    icon={Activity}
                    title="Aucune activité trouvée"
                    description={filters.search || filters.type !== 'all' ? "Aucune activité ne correspond à vos critères" : "Aucune activité enregistrée"}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredActivities}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default ActivityLogPagePro
