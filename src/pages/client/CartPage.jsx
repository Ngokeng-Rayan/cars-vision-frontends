import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Package, Truck, Shield, CreditCard } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import { getImageUrl } from '../../utils/imageUrl'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } = useCartStore()
    const { isAuthenticated } = useAuthStore()
    const navigate = useNavigate()

    const fmtPrice = (price) => new Intl.NumberFormat('fr-FR').format(price)

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout')
        } else {
            navigate('/checkout')
        }
    }


    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="container mx-auto px-4 max-w-2xl text-center">
                    <div className="bg-white rounded-2xl shadow-sm p-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="h-12 w-12 text-gray-300" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Parcourez notre boutique et trouvez les pièces automobiles dont vous avez besoin.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                        >
                            Voir la boutique
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
                        <p className="text-gray-500 mt-1">{getItemCount()} article{getItemCount() > 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                    >
                        <Trash2 className="h-4 w-4" />
                        Vider le panier
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.produit_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow">
                                <div className="flex gap-4 md:gap-6">
                                    {/* Image */}
                                    <Link to={`/shop/${item.produit_id}`} className="flex-shrink-0">
                                        {item.image ? (
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.nom}
                                                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 md:w-28 md:h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Package className="h-8 w-8 text-gray-300" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/shop/${item.produit_id}`}>
                                            <h3 className="font-semibold text-gray-900 hover:text-[#4DB896] transition-colors line-clamp-2">
                                                {item.nom}
                                            </h3>
                                        </Link>
                                        <p className="text-lg font-bold text-[#4DB896] mt-1">
                                            {fmtPrice(item.prix)} FCFA
                                        </p>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity controls */}
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.produit_id, item.quantite - 1)}
                                                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-2 font-medium text-gray-900 bg-gray-50 min-w-[48px] text-center">
                                                    {item.quantite}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.produit_id, item.quantite + 1)}
                                                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Subtotal + remove */}
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-gray-900 hidden sm:block">
                                                    {fmtPrice(item.prix * item.quantite)} FCFA
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.produit_id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-[#4DB896] hover:underline font-medium mt-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continuer mes achats
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé de la commande</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sous-total ({getItemCount()} articles)</span>
                                    <span className="font-medium">{fmtPrice(getTotal())} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Livraison</span>
                                    <span className="text-[#4DB896] font-medium">Calculée ensuite</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#4DB896]">{fmtPrice(getTotal())} FCFA</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#4DB896] hover:bg-[#3da07e] text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
                            >
                                <CreditCard className="h-5 w-5" />
                                Passer la commande
                            </button>

                            {!isAuthenticated && (
                                <p className="text-xs text-center text-gray-400 mt-3">
                                    Connectez-vous ou passez commande en tant qu'invité
                                </p>
                            )}

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-100">
                                <div className="text-center">
                                    <Truck className="h-5 w-5 text-[#4DB896] mx-auto mb-1" />
                                    <p className="text-[10px] text-gray-500 leading-tight">Livraison Douala 24-48h</p>
                                </div>
                                <div className="text-center">
                                    <Shield className="h-5 w-5 text-[#4DB896] mx-auto mb-1" />
                                    <p className="text-[10px] text-gray-500 leading-tight">Pièces garanties</p>
                                </div>
                                <div className="text-center">
                                    <CreditCard className="h-5 w-5 text-[#4DB896] mx-auto mb-1" />
                                    <p className="text-[10px] text-gray-500 leading-tight">Paiement sécurisé</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
