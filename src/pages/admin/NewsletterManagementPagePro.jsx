import { useState, useEffect } from 'react'
import {
    Search, Filter, Mail, Send, Users, UserCheck, UserX, Calendar
} from 'lucide-react'
import { newsletterService } from '../../services/newsletterService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const NewsletterManagementPagePro = () => {
    const [subscribers, setSubscribers] = useState([])
    const [filteredSubscribers, setFilteredSubscribers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSendModal, setShowSendModal] = useState(false)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    const [emailData, setEmailData] = useState({
        sujet: '',
        contenu: ''
    })

    useEffect(() => {
        loadSubscribers()
    }, [])

    useEffect(() => {
        filterSubscribers()
    }, [subscribers, filters])

    const loadSubscribers = async () => {
        try {
            setLoading(true)
            const response = await newsletterService.getAllSubscribers()
            setSubscribers(response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des abonnés')
        } finally {
            setLoading(false)
        }
    }

    const filterSubscribers = () => {
        let filtered = [...subscribers]

        if (filters.search) {
            filtered = filtered.filter(s =>
                s.email?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(s =>
                filters.statut === 'actif' ? s.est_actif : !s.est_actif
            )
        }

        if (filters.date_debut) {
            filtered = filtered.filter(s => new Date(s.cree_le) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(s => new Date(s.cree_le) <= new Date(filters.date_fin))
        }

        switch (filters.sortBy) {
            case 'email':
                filtered.sort((a, b) => a.email.localeCompare(b.email))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredSubscribers(filtered)
    }

    const handleSendNewsletter = async (e) => {
        e.preventDefault()
        if (!confirm(`Envoyer la newsletter à ${stats.actifs} abonnés?`)) return

        try {
            await newsletterService.sendNewsletter(emailData)
            toast.success('Newsletter envoyée avec succès')
            setShowSendModal(false)
            setEmailData({ sujet: '', contenu: '' })
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi')
        }
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const stats = {
        total: subscribers.length,
        actifs: subscribers.filter(s => s.est_actif).length,
        inactifs: subscribers.filter(s => !s.est_actif).length,
        ce_mois: subscribers.filter(s => {
            const date = new Date(s.cree_le)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length
    }

    const columns = [
        {
            header: 'Email',
            field: 'email',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{item.email}</p>
                </div>
            )
        },
        {
            header: 'Date d\'abonnement',
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
            field: 'est_actif',
            render: (item) => (
                <Badge variant={item.est_actif ? 'success' : 'default'} size="sm">
                    {item.est_actif ? 'Actif' : 'Inactif'}
                </Badge>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion Newsletter</h1>
                    <p className="text-gray-600">Gérez vos abonnés et envoyez des campagnes</p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    icon={Send}
                    onClick={() => setShowSendModal(true)}
                    disabled={stats.actifs === 0}
                >
                    Envoyer une newsletter
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border border-violet-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-violet-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-violet-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Users className="h-8 w-8 text-violet-600" />
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
                            <UserCheck className="h-8 w-8 text-green-600" />
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
                            <UserX className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Ce mois</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.ce_mois}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Calendar className="h-8 w-8 text-blue-600" />
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
                            placeholder="Rechercher par email..."
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
                            { value: 'email', label: 'Email A-Z' }
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

                {(filters.search || filters.statut !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Subscribers Table */}
            {filteredSubscribers.length === 0 ? (
                <EmptyState
                    icon={Mail}
                    title="Aucun abonné trouvé"
                    description={filters.search || filters.statut !== 'all' ? "Aucun abonné ne correspond à vos critères" : "Aucun abonné pour le moment"}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredSubscribers}
                    loading={loading}
                />
            )}

            {/* Send Newsletter Modal */}
            <Modal
                isOpen={showSendModal}
                onClose={() => setShowSendModal(false)}
                title="Envoyer une newsletter"
                size="lg"
            >
                <form onSubmit={handleSendNewsletter} className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            Cette newsletter sera envoyée à <span className="font-bold">{stats.actifs}</span> abonné(s) actif(s).
                        </p>
                    </div>

                    <Input
                        label="Sujet"
                        required
                        value={emailData.sujet}
                        onChange={(e) => setEmailData({ ...emailData, sujet: e.target.value })}
                        placeholder="Sujet de la newsletter"
                    />

                    <Textarea
                        label="Contenu"
                        required
                        value={emailData.contenu}
                        onChange={(e) => setEmailData({ ...emailData, contenu: e.target.value })}
                        rows={10}
                        placeholder="Contenu de la newsletter..."
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" icon={Send} className="flex-1">
                            Envoyer
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowSendModal(false)}
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

export default NewsletterManagementPagePro
