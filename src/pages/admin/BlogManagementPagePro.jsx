import { useState, useEffect, useCallback } from 'react'
import {
    Plus, Edit2, Trash2, Search, Filter, FileText, Eye, EyeOff, Calendar, TrendingUp,
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Undo, Redo, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { blogService } from '../../services/blogService'
import { getImageUrl } from '../../utils/imageUrl'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

// Toolbar component for Tiptap editor
const MenuBar = ({ editor }) => {
    if (!editor) return null
    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Bold className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Italic className="h-4 w-4" /></button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Heading1 className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Heading2 className="h-4 w-4" /></button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><List className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><ListOrdered className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Quote className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200 text-primary' : 'text-gray-600'}`}><Code className="h-4 w-4" /></button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30"><Undo className="h-4 w-4" /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30"><Redo className="h-4 w-4" /></button>
        </div>
    )
}

const BlogManagementPagePro = () => {
    const [articles, setArticles] = useState([])
    const [filteredArticles, setFilteredArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingArticle, setEditingArticle] = useState(null)
    const toast = useToast()

    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        categorie: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    const [formData, setFormData] = useState({
        titre: '',
        contenu: '',
        resume: '',
        image: '',
        imageFile: null,
        est_publie: false
    })

    useEffect(() => {
        loadArticles()
    }, [])

    useEffect(() => {
        filterArticles()
    }, [articles, filters])

    const loadArticles = async () => {
        try {
            setLoading(true)
            const response = await blogService.getAllArticles()
            const list = response?.data || response
            setArticles(Array.isArray(list) ? list : [])
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des articles')
        } finally {
            setLoading(false)
        }
    }

    const filterArticles = () => {
        let filtered = [...articles]

        if (filters.search) {
            filtered = filtered.filter(a =>
                a.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
                a.contenu?.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.statut !== 'all') {
            filtered = filtered.filter(a =>
                filters.statut === 'publie' ? a.statut === 'publie' : a.statut !== 'publie'
            )
        }

        if (filters.categorie !== 'all') {
            filtered = filtered.filter(a => a.categorie === filters.categorie)
        }

        if (filters.date_debut) {
            filtered = filtered.filter(a => new Date(a.date_publication) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(a => new Date(a.date_publication) <= new Date(filters.date_fin))
        }

        switch (filters.sortBy) {
            case 'vues':
                filtered.sort((a, b) => (b.nombre_vues || 0) - (a.nombre_vues || 0))
                break
            case 'titre':
                filtered.sort((a, b) => a.titre.localeCompare(b.titre))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredArticles(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Use FormData if there's a file to upload
            if (formData.imageFile) {
                const fd = new FormData()
                fd.append('titre', formData.titre)
                fd.append('contenu', formData.contenu)
                if (formData.resume) fd.append('resume', formData.resume)
                fd.append('image', formData.imageFile)
                if (editingArticle && formData.est_publie) fd.append('statut', 'publie')

                if (editingArticle) {
                    await blogService.updateArticle(editingArticle.id, fd)
                    toast.success('Article modifié avec succès')
                } else {
                    await blogService.createArticle(fd)
                    toast.success('Article créé avec succès')
                }
            } else {
                const payload = {
                    titre: formData.titre,
                    contenu: formData.contenu,
                    resume: formData.resume,
                    image: formData.image || null
                }
                if (editingArticle) {
                    if (formData.est_publie) payload.statut = 'publie'
                    await blogService.updateArticle(editingArticle.id, payload)
                    toast.success('Article modifié avec succès')
                } else {
                    await blogService.createArticle(payload)
                    toast.success('Article créé avec succès')
                }
            }
            setShowModal(false)
            resetForm()
            loadArticles()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handlePublish = async (id, publish) => {
        try {
            if (publish) {
                await blogService.publishArticle(id)
                toast.success('Article publié')
            } else {
                await blogService.unpublishArticle(id)
                toast.success('Article dépublié')
            }
            loadArticles()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cet article?')) return
        try {
            await blogService.deleteArticle(id)
            toast.success('Article supprimé')
            loadArticles()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const resetForm = () => {
        setEditingArticle(null)
        setFormData({
            titre: '',
            contenu: '',
            resume: '',
            image: '',
            imageFile: null,
            est_publie: false
        })
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            categorie: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const stats = {
        total: articles.length,
        publies: articles.filter(a => a.statut === 'publie').length,
        brouillons: articles.filter(a => a.statut !== 'publie').length,
        vues_total: articles.reduce((sum, a) => sum + (a.nombre_vues || 0), 0)
    }

    const columns = [
        {
            header: 'Titre',
            field: 'titre',
            sortable: true,
            render: (item) => (
                <div>
                    <p className="font-semibold text-gray-900">{item.titre}</p>
                    <p className="text-xs text-gray-500">{item.slug}</p>
                </div>
            )
        },
        {
            header: 'Catégorie',
            field: 'categorie',
            render: (item) => (
                <Badge variant="default" size="sm">{item.categorie}</Badge>
            )
        },
        {
            header: 'Vues',
            field: 'nombre_vues',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{item.nombre_vues || 0}</span>
                </div>
            )
        },
        {
            header: 'Date',
            field: 'date_publication',
            sortable: true,
            render: (item) => (
                <p className="text-sm text-gray-600">
                    {item.date_publication
                        ? new Date(item.date_publication).toLocaleDateString('fr-FR')
                        : 'Non publié'}
                </p>
            )
        },
        {
            header: 'Statut',
            field: 'est_publie',
            render: (item) => (
                <Badge variant={item.statut === 'publie' ? 'success' : 'warning'} size="sm">
                    {item.statut === 'publie' ? 'Publié' : 'Brouillon'}
                </Badge>
            )
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={item.statut === 'publie' ? EyeOff : Eye}
                        onClick={() => handlePublish(item.id, item.statut !== 'publie')}
                        className={item.statut === 'publie' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                        title={item.statut === 'publie' ? 'Dépublier' : 'Publier'}
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit2}
                        onClick={() => {
                            setEditingArticle(item)
                            setFormData({
                                titre: item.titre,
                                contenu: item.contenu,
                                resume: item.resume || '',
                                image: item.image || '',
                                est_publie: item.statut === 'publie'
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion du Blog</h1>
                    <p className="text-gray-600">Créez et publiez des articles pour votre blog</p>
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
                    Nouvel article
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-teal-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-teal-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <FileText className="h-8 w-8 text-teal-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Publiés</p>
                            <p className="text-3xl font-bold text-green-900">{stats.publies}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Eye className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 mb-1">Brouillons</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.brouillons}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <FileText className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Vues totales</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.vues_total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
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
                            placeholder="Rechercher par titre, contenu..."
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
                            { value: 'publie', label: 'Publiés' },
                            { value: 'brouillon', label: 'Brouillons' }
                        ]}
                    />

                    <Select
                        placeholder="Catégorie"
                        value={filters.categorie}
                        onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                        options={[
                            { value: 'all', label: 'Toutes' },
                            { value: 'general', label: 'Général' },
                            { value: 'conseils', label: 'Conseils' },
                            { value: 'actualites', label: 'Actualités' },
                            { value: 'tutoriels', label: 'Tutoriels' }
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
                            { value: 'titre', label: 'Titre A-Z' },
                            { value: 'vues', label: 'Plus vus' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.categorie !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Articles Table */}
            {filteredArticles.length === 0 ? (
                <EmptyState
                    icon={FileText}
                    title="Aucun article trouvé"
                    description={filters.search || filters.statut !== 'all' ? "Aucun article ne correspond à vos critères" : "Commencez par créer votre premier article"}
                    actionLabel={!filters.search && filters.statut === 'all' ? "Créer un article" : undefined}
                    onAction={!filters.search && filters.statut === 'all' ? () => { resetForm(); setShowModal(true) } : undefined}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredArticles}
                    loading={loading}
                />
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => { setShowModal(false); resetForm() }}
                title={editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                size="xl"
            >
                <BlogArticleForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={() => { setShowModal(false); resetForm() }}
                    isEditing={!!editingArticle}
                />
            </Modal>
        </div>
    )
}

// Blog Article Form with Tiptap rich text editor
const BlogArticleForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: formData.contenu || '',
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, contenu: editor.getHTML() }))
        },
    })

    // Sync editor content when formData changes externally (e.g. editing existing article)
    useEffect(() => {
        if (editor && formData.contenu !== editor.getHTML()) {
            editor.commands.setContent(formData.contenu || '')
        }
    }, [editor, formData.contenu])

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Input
                label="Titre de l'article"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: 5 conseils pour entretenir votre véhicule"
            />

            <Textarea
                label="Résumé / Extrait"
                value={formData.resume}
                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                rows={2}
                placeholder="Bref résumé de l'article qui apparaît dans les cartes du blog..."
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu de l'article *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                    <MenuBar editor={editor} />
                    <EditorContent
                        editor={editor}
                        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">Utilisez la barre d'outils pour formater votre texte (titres, listes, gras, etc.)</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de l'article</label>
                <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {formData.imageFile ? formData.imageFile.name : 'Choisir une image...'}
                        </span>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) setFormData(prev => ({ ...prev, imageFile: file, image: '' }))
                            }}
                        />
                    </label>
                    {(formData.imageFile || formData.image) && (
                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img
                                src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : getImageUrl(formData.image)}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG ou WebP — max 5 Mo</p>
            </div>

            <Switch
                label="Publier l'article"
                description="L'article sera immédiatement visible sur le site"
                checked={formData.est_publie}
                onChange={(checked) => setFormData({ ...formData, est_publie: checked })}
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                    {isEditing ? 'Modifier' : 'Créer l\'article'}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Annuler
                </Button>
            </div>
        </form>
    )
}

export default BlogManagementPagePro
