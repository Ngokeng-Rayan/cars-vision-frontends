import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect')
    const { setAuth } = useAuthStore()
    const { guestToken, setGuestToken } = useCartStore()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        mot_de_passe: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validation
        if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.mot_de_passe) {
            setError('Tous les champs sont obligatoires')
            setLoading(false)
            return
        }

        if (formData.mot_de_passe !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            setLoading(false)
            return
        }

        if (formData.mot_de_passe.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            setLoading(false)
            return
        }

        try {
            // PHASE 1.1 FIX : Envoyer guest_token pour fusion panier
            const { confirmPassword, ...dataToSend } = formData
            if (guestToken) {
                dataToSend.guest_token = guestToken
            }

            const response = await api.post('/auth/register', dataToSend)
            const { utilisateur, accessToken, refreshToken, panier } = response.data

            // PHASE 1.1 FIX : Connecter automatiquement après inscription
            if (accessToken && utilisateur) {
                setAuth(utilisateur, accessToken, refreshToken)

                // Synchroniser panier Zustand avec panier fusionné du backend
                if (panier?.articles) {
                    const cartStore = useCartStore.getState()
                    cartStore.clearCart()
                    panier.articles.forEach(article => {
                        cartStore.addItem({
                            id: article.produit_id,
                            nom: article.produit?.nom || article.nom,
                            prix: article.prix,
                            images: article.produit?.images || []
                        }, article.quantite)
                    })
                    // Nettoyer le guest token
                    setGuestToken(null)
                }
            }

            setSuccess(true)

            // Redirection après 2 secondes
            setTimeout(() => {
                if (utilisateur?.role === 'admin') {
                    navigate('/admin/dashboard')
                } else {
                    navigate(redirectTo || '/')
                }
            }, 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Créer un compte</h1>
                    <p className="text-gray-600">
                        Rejoignez Cars Vision Auto et profitez de nos services
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
                        <p className="text-gray-600 mt-1">
                            Remplissez le formulaire pour créer votre compte
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="nom"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="prenom"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        placeholder="Votre prénom"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                                Téléphone *
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="+237 6XX XXX XXX"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="mot_de_passe"
                                    name="mot_de_passe"
                                    value={formData.mot_de_passe}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 6 caractères
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${formData.confirmPassword && formData.mot_de_passe !== formData.confirmPassword
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.mot_de_passe !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">
                                    Les mots de passe ne correspondent pas
                                </p>
                            )}
                        </div>


                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">
                                    Compte créé avec succès ! Redirection en cours...
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (formData.confirmPassword && formData.mot_de_passe !== formData.confirmPassword)}
                            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Création du compte...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="mt-6 space-y-4">
                        <div className="text-center text-sm text-gray-600">
                            Vous avez déjà un compte ?{' '}
                            <Link to={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-primary hover:underline font-medium">
                                Se connecter
                            </Link>
                        </div>
                        <div className="text-center">
                            <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                                ← Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
