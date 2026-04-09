import { useState, useEffect } from 'react'
import {
  Plus, Edit2, Trash2, Image as ImageIcon, Search, Filter, Grid3x3, List,
  Package, TrendingUp, AlertTriangle, Tag, Upload, X, Eye,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { getImageUrl } from '../../utils/imageUrl'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import FileUpload from '../../components/forms/FileUpload'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const ProductsManagementPagePro = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'all', // all, active, inactive, low_stock, out_of_stock
    priceMin: '',
    priceMax: '',
    promotion: 'all', // all, yes, no
    sortBy: 'recent' // recent, name, price_asc, price_desc, stock
  })

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    stock: '',
    categorie_id: '',
    est_actif: true
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProducts()
    setCurrentPage(1)
  }, [products, filters])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ])
      setProducts(productsData.produits || productsData.data || [])
      setCategories(categoriesData.categories || categoriesData.data || [])
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Recherche
    if (filters.search) {
      filtered = filtered.filter(p =>
        p.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.marque?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Catégorie
    if (filters.category) {
      filtered = filtered.filter(p => p.categorie_id === filters.category)
    }

    // Statut
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(p => p.est_actif)
          break
        case 'inactive':
          filtered = filtered.filter(p => !p.est_actif)
          break
        case 'low_stock':
          filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10)
          break
        case 'out_of_stock':
          filtered = filtered.filter(p => p.stock === 0)
          break
      }
    }

    // Prix
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.prix >= parseFloat(filters.priceMin))
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.prix <= parseFloat(filters.priceMax))
    }

    // Promotion
    if (filters.promotion !== 'all') {
      filtered = filtered.filter(p =>
        filters.promotion === 'yes' ? p.en_promotion : !p.en_promotion
      )
    }

    // Tri
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.nom.localeCompare(b.nom))
        break
      case 'price_asc':
        filtered.sort((a, b) => a.prix - b.prix)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.prix - a.prix)
        break
      case 'stock':
        filtered.sort((a, b) => a.stock - b.stock)
        break
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
    }

    setFilteredProducts(filtered)
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleImageSelect = (files) => {
    if (!files || files.length === 0) return
    const newFiles = Array.from(files)
    const totalImages = imageFiles.length + (editingProduct?.images?.length || 0)
    if (totalImages + newFiles.length > 6) {
      toast.error('Maximum 6 images par produit')
      return
    }
    setImageFiles(prev => [...prev, ...newFiles])
    const previews = newFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...previews])
  }

  const removeImagePreview = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const uploadImagesForProduct = async (productId) => {
    for (let i = 0; i < imageFiles.length; i++) {
      const fd = new FormData()
      fd.append('image', imageFiles[i])
      fd.append('est_principale', i === 0 ? 'true' : 'false')
      await productService.uploadImage(productId, fd)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData)
        if (imageFiles.length > 0) {
          await uploadImagesForProduct(editingProduct.id)
        }
        toast.success('Produit modifié avec succès')
      } else {
        const result = await productService.createProduct(formData)
        const newProductId = result.produit?.id
        if (newProductId && imageFiles.length > 0) {
          await uploadImagesForProduct(newProductId)
        }
        toast.success('Produit créé avec succès')
      }
      setShowModal(false)
      resetForm()
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit?')) return
    try {
      await productService.deactivateProduct(id)
      toast.success('Produit désactivé')
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur')
    }
  }

  const handleImageUpload = async (files) => {
    if (!selectedProduct || files.length === 0) return

    try {
      const fd = new FormData()
      fd.append('image', files[0])
      fd.append('est_principale', 'true')

      await productService.uploadImage(selectedProduct.id, fd)
      toast.success('Image ajoutée')
      setShowImageModal(false)
      loadData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur upload')
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      nom: '',
      description: '',
      prix: '',
      stock: '',
      categorie_id: '',
      est_actif: true
    })
    setImageFiles([])
    setImagePreviews([])
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: 'all',
      priceMin: '',
      priceMax: '',
      promotion: 'all',
      sortBy: 'recent'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.est_actif).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  const columns = [
    {
      header: 'Produit',
      field: 'nom',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.images?.[0]?.url ? (
            <img
              src={getImageUrl(item.images[0].url)}
              alt={item.nom}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{item.nom}</p>
            <p className="text-xs text-gray-500">{item.categorie?.nom || 'Sans catégorie'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Catégorie',
      field: 'categorie',
      render: (item) => (
        <Badge variant="default" size="sm">
          {item.categorie?.nom || 'N/A'}
        </Badge>
      )
    },
    {
      header: 'Prix',
      field: 'prix',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-semibold text-gray-900">{formatPrice(item.prix)} FCFA</p>
          {item.en_promotion && (
            <p className="text-xs text-green-600 font-medium">
              -{item.reduction_pourcentage}%
            </p>
          )}
        </div>
      )
    },
    {
      header: 'Stock',
      field: 'stock',
      sortable: true,
      render: (item) => (
        <Badge
          variant={
            item.stock === 0 ? 'error' :
              item.stock <= 10 ? 'warning' :
                'success'
          }
          size="sm"
        >
          {item.stock} unités
        </Badge>
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
              setSelectedProduct(item)
              setShowImageModal(true)
            }}
            title="Images"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit2}
            onClick={() => {
              setEditingProduct(item)
              setFormData({
                nom: item.nom,
                description: item.description || '',
                prix: item.prix,
                stock: item.stock,
                categorie_id: item.categorie_id,
                marque: item.marque || '',
                reference: item.reference || '',
                est_actif: item.est_actif
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez votre catalogue de pièces détachées</p>
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
          Nouveau produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total produits</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-white rounded-xl">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Produits actifs</p>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
            </div>
            <div className="p-3 bg-white rounded-xl">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Stock faible</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-white rounded-xl">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Rupture stock</p>
              <p className="text-3xl font-bold text-red-900">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-white rounded-xl">
              <Package className="h-8 w-8 text-red-600" />
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#4DB896] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#4DB896] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="lg:col-span-2">
            <Input
              icon={Search}
              placeholder="Rechercher par nom, référence, marque..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Catégorie */}
          <Select
            placeholder="Toutes catégories"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            options={categories.map(cat => ({ value: cat.id, label: cat.nom }))}
          />

          {/* Statut */}
          <Select
            placeholder="Tous statuts"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: 'all', label: 'Tous' },
              { value: 'active', label: 'Actifs' },
              { value: 'inactive', label: 'Inactifs' },
              { value: 'low_stock', label: 'Stock faible' },
              { value: 'out_of_stock', label: 'Rupture' }
            ]}
          />

          {/* Prix Min */}
          <Input
            type="number"
            placeholder="Prix min (FCFA)"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          />

          {/* Prix Max */}
          <Input
            type="number"
            placeholder="Prix max (FCFA)"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          />

          {/* Promotion */}
          <Select
            placeholder="Promotions"
            value={filters.promotion}
            onChange={(e) => setFilters({ ...filters, promotion: e.target.value })}
            options={[
              { value: 'all', label: 'Toutes' },
              { value: 'yes', label: 'En promotion' },
              { value: 'no', label: 'Sans promotion' }
            ]}
          />

          {/* Tri */}
          <Select
            placeholder="Trier par"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            options={[
              { value: 'recent', label: 'Plus récents' },
              { value: 'name', label: 'Nom A-Z' },
              { value: 'price_asc', label: 'Prix croissant' },
              { value: 'price_desc', label: 'Prix décroissant' },
              { value: 'stock', label: 'Stock' }
            ]}
          />
        </div>

        {/* Reset Filters */}
        {(filters.search || filters.category || filters.status !== 'all' || filters.priceMin || filters.priceMax || filters.promotion !== 'all' || filters.sortBy !== 'recent') && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun produit trouvé"
          description={filters.search || filters.category ? "Aucun produit ne correspond à vos critères" : "Commencez par ajouter votre premier produit"}
          actionLabel={!filters.search && !filters.category ? "Ajouter un produit" : undefined}
          onAction={!filters.search && !filters.category ? () => { resetForm(); setShowModal(true) } : undefined}
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                {product.images?.[0]?.url ? (
                  <img
                    src={getImageUrl(product.images[0].url)}
                    alt={product.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                {product.en_promotion && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="error" size="sm">
                      -{product.reduction_pourcentage}%
                    </Badge>
                  </div>
                )}
                {!product.est_actif && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="default">Inactif</Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.nom}</h3>
                <p className="text-xs text-gray-500 mb-3">{product.categorie?.nom || 'Sans catégorie'}</p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-[#4DB896]">
                      {formatPrice(product.prix)} FCFA
                    </p>
                    {product.en_promotion && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatPrice(product.prix / (1 - product.reduction_pourcentage / 100))} FCFA
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      product.stock === 0 ? 'error' :
                        product.stock <= 10 ? 'warning' :
                          'success'
                    }
                    size="sm"
                  >
                    {product.stock}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit2}
                    onClick={() => {
                      setEditingProduct(product)
                      setFormData({
                        nom: product.nom,
                        description: product.description || '',
                        prix: product.prix,
                        stock: product.stock,
                        categorie_id: product.categorie_id,
                        est_actif: product.est_actif
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
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:bg-red-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <DataTable
          columns={columns}
          data={paginatedProducts}
          loading={loading}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} — Page {currentPage}/{totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === p
                        ? 'bg-[#4DB896] text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            }
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm() }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Nom du produit"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Filtre à huile Toyota"
              />
            </div>

            <div className="col-span-2">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={500}
                showCount
                placeholder="Décrivez le produit..."
              />
            </div>

            <Input
              label="Prix (FCFA)"
              type="number"
              required
              min="0"
              value={formData.prix}
              onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
              placeholder="10000"
            />

            <Input
              label="Stock"
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="50"
            />

            <Select
              label="Catégorie"
              required
              value={formData.categorie_id}
              onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
              options={categories.map(cat => ({ value: cat.id, label: cat.nom }))}
            />

            <div className="flex items-end">
              <Switch
                label="Produit actif"
                description="Visible sur le site"
                checked={formData.est_actif}
                onChange={(checked) => setFormData({ ...formData, est_actif: checked })}
              />
            </div>

            {/* Images existantes (mode édition) */}
            {editingProduct?.images?.length > 0 && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Images existantes</label>
                <div className="flex gap-3 flex-wrap">
                  {editingProduct.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={getImageUrl(img.url)} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                      {img.est_principale && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#4DB896] text-white text-[10px] text-center py-0.5">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload nouvelles images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editingProduct ? 'Ajouter des images' : 'Images du produit'}
                {!editingProduct && <span className="text-gray-400 text-xs ml-1">(max 6)</span>}
              </label>

              {/* Prévisualisations */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-3 flex-wrap mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={preview} alt={`Aperçu ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImagePreview(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && !editingProduct?.images?.length && (
                        <span className="absolute bottom-0 left-0 right-0 bg-[#4DB896] text-white text-[10px] text-center py-0.5">
                          Principale
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bouton d'ajout */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#4DB896] hover:bg-green-50 transition-colors">
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Cliquer pour ajouter des images</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files)}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG ou WEBP. 5 Mo max par image.</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
              {uploading ? 'Envoi en cours...' : editingProduct ? 'Modifier' : 'Créer'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setShowModal(false); resetForm() }}
              className="flex-1"
              disabled={uploading}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Upload Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Gérer les images"
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Images */}
          {selectedProduct?.images?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Images actuelles</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedProduct.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImageUrl(img.url)}
                      alt={`Image ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {img.est_principale && (
                      <Badge variant="primary" size="sm" className="absolute top-2 left-2">
                        Principale
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New */}
          <FileUpload
            label="Ajouter des images"
            accept="image/*"
            multiple
            maxSize={5}
            onFilesChange={handleImageUpload}
          />
        </div>
      </Modal>
    </div>
  )
}

export default ProductsManagementPagePro
