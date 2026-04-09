import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas/authSchemas'
import api from '../../lib/api'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { setAuth } = useAuthStore()
    const { guestToken, setGuestToken } = useCartStore()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    // PHASE 3.1 : React Hook Form + Zod
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            mot_de_passe: ''
        }
    })

    const onSubmit = async (formData) => {
        setError('')

        try {
            // PHASE 1.1 FIX : Envoyer guest_token pour fusion panier
            const payload = { ...formData }
            if (guestToken) {
                payload.guest_token = guestToken
            }

            const response = await api.post('/auth/login', payload)
            const { utilisateur, panier } = response.data

            // Le backend retourne accessToken
            const authToken = response.data.accessToken || response.data.token
            const authRefreshToken = response.data.refreshToken

            if (!authToken || !utilisateur) {
                setError('Réponse invalide du serveur')
                return
            }

            // Sauvegarder dans le store Zustand (qui sauvegarde aussi dans localStorage)
            setAuth(utilisateur, authToken, authRefreshToken)

            // PHASE 1.1 FIX : Synchroniser panier Zustand avec panier fusionné du backend
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
                // Nettoyer le guest token car maintenant connecté
                setGuestToken(null)
            }

            // Redirection selon le rôle ou redirect param
            const redirectTo = searchParams.get('redirect')
            if (redirectTo) {
                navigate(redirectTo)
            } else if (utilisateur.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/profile')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Connexion</h1>
                    <p className="text-gray-600">
                        Accédez à votre compte Cars Vision Auto
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Se connecter</h2>
                        <p className="text-gray-600 mt-1">
                            Entrez vos identifiants pour accéder à votre compte
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="votre@email.com"
                                    {...register('email')}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mot_de_passe" className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="mot_de_passe"
                                    placeholder="••••••••"
                                    {...register('mot_de_passe')}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                        errors.mot_de_passe ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.mot_de_passe && (
                                    <p className="text-sm text-red-500 mt-1">{errors.mot_de_passe.message}</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                                <span className="text-sm text-gray-600">Se souvenir de moi</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    {searchParams.get('redirect')?.includes('checkout') && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">ou</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/checkout')}
                                className="mt-4 w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Continuer sans compte
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-2">
                                Vous pourrez passer votre commande en renseignant votre email
                            </p>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <div className="text-center text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link to={`/register${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect'))}` : ''}`} className="text-primary hover:underline font-medium">
                                Créer un compte
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
