import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, XCircle, Search, MapPin, Calendar } from 'lucide-react'
import api from '../../lib/api'

const STATUTS = {
    EN_ATTENTE: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50', step: 0 },
    CONFIRMEE: { label: 'Confirmée', icon: CheckCircle, color: 'text-blue-600 bg-blue-50', step: 1 },
    EXPEDIEE: { label: 'Expédiée', icon: Truck, color: 'text-indigo-600 bg-indigo-50', step: 2 },
    LIVREE: { label: 'Livrée', icon: CheckCircle, color: 'text-green-600 bg-green-50', step: 3 },
    ANNULEE: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-50', step: -1 },
}

const STEPS = ['En attente', 'Confirmée', 'Expédiée', 'Livrée']

export default function TrackingPage() {
    const [searchParams] = useSearchParams()
    const [token, setToken] = useState(searchParams.get('token') || '')
    const [commande, setCommande] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // Si token dans l'URL, chercher automatiquement
        if (searchParams.get('token')) {
            handleSearch(searchParams.get('token'))
        }
    }, [])

    const handleSearch = async (tokenToSearch = token) => {
        if (!tokenToSearch.trim()) {
            setError('Veuillez saisir un numéro de suivi.')
            return
        }
        setLoading(true)
        setError('')
        setCommande(null)

        try {
            const { data } = await api.get(`/commandes/suivre/${tokenToSearch.trim()}`)
            setCommande(data.commande || data.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Commande introuvable. Vérifiez votre numéro de suivi.')
        } finally {
            setLoading(false)
        }
    }

    const statut = commande ? (STATUTS[commande.statut] || STATUTS.EN_ATTENTE) : null

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-[#4DB896]/10 rounded-2xl mb-4">
                        <Package className="h-10 w-10 text-[#4DB896]" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivi de commande</h1>
                    <p className="text-gray-600">
                        Entrez votre numéro de suivi reçu par email pour localiser votre commande.
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de suivi
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ex : a1b2c3d4-e5f6-..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DB896] focus:border-transparent outline-none font-mono text-sm"
                        />
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4DB896] text-white font-medium rounded-lg hover:bg-[#3da07d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Search className="h-4 w-4" />
                            {loading ? 'Recherche...' : 'Suivre'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <XCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Result */}
                {commande && statut && (
                    <div className="space-y-4">
                        {/* Status card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Commande #{commande.numero_commande}
                                    </h2>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(commande.cree_le).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${statut.color}`}>
                                    <statut.icon className="h-4 w-4" />
                                    {statut.label}
                                </div>
                            </div>

                            {/* Progress bar */}
                            {commande.statut !== 'ANNULEE' && (
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        {STEPS.map((step, i) => (
                                            <div key={step} className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                                    i <= statut.step
                                                        ? 'bg-[#4DB896] text-white'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {i < statut.step ? '✓' : i + 1}
                                                </div>
                                                <span className={`text-xs mt-1 ${i <= statut.step ? 'text-[#4DB896] font-medium' : 'text-gray-400'}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                                        <div
                                            className="h-full bg-[#4DB896] transition-all duration-700"
                                            style={{ width: `${(statut.step / 3) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Détails de la commande</h3>
                            <div className="space-y-3">
                                {commande.articles?.map((article) => (
                                    <div key={article.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {article.produit?.nom || 'Produit'}
                                            </p>
                                            <p className="text-sm text-gray-500">Qté : {article.quantite}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {new Intl.NumberFormat('fr-FR').format(article.prix * article.quantite)} FCFA
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-[#4DB896]">
                                        {new Intl.NumberFormat('fr-FR').format(commande.total)} FCFA
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery info */}
                        {commande.adresse_livraison && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#4DB896]" />
                                    Livraison
                                </h3>
                                <p className="text-gray-600 text-sm">{commande.adresse_livraison}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Aide */}
                {!commande && !loading && (
                    <div className="text-center text-sm text-gray-500">
                        Numéro de suivi reçu par email lors de la confirmation de commande.{' '}
                        <Link to="/contact" className="text-[#4DB896] hover:underline">
                            Contactez-nous
                        </Link>{' '}
                        si vous ne le trouvez pas.
                    </div>
                )}
            </div>
        </div>
    )
}
