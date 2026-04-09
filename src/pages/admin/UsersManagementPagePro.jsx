import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, Eye, Users, UserCheck, UserX, Shield
} from 'lucide-react'
import { userService } from '../../services/userService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const UsersManagementPagePro = () => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const toast = useToast()

    // Filtres
    const [filters, setFilters] = useState({
        search: '',
        role: 'all',
        statut: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        email: '',
        mot_de_passe: '',
        prenom: '',
        nom: '',
        telephone: '',
        adresse: '',
        role: 'client',
        statut: 'actif'
    })

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, filters])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const response = await userService.getAllUsers()
            setUsers(response.utilisateurs || response.data || response)
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des utilisateurs')
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = [...users]

        // Recherche
        if (filters.search) {
            filtered = filtered.filter(u =>
                u.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.prenom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
                u.telephone?.includes(filters.search)
            )
        }

        // Rôle
        if (filters.role !== 'all') {
            filtered = filtered.filter(u => u.role === filters.role)
        }

        // Statut
        if (filters.statut !== 'all') {
            filtered = filtered.filter(u => u.statut === filters.statut)
        }

        // Date
        if (filters.date_debut) {
            filtered = filtered.filter(u => new Date(u.cree_le) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(u => new Date(u.cree_le) <= new Date(filters.date_fin))
        }

        // Tri
        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.nom.localeCompare(b.nom))
                break
            case 'email':
                filtered.sort((a, b) => a.email.localeCompare(b.email))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredUsers(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData)
                toast.success('Utilisateur modifié avec succès')
            } else {
                await userService.createUser(formData)
                toast.success('Utilisateur créé avec succès')
            }
            setShowModal(false)
            resetForm()
            loadUsers()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet utilisateur?')) return
        try {
            await userService.deleteUser(id)
            toast.success('Utilisateur supprimé')
            loadUsers()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            mot_de_passe: '',
            prenom: '',
            nom: '',
            telephone: '',
            adresse: '',
            role: 'client',
            statut: 'actif'
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            role: 'all',
            statut: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const getRoleBadge = (role) => {
        const variants = {
            'admin': 'error',
            'client': 'default'
        }
        return <Badge variant={variants[role] || 'default'} size="sm">{role.toUpperCase()}</Badge>
    }

    const getStatusBadge = (statut) => {
        const variants = {
            'actif': 'success',
            'bloque': 'error'
        }
        return <Badge variant={variants[statut] || 'default'} size="sm">{statut}</Badge>
    }

    const stats = {
        total: users.length,
        clients: users.filter(u => u.role === 'client').length,
        admins: users.filter(u => u.role === 'admin').length,
        actifs: users.filter(u => u.statut === 'actif').length,
        bloques: users.filter(u => u.statut === 'bloque').length
    }

    const columns = [
        {
            header: 'Utilisateur',
            field: 'nom',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar name={`${item.prenom} ${item.nom}`} size="md" />
                    <div>
                        <p className="font-semibold text-gray-900">{item.prenom} {item.nom}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Téléphone',
            field: 'telephone',
            render: (item) => (
                <p className="text-sm text-gray-700">{item.telephone || 'N/A'}</p>
            )
        },
        {
            header: 'Rôle',
            field: 'role',
            render: (item) => getRoleBadge(item.role)
        },
        {
            header: 'Statut',
            field: 'statut',
            render: (item) => getStatusBadge(item.statut)
        },
        {
            header: 'Inscription',
            field: 'cree_le',
            sortable: true,
            render: (item) => (
                <p className="text-sm text-gray-600">
                    {new Date(item.cree_le).toLocaleDateString('fr-FR')}
                </p>
            )
        },
        {
            header: 'Stats',
            render: (item) => (
                <div className="text-xs text-gray-600">
                    <p>{item.stats?.nombre_commandes || 0} commandes</p>
                    <p className="text-[#4DB896] font-medium">
                        {new Intl.NumberFormat('fr-FR').format(item.stats?.total_depense || 0)} FCFA
                    </p>
                </div>
            )
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
                            setSelectedUser(item)
                            setShowDetailsModal(true)
                        }}
                        title="Détails"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => {
                            setEditingUser(item)
                            setFormData({
                                email: item.email,
                                mot_de_passe: '',
                                prenom: item.prenom,
                                nom: item.nom,
                                telephone: item.telephone || '',
                                adresse: item.adresse || '',
                                role: item.role,
                                statut: item.statut || 'actif'
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
                        title="Supprimer"
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h1>
                    <p className="text-gray-600">Gérez les clients et administrateurs</p>
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
                    Nouvel utilisateur
                </Button>
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
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Clients</p>
                            <p className="text-3xl font-bold text-purple-900">{stats.clients}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <UserCheck className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 mb-1">Admins</p>
                            <p className="text-3xl font-bold text-red-900">{stats.admins}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Shield className="h-8 w-8 text-red-600" />
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
                            <p className="text-sm font-medium text-gray-600 mb-1">Bloqués</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.bloques}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <UserX className="h-8 w-8 text-gray-600" />
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
                            placeholder="Rechercher par nom, email, téléphone..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        placeholder="Rôle"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'client', label: 'Clients' },
                            { value: 'admin', label: 'Admins' }
                        ]}
                    />

                    <Select
                        placeholder="Statut"
                        value={filters.statut}
                        onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'actif', label: 'Actifs' },
                            { value: 'bloque', label: 'Bloqués' }
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
                            { value: 'name', label: 'Nom A-Z' },
                            { value: 'email', label: 'Email A-Z' }
                        ]}
                    />
                </div>

                {(filters.search || filters.role !== 'all' || filters.statut !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="Aucun utilisateur trouvé"
                    description={filters.search || filters.role !== 'all' ? "Aucun utilisateur ne correspond à vos critères" : "Commencez par ajouter votre premier utilisateur"}
                    actionLabel={!filters.search && filters.role === 'all' ? "Ajouter un utilisateur" : undefined}
                    onAction={!filters.search && filters.role === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    loading={loading}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Prénom"
                            required
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            placeholder="Jean"
                        />

                        <Input
                            label="Nom"
                            required
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            placeholder="Dupont"
                        />

                        <div className="col-span-2">
                            <Input
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jean.dupont@example.com"
                            />
                        </div>

                        <Input
                            label="Téléphone"
                            required
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            placeholder="+237 6XX XXX XXX"
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            required={!editingUser}
                            value={formData.mot_de_passe}
                            onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                            placeholder={editingUser ? "Laisser vide pour ne pas changer" : "Minimum 8 caractères"}
                        />

                        <div className="col-span-2">
                            <Input
                                label="Adresse"
                                value={formData.adresse}
                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                placeholder="Adresse complète"
                            />
                        </div>

                        <Select
                            label="Rôle"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            options={[
                                { value: 'client', label: 'Client' },
                                { value: 'admin', label: 'Administrateur' }
                            ]}
                        />

                        <Select
                            label="Statut"
                            required
                            value={formData.statut}
                            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                            options={[
                                { value: 'actif', label: 'Actif' },
                                { value: 'bloque', label: 'Bloqué' }
                            ]}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingUser ? 'Modifier' : 'Créer'}
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

            {/* Details Modal */}
            {selectedUser && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title="Détails de l'utilisateur"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar name={`${selectedUser.prenom} ${selectedUser.nom}`} size="xl" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedUser.prenom} {selectedUser.nom}</h3>
                                <p className="text-gray-600">{selectedUser.email}</p>
                                <div className="flex gap-2 mt-2">
                                    {getRoleBadge(selectedUser.role)}
                                    {getStatusBadge(selectedUser.statut)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                                <p className="font-medium">{selectedUser.telephone || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Inscription</p>
                                <p className="font-medium">{new Date(selectedUser.cree_le).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Commandes</p>
                                <p className="font-medium">{selectedUser.stats?.nombre_commandes || 0}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total dépensé</p>
                                <p className="font-medium text-[#4DB896]">
                                    {new Intl.NumberFormat('fr-FR').format(selectedUser.stats?.total_depense || 0)} FCFA
                                </p>
                            </div>
                        </div>

                        {selectedUser.adresse && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Adresse</p>
                                <p className="font-medium">{selectedUser.adresse}</p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default UsersManagementPagePro
