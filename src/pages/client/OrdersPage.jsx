import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { orderService } from '../../services/orderService'

const OrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders()
            setOrders(Array.isArray(data) ? data : (data?.commandes || data?.data || []))
        } catch (error) {
            console.error('Erreur chargement commandes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async (orderId) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette commande?')) return

        try {
            await orderService.cancelOrder(orderId)
            loadOrders()
            alert('Commande annulée avec succès')
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'annulation')
        }
    }

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'EN_ATTENTE': return <Clock className="text-yellow-500 h-4 w-4" />
            case 'CONFIRMEE': return <CheckCircle className="text-blue-500 h-4 w-4" />
            case 'LIVREE': return <Truck className="text-green-500 h-4 w-4" />
            case 'ANNULEE': return <XCircle className="text-red-500 h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    const getStatusLabel = (statut) => {
        const labels = {
            'EN_ATTENTE': 'En attente',
            'CONFIRMEE': 'Confirmée',
            'LIVREE': 'Livrée',
            'ANNULEE': 'Annulée'
        }
        return labels[statut] || statut
    }

    const getStatusColor = (statut) => {
        const colors = {
            'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
            'CONFIRMEE': 'bg-blue-100 text-blue-800',
            'LIVREE': 'bg-green-100 text-green-800',
            'ANNULEE': 'bg-red-100 text-red-800'
        }
        return colors[statut] || 'bg-gray-100 text-gray-800'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Commandes</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package className="mx-auto text-6xl text-gray-400 mb-4 h-16 w-16" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucune commande</h2>
                        <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
                        <a href="/shop" className="btn-primary inline-block">
                            Voir la boutique
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const fmtPrice = (p) => new Intl.NumberFormat('fr-FR').format(p)
                            return (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Commande #{order.numero_commande}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.cree_le).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(order.statut)}`}>
                                                {getStatusIcon(order.statut)}
                                                {getStatusLabel(order.statut)}
                                            </span>
                                            <p className="text-xl font-bold text-[#4DB896]">
                                                {fmtPrice(order.total)} FCFA
                                            </p>
                                        </div>
                                    </div>

                                    {/* Articles commandés */}
                                    {order.articles && order.articles.length > 0 && (
                                        <div className="border-t pt-4">
                                            <h3 className="font-medium text-gray-800 mb-3 text-sm">Produits commandés</h3>
                                            <div className="space-y-2">
                                                {order.articles.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            {item.nom_produit} x{item.quantite}
                                                        </span>
                                                        <span className="font-medium">{fmtPrice(item.sous_total || (item.prix * item.quantite))} FCFA</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-dashed">
                                                <span className="text-gray-500">Sous-total</span>
                                                <span className="font-medium">{fmtPrice(order.sous_total)} FCFA</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Frais de livraison</span>
                                                <span className="font-medium">{fmtPrice(order.frais_livraison)} FCFA</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Adresse de livraison */}
                                    <div className="border-t mt-4 pt-4">
                                        <h3 className="font-medium text-gray-800 mb-2 text-sm">Adresse de livraison</h3>
                                        <p className="text-sm text-gray-600">
                                            {order.adresse_livraison}
                                        </p>
                                        {order.telephone_livraison && (
                                            <p className="text-sm text-gray-600">
                                                Tél: {order.telephone_livraison}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4 mt-6">
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="px-4 py-2 bg-[#4DB896] hover:bg-[#3da07e] text-white rounded-xl text-sm font-semibold transition-colors"
                                        >
                                            Voir détails
                                        </Link>

                                        {order.statut === 'EN_ATTENTE' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                                            >
                                                Annuler la commande
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrdersPage
