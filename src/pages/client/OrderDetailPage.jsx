import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, ChevronLeft } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { getImageUrl, getProductImageUrl } from '../../utils/imageUrl'

export default function OrderDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadOrderDetails()
    }, [id])

    const loadOrderDetails = async () => {
        try {
            setLoading(true)
            const data = await orderService.getMyOrderDetails(id)
            setOrder(data?.commande || data)
        } catch (err) {
            console.error('Erreur chargement commande:', err)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette commande?')) return

        try {
            await orderService.cancelOrder(id)
            loadOrderDetails()
            alert('Commande annulée avec succès')
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'annulation')
        }
    }

    const statusSteps = [
        { key: 'EN_ATTENTE', label: 'En attente', icon: Clock },
        { key: 'CONFIRMEE', label: 'Confirmée', icon: CheckCircle },
        { key: 'LIVREE', label: 'Livrée', icon: Truck }
    ]

    const getCurrentStepIndex = (statut) => {
        if (statut === 'ANNULEE') return -1
        return statusSteps.findIndex(step => step.key === statut)
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

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande introuvable</h2>
                    <p className="text-gray-600 mb-6">Cette commande n'existe pas</p>
                    <button onClick={() => navigate('/orders')} className="btn-primary">
                        Retour aux commandes
                    </button>
                </div>
            </div>
        )
    }

    const currentStepIndex = getCurrentStepIndex(order.statut)

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-gray-600 hover:text-primary mb-4 flex items-center gap-2"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Retour aux commandes
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Commande #{order.numero_commande}
                            </h1>
                            <p className="text-gray-600">
                                Passée le {new Date(order.cree_le).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-[#4DB896]">
                                {new Intl.NumberFormat('fr-FR').format(order.total)} FCFA
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                {order.statut !== 'ANNULEE' ? (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Suivi de commande</h2>
                        <div className="relative">
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                />
                            </div>
                            <div className="relative flex justify-between">
                                {statusSteps.map((step, index) => {
                                    const Icon = step.icon
                                    const isCompleted = index <= currentStepIndex
                                    const isCurrent = index === currentStepIndex

                                    return (
                                        <div key={step.key} className="flex flex-col items-center">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isCompleted
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-200 text-gray-400'
                                                    } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <p className={`text-xs text-center ${isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'
                                                }`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 flex items-center gap-4">
                        <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-900">Commande annulée</h3>
                            <p className="text-red-700 text-sm">Cette commande a été annulée</p>
                        </div>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Produits commandés</h2>
                    <div className="space-y-4">
                        {order.articles?.map((item, index) => {
                            const imgUrl = item.produit?.images ? getProductImageUrl(item.produit.images) : null
                            return (
                            <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={item.nom_produit} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.nom_produit}</h3>
                                    <p className="text-sm text-gray-600">Quantité: {item.quantite}</p>
                                    <p className="text-sm text-gray-600">Prix unitaire: {new Intl.NumberFormat('fr-FR').format(item.prix)} FCFA</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">
                                        {new Intl.NumberFormat('fr-FR').format(item.sous_total || (item.prix * item.quantite))} FCFA
                                    </p>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de livraison</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-[#4DB896] flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-medium text-gray-900">Adresse</p>
                                <p className="text-gray-600">{order.adresse_livraison}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-[#4DB896] flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-medium text-gray-900">Téléphone</p>
                                <p className="text-gray-600">{order.telephone_livraison}</p>
                            </div>
                        </div>
                        {order.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900">Email</p>
                                    <p className="text-gray-600">{order.email}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Sous-total</span>
                            <span>{new Intl.NumberFormat('fr-FR').format(order.sous_total)} FCFA</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Frais de livraison</span>
                            <span>{new Intl.NumberFormat('fr-FR').format(order.frais_livraison)} FCFA</span>
                        </div>
                        {order.remise > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Remise</span>
                                <span>-{new Intl.NumberFormat('fr-FR').format(order.remise)} FCFA</span>
                            </div>
                        )}
                        <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-[#4DB896]">{new Intl.NumberFormat('fr-FR').format(order.total)} FCFA</span>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                            <p className="text-gray-600">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {order.statut === 'EN_ATTENTE' && (
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <button
                            onClick={handleCancelOrder}
                            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Annuler la commande
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
