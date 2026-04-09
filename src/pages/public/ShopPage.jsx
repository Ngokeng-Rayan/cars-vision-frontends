import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Search, Package, Star, Truck, Shield, Check, SlidersHorizontal, X, Eye, ChevronRight, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { getProductImageUrl } from '../../utils/imageUrl'
import useCartStore from '../../store/cartStore'

export default function ShopPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [sortBy, setSortBy] = useState('recent')
    const [addedToCart, setAddedToCart] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const PRODUCTS_PER_PAGE = 12
    const addItem = useCartStore((state) => state.addItem)

    useEffect(() => {
        loadCategories()
    }, [])

    const searchTimer = useRef(null)
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 400)
        return () => clearTimeout(searchTimer.current)
    }, [searchQuery])

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, selectedCategory, sortBy])

    useEffect(() => {
        loadProducts()
    }, [debouncedSearch, selectedCategory, sortBy, currentPage])

    const loadCategories = async () => {
        try {
            const categoriesRes = await categoryService.getCategories().catch(() => ({ categories: [] }))
            const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes.categories || categoriesRes.data || [])
            setCategories(categoriesData)
        } catch (err) {
            console.error('Erreur chargement catégories:', err)
        }
    }

    const loadProducts = async () => {
        try {
            setLoading(true)
            const params = { limite: PRODUCTS_PER_PAGE, page: currentPage }
            if (debouncedSearch && debouncedSearch.length >= 2) params.recherche = debouncedSearch
            if (selectedCategory !== 'all') params.categorie_id = selectedCategory
            const sortMap = { price_asc: 'prix_asc', price_desc: 'prix_desc', name: 'nom', recent: 'recent' }
            params.tri = sortMap[sortBy] || 'recent'

            const productsRes = await productService.getPublicProducts(params)
            const productsData = Array.isArray(productsRes) ? productsRes : (productsRes.produits || productsRes.data || [])
            setProducts(productsData)
            const pagination = productsRes.pagination
            if (pagination) {
                setTotalPages(pagination.total_pages || 1)
                setTotalProducts(pagination.total || productsData.length)
            } else {
                setTotalPages(1)
                setTotalProducts(productsData.length)
            }
            setError(null)
        } catch (err) {
            console.error('Erreur chargement:', err)
            setError(err)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const fmtPrice = (price) => new Intl.NumberFormat('fr-FR').format(price)

    const filteredProducts = Array.isArray(products) ? products : []

    const handleAddToCart = (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product)
        setAddedToCart(product.id)
        setTimeout(() => setAddedToCart(null), 2000)
    }

    // Flatten categories for display
    const flatCategories = (cats, depth = 0) => {
        let result = []
        cats.forEach(cat => {
            result.push({ ...cat, depth })
            if (cat.enfants?.length > 0) {
                result = result.concat(flatCategories(cat.enfants, depth + 1))
            }
        })
        return result
    }
    const allCategories = flatCategories(categories)

    return (
        <div className="flex flex-col min-h-screen">
            <SEO title="Boutique - Pièces Auto | Cars Vision Auto" description="Découvrez notre catalogue de pièces détachées automobiles de qualité à Douala. Livraison rapide et prix compétitifs." keywords="pièces auto, boutique, acheter pièces voiture, Douala" />
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#4DB896]/20 text-[#4DB896] rounded-full text-sm font-medium mb-4">
                        <Package className="h-4 w-4" />
                        Boutique Cars Vision Auto
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Pièces Auto & Accessoires
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Pièces détachées certifiées, accessoires automobiles et équipements.
                        Livraison à Douala et dans tout le Cameroun.
                    </p>
                </div>

                {/* Vague décorative */}
                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Search bar + Sort */}
            <section className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une pièce, un accessoire..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent focus:bg-white transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="hidden md:block px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-[#4DB896]"
                        >
                            <option value="recent">Plus récents</option>
                            <option value="price_asc">Prix croissant</option>
                            <option value="price_desc">Prix décroissant</option>
                            <option value="name">Nom A-Z</option>
                        </select>
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="md:hidden p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex gap-6">
                        {/* Sidebar Categories - Desktop */}
                        <aside className="hidden md:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
                                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Catégories</h3>
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                            selectedCategory === 'all'
                                                ? 'bg-[#4DB896]/10 text-[#4DB896] font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>Tous les produits</span>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                            {products.length}
                                        </span>
                                    </button>
                                    {allCategories.map((cat) => {
                                        const count = products.filter(p =>
                                            String(p.categorie_id) === String(cat.id)
                                        ).length
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(String(cat.id))}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    String(selectedCategory) === String(cat.id)
                                                        ? 'bg-[#4DB896]/10 text-[#4DB896] font-semibold'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                                style={{ paddingLeft: `${12 + cat.depth * 16}px` }}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {cat.depth > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                                                    {cat.nom}
                                                </span>
                                                {count > 0 && (
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </nav>

                                {/* Trust info */}
                                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <Truck className="h-4 w-4 text-[#4DB896] flex-shrink-0" />
                                        <span>Livraison Douala 24-48h</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <Shield className="h-4 w-4 text-[#4DB896] flex-shrink-0" />
                                        <span>Pièces certifiées & garanties</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <Package className="h-4 w-4 text-[#4DB896] flex-shrink-0" />
                                        <span>Retrait gratuit à Bonamoussadi</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Mobile Filters Overlay */}
                        {showMobileFilters && (
                            <div className="fixed inset-0 z-50 md:hidden">
                                <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                                <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-900">Filtres</h3>
                                        <button onClick={() => setShowMobileFilters(false)}>
                                            <X className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">Trier par</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        >
                                            <option value="recent">Plus récents</option>
                                            <option value="price_asc">Prix croissant</option>
                                            <option value="price_desc">Prix décroissant</option>
                                            <option value="name">Nom A-Z</option>
                                        </select>
                                    </div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Catégories</label>
                                    <nav className="space-y-1">
                                        <button
                                            onClick={() => { setSelectedCategory('all'); setShowMobileFilters(false) }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${selectedCategory === 'all' ? 'bg-[#4DB896]/10 text-[#4DB896] font-semibold' : 'text-gray-600'}`}
                                        >
                                            Tous les produits
                                        </button>
                                        {allCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => { setSelectedCategory(String(cat.id)); setShowMobileFilters(false) }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${String(selectedCategory) === String(cat.id) ? 'bg-[#4DB896]/10 text-[#4DB896] font-semibold' : 'text-gray-600'}`}
                                            >
                                                {cat.nom}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        <div className="flex-1 min-w-0">
                            {/* Results count */}
                            {!loading && !error && (
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-500">
                                        {totalProducts} produit{totalProducts !== 1 ? 's' : ''}
                                        {totalPages > 1 && <span className="ml-1">— Page {currentPage}/{totalPages}</span>}
                                        {selectedCategory !== 'all' && (
                                            <button
                                                onClick={() => setSelectedCategory('all')}
                                                className="ml-2 text-[#4DB896] hover:underline"
                                            >
                                                Voir tout
                                            </button>
                                        )}
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#4DB896] border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-gray-500">Chargement des produits...</p>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-20 bg-white rounded-xl">
                                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">Impossible de charger les produits</p>
                                    <button onClick={loadData} className="px-6 py-2 bg-[#4DB896] text-white rounded-xl hover:bg-[#3da07e]">
                                        Réessayer
                                    </button>
                                </div>
                            )}

                            {!loading && !error && filteredProducts.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-xl">
                                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                                    <p className="text-gray-500 mb-4">Essayez avec d'autres mots-clés ou catégories.</p>
                                    {(searchQuery || selectedCategory !== 'all') && (
                                        <button
                                            onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                                            className="text-[#4DB896] hover:underline font-medium"
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    )}
                                </div>
                            )}

                            {!loading && !error && filteredProducts.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                    {filteredProducts.map((product) => {
                                        const isPromo = product.en_promotion && product.prix_promotion
                                        const displayPrice = isPromo ? product.prix_promotion : product.prix
                                        const discount = isPromo && product.prix ? Math.round((1 - product.prix_promotion / product.prix) * 100) : 0
                                        return (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-200"
                                        >
                                            {/* Image */}
                                            <Link to={`/shop/${product.id}`} className="block relative aspect-[4/3] bg-gray-50 overflow-hidden">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={getProductImageUrl(product.images)}
                                                        alt={product.nom}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-200" />
                                                    </div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                                    {isPromo && (
                                                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                                                            -{discount}%
                                                        </span>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <span className="px-1.5 py-0.5 bg-gray-800 text-white text-[10px] font-medium rounded">
                                                            Rupture
                                                        </span>
                                                    )}
                                                    {product.stock > 0 && product.stock <= 5 && (
                                                        <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-medium rounded">
                                                            Dernières pièces
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick view overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 shadow">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Détails
                                                    </span>
                                                </div>
                                            </Link>

                                            {/* Info */}
                                            <div className="p-2.5">
                                                {product.categorie && (
                                                    <span className="text-[10px] text-[#4DB896] font-medium uppercase tracking-wider">
                                                        {product.categorie.nom}
                                                    </span>
                                                )}
                                                <Link to={`/shop/${product.id}`}>
                                                    <h3 className="font-medium text-gray-900 line-clamp-1 mt-0.5 text-sm hover:text-[#4DB896] transition-colors leading-snug">
                                                        {product.nom}
                                                    </h3>
                                                </Link>

                                                {/* Price row */}
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className={`text-sm font-bold ${isPromo ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {fmtPrice(displayPrice)} <span className="text-[10px] font-normal text-gray-500">FCFA</span>
                                                    </span>
                                                    {isPromo && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {fmtPrice(product.prix)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock + Cart row */}
                                                <div className="flex items-center justify-between mt-2">
                                                    {product.stock > 0 ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-green-600">
                                                            <Check className="h-3 w-3" />
                                                            En stock
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-red-500">Indisponible</span>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleAddToCart(e, product)}
                                                        disabled={product.stock === 0}
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            addedToCart === product.id
                                                                ? 'bg-green-500 text-white'
                                                                : product.stock === 0
                                                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                                    : 'bg-[#4DB896] hover:bg-[#3da07e] text-white'
                                                        }`}
                                                        title={addedToCart === product.id ? 'Ajouté !' : 'Ajouter au panier'}
                                                    >
                                                        {addedToCart === product.id ? (
                                                            <Check className="h-4 w-4" />
                                                        ) : (
                                                            <ShoppingCart className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && !error && totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                                                    onClick={() => { setCurrentPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                                                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                                        currentPage === p
                                                            ? 'bg-[#4DB896] text-white shadow-sm'
                                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )
                                    }

                                    <button
                                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust banner */}
            <section className="bg-white border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#4DB896]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Truck className="h-6 w-6 text-[#4DB896]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Livraison rapide</p>
                                <p className="text-xs text-gray-500">Douala 24-48h</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#4DB896]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-[#4DB896]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Pièces garanties</p>
                                <p className="text-xs text-gray-500">Certifiées constructeur</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#4DB896]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Package className="h-6 w-6 text-[#4DB896]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Retrait boutique</p>
                                <p className="text-xs text-gray-500">Bonamoussadi, Douala</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#4DB896]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Star className="h-6 w-6 text-[#4DB896]" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">956+ avis</p>
                                <p className="text-xs text-gray-500">Clients satisfaits</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
