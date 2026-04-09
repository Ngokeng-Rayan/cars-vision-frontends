import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, MapPin, CreditCard, User, Mail, Phone, LogIn, CheckCircle } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { zoneService } from '../../services/zoneService'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'

const CheckoutPage = () => {
    const navigate = useNavigate()
    const { items: cart, getTotal, clearCart } = useCartStore()
    const { isAuthenticated, user } = useAuthStore()
    const [zones, setZones] = useState([])
    const [loading, setLoading] = useState(false)
    const [guestSuccess, setGuestSuccess] = useState(null)
    const [formData, setFormData] = useState({
        nom_invite: '',
        email_invite: '',
        adresse_livraison: '',
        telephone_livraison: '',
        zone_livraison_id: '',
        notes: ''
    })

    useEffect(() => {
        loadZones()
    }, [])

    const loadZones = async () => {
        try {
            const data = await zoneService.getZones()
            const zonesArr = Array.isArray(data) ? data : (data?.zones || data?.data || [])
            setZones(zonesArr)
        } catch (error) {
            console.error('Erreur chargement zones:', error)
            setZones([])
        }
    }

    const fmtPrice = (price) => new Intl.NumberFormat('fr-FR').format(price)
    const selectedZone = Array.isArray(zones) ? zones.find(z => String(z.id) === String(formData.zone_livraison_id)) : null
    const sousTotal = getTotal()
    const fraisLivraison = parseFloat(selectedZone?.frais || selectedZone?.frais_livraison || 0)
    const total = sousTotal + fraisLivraison

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const produitsPayload = cart.map(item => ({
                produit_id: item.produit_id,
                quantite: item.quantite,
                prix_unitaire: item.prix
            }))

            if (isAuthenticated) {
                await orderService.createOrder({
                    adresse_livraison: formData.adresse_livraison,
                    telephone_livraison: formData.telephone_livraison,
                    zone_livraison_id: formData.zone_livraison_id,
                    notes: formData.notes,
                    produits: produitsPayload
                })
                clearCart()
                navigate('/profile', {
                    state: { message: 'Commande créée avec succès!' }
                })
            } else {
                const result = await orderService.createGuestOrder({
                    nom_invite: formData.nom_invite,
                    email_invite: formData.email_invite,
                    telephone_invite: formData.telephone_livraison,
                    adresse_livraison: formData.adresse_livraison,
                    telephone_livraison: formData.telephone_livraison,
                    zone_livraison_id: formData.zone_livraison_id,
                    notes: formData.notes,
                    produits: produitsPayload
                })
                clearCart()
                setGuestSuccess({
                    numero: result.commande?.numero_commande,
                    email: formData.email_invite
                })
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de la commande')
        } finally {
            setLoading(false)
        }
    }

    if (guestSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="max-w-md w-full mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Commande confirmée !</h2>
                    {guestSuccess.numero && (
                        <p className="text-sm text-gray-500 mb-4">
                            N° de commande : <span className="font-semibold text-gray-800">{guestSuccess.numero}</span>
                        </p>
                    )}
                    <p className="text-gray-600 mb-6">
                        Un email de confirmation a été envoyé à <span className="font-medium text-gray-800">{guestSuccess.email}</span>.
                        Vous recevrez votre facture par email une fois la commande livrée.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                    >
                        Continuer mes achats
                    </button>
                </div>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Panier vide</h2>
                    <p className="text-gray-600 mb-6">Ajoutez des produits avant de passer commande</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                    >
                        Voir la boutique
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Finaliser la commande</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Formulaire */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Bandeau connexion pour les invités */}
                            {!isAuthenticated && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <LogIn className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">Vous avez déjà un compte ?</p>
                                            <p className="text-xs text-blue-600">Connectez-vous pour un suivi facilité de vos commandes</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/login?redirect=/checkout"
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Se connecter
                                    </Link>
                                </div>
                            )}

                            {/* Infos invité (si non connecté) */}
                            {!isAuthenticated && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="text-[#4DB896]" />
                                        Vos informations
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom complet *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.nom_invite}
                                                    onChange={(e) => setFormData({ ...formData, nom_invite: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                                    placeholder="Jean Dupont"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email_invite}
                                                    onChange={(e) => setFormData({ ...formData, email_invite: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                                    placeholder="votre@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Informations de livraison */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="text-[#4DB896]" />
                                    Informations de livraison
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Adresse complète *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.adresse_livraison}
                                            onChange={(e) => setFormData({ ...formData, adresse_livraison: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                            placeholder="Ex: Rue 123, Quartier XYZ"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zone de livraison *
                                        </label>
                                        <select
                                            required
                                            value={formData.zone_livraison_id}
                                            onChange={(e) => setFormData({ ...formData, zone_livraison_id: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                        >
                                            <option value="">Sélectionner une zone</option>
                                            {Array.isArray(zones) && zones.map(zone => (
                                                <option key={zone.id} value={zone.id}>
                                                    {zone.nom} - {fmtPrice(zone.frais_livraison)} FCFA
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléphone *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                required
                                                value={formData.telephone_livraison}
                                                onChange={(e) => setFormData({ ...formData, telephone_livraison: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                                placeholder="+237 6XX XXX XXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes (optionnel)
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent"
                                            rows="3"
                                            placeholder="Instructions de livraison..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mode de paiement */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="text-[#4DB896]" />
                                    Mode de paiement
                                </h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-blue-800 font-medium">Paiement à la livraison</p>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Vous paierez en espèces lors de la réception de votre commande
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4DB896] hover:bg-[#3da07e] text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg disabled:opacity-50"
                            >
                                {loading ? 'Traitement...' : 'Confirmer la commande'}
                            </button>
                        </form>
                    </div>

                    {/* Récapitulatif */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Récapitulatif</h2>

                            {isAuthenticated && (
                                <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <User className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-green-700 font-medium">{user?.prenom} {user?.nom}</span>
                                </div>
                            )}

                            <div className="space-y-3 mb-4">
                                {cart.map(item => (
                                    <div key={item.produit_id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.nom} x{item.quantite}
                                        </span>
                                        <span className="font-medium">{fmtPrice(item.prix * item.quantite)} FCFA</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sous-total</span>
                                    <span className="font-medium">{fmtPrice(sousTotal)} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Frais de livraison</span>
                                    <span className="font-medium">{fraisLivraison > 0 ? `${fmtPrice(fraisLivraison)} FCFA` : 'À sélectionner'}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-[#4DB896]">{fmtPrice(total)} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
