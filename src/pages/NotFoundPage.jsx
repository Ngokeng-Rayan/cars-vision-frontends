import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Illustration */}
                <div className="mb-8">
                    <div className="text-[120px] font-extrabold text-gray-100 leading-none select-none">
                        404
                    </div>
                    <div className="relative -mt-8">
                        <Search className="h-20 w-20 text-[#4DB896] mx-auto opacity-80" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Page introuvable
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                    Vérifiez l'adresse ou retournez à l'accueil.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#4DB896] text-white font-medium rounded-lg hover:bg-[#3da07d] transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        Retour à l'accueil
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Page précédente
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">Vous cherchez peut-être :</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {[
                            { to: '/shop', label: 'Boutique' },
                            { to: '/services', label: 'Services' },
                            { to: '/appointments', label: 'Rendez-vous' },
                            { to: '/contact', label: 'Contact' },
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
