import { useState } from 'react'
import { Mail, CheckCircle, XCircle } from 'lucide-react'
import { newsletterService } from '../../services/newsletterService'

const UnsubscribePage = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleUnsubscribe = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            console.log('📧 Tentative de désabonnement pour:', email)
            const result = await newsletterService.unsubscribe(email)
            console.log('✅ Résultat:', result)
            setMessage({
                type: 'success',
                text: 'Vous avez été désabonné avec succès de notre newsletter.'
            })
            setEmail('')
        } catch (error) {
            console.error('❌ Erreur complète:', error)
            console.error('❌ Erreur response:', error.response)
            console.error('❌ Erreur message:', error.message)
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Une erreur est survenue. Veuillez réessayer.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 rounded-full p-4">
                            <Mail className="h-12 w-12 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Se désabonner de la newsletter
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Nous sommes désolés de vous voir partir. Entrez votre adresse email pour vous désabonner.
                    </p>

                    {/* Form */}
                    {!message.type && (
                        <form onSubmit={handleUnsubscribe} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Traitement...' : 'Me désabonner'}
                            </button>
                        </form>
                    )}

                    {/* Success Message */}
                    {message.type === 'success' && (
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <p className="text-green-800 mb-6">{message.text}</p>
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                            >
                                Retour à l'accueil
                            </a>
                        </div>
                    )}

                    {/* Error Message */}
                    {message.type === 'error' && (
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <p className="text-red-800 mb-6">{message.text}</p>
                            <button
                                onClick={() => setMessage({ type: '', text: '' })}
                                className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Vous ne recevrez plus d'emails de notre part. Vous pouvez vous réabonner à tout moment depuis notre site.
                        </p>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <a href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                        ← Retour à l'accueil
                    </a>
                </div>
            </div>
        </div>
    )
}

export default UnsubscribePage
