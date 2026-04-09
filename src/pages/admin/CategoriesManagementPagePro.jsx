import { useState, useEffect } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, FolderTree, Package, TrendingUp
} from 'lucide-react'
import { categoryService } from '../../services/categoryService'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const CategoriesManagementPagePro = () => {
    const [categories, setCategories] = useState([])
    const [filteredCategories, setFilteredCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        type: 'all',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        parent_id: '',
        est_actif: true
    })

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        filterCategories()
    }, [categories, filters])

    const loadCategories = async () => {
        try {
            setLoading(true)
            const response = await categoryService.getAllCategories()
            setCategories(response.categories || response.data || [])
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des catégories')
        } finally {
            setLoading(false)
        }
    }

    const filterCategories = () => {
        let filtered = [...categories]

        if (filters.search) {
            filtered = filtered.filter(c =>
                c.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                c.description?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(c =>
                filters.statut === 'actif' ? c.est_actif : !c.est_actif
            )
        }

        if (filters.type !== 'all') {
            filtered = filtered.filter(c =>
                filters.type === 'parent' ? !c.parent_id : c.parent_id
            )
        }

        switch (filters.sortBy) {
            case 'name':
                filtered.sort((a, b) => a.nom.localeCompare(b.nom))
                break
            case 'products':
                filtered.sort((a, b) => (b.nombre_produits || 0) - (a.nombre_produits || 0))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredCategories(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData)
                toast.success('Catégorie modifiée avec succès')
            } else {
                await categoryService.createCategory(formData)
                toast.success('Catégorie créée avec succès')
            }
            setShowModal(false)
            resetForm()
            loadCategories()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette catégorie?')) return
        try {
            await categoryService.deleteCategory(id)
            toast.success('Catégorie supprimée')
            loadCategories()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingCategory(null)
        setFormData({
            nom: '',
            description: '',
            parent_id: '',
            est_actif: true
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            type: 'all',
            sortBy: 'recent'
        })
    }

    const getParentCategories = () => {
        return categories.filter(c => !c.parent_id)
    }

    const stats = {
        total: categories.length,
        parents: categories.filter(c => !c.parent_id).length,
        enfants: categories.filter(c => c.parent_id).length,
        actives: categories.filter(c => c.est_actif).length
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Catégories</h1>
                    <p className="text-gray-600">Organisez vos produits par catégories</p>
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
                    Nouvelle catégorie
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <FolderTree className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Parents</p>
                            <p className="text-3xl font-bold text-purple-900">{stats.parents}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <FolderTree className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Sous-catégories</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.enfants}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Package className="h-8 w-8 text-blue-600" />
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
                            <TrendingUp className="h-8 w-8 text-green-600" />
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
                        placeholder="Type"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        options={[
                            { value: 'all', label: 'Toutes' },
                            { value: 'parent', label: 'Parents' },
                            { value: 'enfant', label: 'Sous-catégories' }
                        ]}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récentes' },
                            { value: 'name', label: 'Nom A-Z' },
                            { value: 'products', label: 'Nb produits' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.type !== 'all' || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
                <EmptyState
                    icon={FolderTree}
                    title="Aucune catégorie trouvée"
                    description={filters.search || filters.statut !== 'all' ? "Aucune catégorie ne correspond à vos critères" : "Commencez par ajouter votre première catégorie"}
                    actionLabel={!filters.search && filters.statut === 'all' ? "Ajouter une catégorie" : undefined}
                    onAction={!filters.search && filters.statut === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FolderTree className="h-5 w-5 text-yellow-600" />
                                            <h3 className="font-bold text-gray-900 text-lg">{category.nom}</h3>
                                        </div>
                                        {category.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                                        )}
                                    </div>
                                    <Badge variant={category.est_actif ? 'success' : 'default'} size="sm">
                                        {category.est_actif ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {category.parent_id && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>Parent:</span>
                                            <Badge variant="default" size="sm">
                                                {categories.find(c => c.id === category.parent_id)?.nom || 'N/A'}
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Produits:</span>
                                        <span className="font-semibold text-[#4DB896]">
                                            {category.nombre_produits || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Edit2}
                                        onClick={() => {
                                            setEditingCategory(category)
                                            setFormData({
                                                nom: category.nom,
                                                description: category.description || '',
                                                parent_id: category.parent_id || '',
                                                est_actif: category.est_actif
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
                                        onClick={() => handleDelete(category.id)}
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
                title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nom de la catégorie"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Ex: Pièces moteur"
                    />

                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        placeholder="Décrivez la catégorie..."
                    />

                    <Select
                        label="Catégorie parente (optionnel)"
                        value={formData.parent_id}
                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                        options={[
                            { value: '', label: 'Aucune (catégorie principale)' },
                            ...getParentCategories()
                                .filter(c => !editingCategory || c.id !== editingCategory.id)
                                .map(c => ({ value: c.id, label: c.nom }))
                        ]}
                    />

                    <Switch
                        label="Catégorie active"
                        description="La catégorie sera visible sur le site"
                        checked={formData.est_actif}
                        onChange={(checked) => setFormData({ ...formData, est_actif: checked })}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" variant="primary" className="flex-1">
                            {editingCategory ? 'Modifier' : 'Créer'}
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

export default CategoriesManagementPagePro
