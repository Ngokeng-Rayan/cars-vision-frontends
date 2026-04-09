import { useState } from 'react'
import { Mail } from 'lucide-react'
import { newsletterService } from '../../services/newsletterService'

const NewsletterForm = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await newsletterService.subscribe(email)
            setMessage({
                type: 'success',
                text: 'Merci! Vous êtes maintenant inscrit à notre newsletter.'
            })
            setEmail('')
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
            </form>

            {message.text && (
                <div className={`mt-3 text-sm text-center ${message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <p className="mt-3 text-xs text-gray-400 text-center">
                Vous pouvez vous désabonner à tout moment.{' '}
                <a href="/unsubscribe" className="text-primary hover:underline">
                    Se désabonner
                </a>
            </p>
        </div>
    )
}

export default NewsletterForm
