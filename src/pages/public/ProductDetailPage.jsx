import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Star, Package, Truck, Shield, Check, Minus, Plus, ChevronLeft, AlertCircle, MapPin, Phone } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { productService } from '../../services/productService'
import { reviewService } from '../../services/reviewService'
import { getProductImageUrl, getImageUrl } from '../../utils/imageUrl'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const addItem = useCartStore((state) => state.addItem)
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const { isAuthenticated, user } = useAuthStore()
    const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' })
    const [reviewSubmitting, setReviewSubmitting] = useState(false)
    const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        loadProductDetails()
        window.scrollTo(0, 0)
    }, [id])

    const loadProductDetails = async () => {
        try {
            setLoading(true)
            const productRes = await productService.getById(id)
            const productData = productRes?.produit || productRes
            setProduct(productData)
            const reviewsData = await reviewService.getProductReviews(id).catch(() => [])
            setReviews(Array.isArray(reviewsData) ? reviewsData : (reviewsData?.avis || []))
        } catch (err) {
            console.error('Erreur chargement produit:', err)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const fmtPrice = (price) => new Intl.NumberFormat('fr-FR').format(price)

    const handleAddToCart = () => {
        addItem(product, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!isAuthenticated) return
        setReviewSubmitting(true)
        setReviewMessage({ type: '', text: '' })
        try {
            await reviewService.createReview(id, reviewForm)
            setReviewMessage({ type: 'success', text: 'Merci ! Votre avis a été soumis et sera visible après modération.' })
            setReviewForm({ note: 5, commentaire: '' })
            const reviewsData = await reviewService.getProductReviews(id).catch(() => [])
            setReviews(Array.isArray(reviewsData) ? reviewsData : (reviewsData?.avis || []))
        } catch (err) {
            setReviewMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'envoi de votre avis' })
        } finally {
            setReviewSubmitting(false)
        }
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + (r.note || 0), 0) / reviews.length
        : 0

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#4DB896] border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement du produit...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h2>
                    <p className="text-gray-500 mb-6">Ce produit n'existe pas ou n'est plus disponible.</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="inline-flex items-center gap-2 bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Retour à la boutique
                    </button>
                </div>
            </div>
        )
    }

    const images = product.images || []

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title={`${product.nom} - Cars Vision Auto`} description={product.description?.substring(0, 160) || `Achetez ${product.nom} chez Cars Vision Auto à Douala`} keywords={`${product.nom}, pièces auto, Douala`} />
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-[#4DB896] transition-colors">Accueil</Link>
                        <span className="text-gray-300">/</span>
                        <Link to="/shop" className="hover:text-[#4DB896] transition-colors">Boutique</Link>
                        {product.categorie && (
                            <>
                                <span className="text-gray-300">/</span>
                                <Link to="/shop" className="hover:text-[#4DB896] transition-colors">{product.categorie.nom}</Link>
                            </>
                        )}
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.nom}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-10">
                {/* Main Product Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="grid md:grid-cols-2">
                        {/* Images Gallery */}
                        <div className="p-4 md:p-8 bg-gray-50">
                            {/* Main Image */}
                            <div className="relative rounded-xl overflow-hidden bg-white mb-4 aspect-square flex items-center justify-center">
                                {images.length > 0 ? (
                                    <img
                                        src={getProductImageUrl(images, selectedImage)}
                                        alt={product.nom}
                                        className="w-full h-full object-contain max-h-[500px]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <Package className="h-32 w-32 text-gray-200" />
                                    </div>
                                )}

                                {/* Navigation arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors rotate-180"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </>
                                )}

                                {/* Image counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-[#4DB896] ring-2 ring-[#4DB896]/20'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={typeof img === 'string' ? getImageUrl(img) : getImageUrl(img.url)}
                                                alt={`${product.nom} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6 md:p-8 flex flex-col">
                            {/* Category */}
                            {product.categorie && (
                                <Link to="/shop" className="inline-flex items-center gap-1 text-[#4DB896] text-sm font-medium uppercase tracking-wider mb-2 hover:underline w-fit">
                                    {product.categorie.nom}
                                </Link>
                            )}

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                {product.nom}
                            </h1>

                            {/* Rating */}
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < Math.round(averageRating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {averageRating.toFixed(1)} ({reviews.length} avis)
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            {(() => {
                                const isPromo = product.en_promotion && product.prix_promotion
                                const displayPrice = isPromo ? product.prix_promotion : product.prix
                                const discount = isPromo && product.prix ? Math.round((1 - product.prix_promotion / product.prix) * 100) : 0
                                return (
                                    <div className="mb-5">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={`text-3xl md:text-4xl font-bold ${isPromo ? 'text-red-600' : 'text-gray-900'}`}>
                                                {fmtPrice(displayPrice)} <span className="text-lg text-gray-500 font-normal">FCFA</span>
                                            </span>
                                            {isPromo && (
                                                <>
                                                    <span className="text-xl text-gray-400 line-through">{fmtPrice(product.prix)} FCFA</span>
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-lg">-{discount}%</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* Short description */}
                            {product.description && (
                                <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4"></div>

                            {/* Stock Status */}
                            <div className="mb-5">
                                {product.stock > 10 ? (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                                        <span className="text-green-700 font-medium text-sm">En stock</span>
                                    </div>
                                ) : product.stock > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
                                        <span className="text-orange-700 font-medium text-sm">
                                            Plus que {product.stock} en stock
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                        <span className="text-red-700 font-medium text-sm">Rupture de stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity + Add to Cart */}
                            {product.stock > 0 && (
                                <div className="flex gap-3 mb-5">
                                    {/* Quantity */}
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-4 py-3 font-semibold text-gray-900 min-w-[48px] text-center bg-gray-50">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            className="px-3 py-3 hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-30"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-bold text-lg transition-all ${
                                            addedToCart
                                                ? 'bg-green-500 text-white'
                                                : 'bg-[#4DB896] hover:bg-[#3da07e] text-white shadow-lg shadow-[#4DB896]/25 hover:shadow-xl hover:shadow-[#4DB896]/30'
                                        }`}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <Check className="h-6 w-6" />
                                                Ajouté au panier !
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="h-6 w-6" />
                                                Ajouter au panier
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {product.stock === 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-center">
                                    <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                                    <p className="text-red-700 font-medium">Ce produit est actuellement en rupture de stock</p>
                                    <p className="text-red-500 text-sm mt-1">Contactez-nous pour connaître la date de réapprovisionnement</p>
                                </div>
                            )}

                            {/* Added to cart success bar */}
                            {addedToCart && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-600" />
                                        <span className="text-green-800 text-sm font-medium">Produit ajouté au panier</span>
                                    </div>
                                    <Link
                                        to="/cart"
                                        className="text-sm font-semibold text-green-700 hover:text-green-900 underline"
                                    >
                                        Voir le panier
                                    </Link>
                                </div>
                            )}

                            {/* Spacer to push trust badges to bottom */}
                            <div className="flex-1"></div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Truck className="h-5 w-5 text-[#4DB896] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">Livraison rapide</p>
                                        <p className="text-[10px] text-gray-500">Douala 24-48h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Shield className="h-5 w-5 text-[#4DB896] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">Pièce garantie</p>
                                        <p className="text-[10px] text-gray-500">Certifiée constructeur</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <MapPin className="h-5 w-5 text-[#4DB896] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">Retrait gratuit</p>
                                        <p className="text-[10px] text-gray-500">Bonamoussadi, Douala</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Phone className="h-5 w-5 text-[#4DB896] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">Conseil expert</p>
                                        <p className="text-[10px] text-gray-500">+237 676 889 008</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs: Description / Reviews */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tab headers */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors relative ${
                                activeTab === 'description'
                                    ? 'text-[#4DB896]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Description
                            {activeTab === 'description' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DB896]"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-4 px-6 text-sm font-semibold transition-colors relative ${
                                activeTab === 'reviews'
                                    ? 'text-[#4DB896]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Avis clients ({reviews.length})
                            {activeTab === 'reviews' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DB896]"></div>
                            )}
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className="p-6 md:p-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                                    {product.description || 'Aucune description disponible pour ce produit. Contactez-nous pour plus d\'informations.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div>
                                {reviews.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Star className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-500 text-lg mb-1">Aucun avis pour le moment</p>
                                        <p className="text-gray-400 text-sm">Soyez le premier à donner votre avis !</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Average rating summary */}
                                        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl mb-6">
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                                                <div className="flex mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < Math.round(averageRating)
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{reviews.length} avis</p>
                                            </div>
                                        </div>

                                        {reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-100 pb-5 last:border-b-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-[#4DB896]/10 rounded-full flex items-center justify-center text-[#4DB896] font-bold text-sm">
                                                            {(review.utilisateur?.prenom?.[0] || review.utilisateur?.nom?.[0] || 'C').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {review.utilisateur?.prenom || ''} {review.utilisateur?.nom || 'Client'}
                                                            </p>
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3 w-3 ${
                                                                            i < (review.note || 0)
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-200'
                                                                        }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(review.cree_le).toLocaleDateString('fr-FR', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm ml-12">{review.commentaire}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Review submission form */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Laisser un avis</h3>
                                    {!isAuthenticated ? (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                                            <p className="text-amber-800 text-sm">
                                                Vous devez <Link to={`/login?redirect=/products/${id}`} className="font-semibold underline">vous connecter</Link> pour laisser un avis.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewForm(prev => ({ ...prev, note: star }))}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`h-7 w-7 transition-colors ${
                                                                    star <= reviewForm.note
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300 hover:text-yellow-300'
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Votre commentaire</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={reviewForm.commentaire}
                                                    onChange={(e) => setReviewForm(prev => ({ ...prev, commentaire: e.target.value }))}
                                                    placeholder="Partagez votre expérience avec ce produit..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm resize-none"
                                                />
                                            </div>

                                            {reviewMessage.text && (
                                                <div className={`p-3 rounded-lg text-sm ${
                                                    reviewMessage.type === 'success'
                                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                                        : 'bg-red-50 text-red-800 border border-red-200'
                                                }`}>
                                                    {reviewMessage.text}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={reviewSubmitting || !reviewForm.commentaire.trim()}
                                                className="px-6 py-2.5 bg-[#4DB896] text-white rounded-xl font-semibold hover:bg-[#3da07e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                {reviewSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to shop */}
                <div className="mt-8 text-center">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-[#4DB896] hover:underline font-medium"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Retour à la boutique
                    </Link>
                </div>
            </div>
        </div>
    )
}
