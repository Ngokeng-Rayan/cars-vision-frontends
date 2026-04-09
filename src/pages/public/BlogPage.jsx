import { useState, useEffect } from 'react'
import { getImageUrl } from '../../utils/imageUrl'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Search, Package } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { blogService } from '../../services/blogService'

export default function BlogPage() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        try {
            const res = await blogService.getPublishedArticles()
            const list = res?.data || res
            setArticles(Array.isArray(list) ? list : [])
        } catch (err) {
            console.error('Erreur chargement articles:', err)
            setArticles([])
        } finally {
            setLoading(false)
        }
    }

    const filteredArticles = articles.filter(article =>
        article.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.resume?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col min-h-screen">
            <SEO title="Blog Auto - Conseils & Actualités | Cars Vision Auto" description="Conseils d'entretien, actualités automobiles et guides pratiques pour votre véhicule." keywords="blog auto, conseils entretien voiture, actualités automobile, Douala" />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm mb-4">
                        Blog
                    </span>
                    <h1 className="text-5xl font-bold mb-4">
                        Actualités & Conseils Auto
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Découvrez nos articles, conseils d'entretien et actualités automobiles
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Search */}
            <section className="py-8 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12 flex-1">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement...</p>
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Aucun article trouvé</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    to={`/blog/${article.slug}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="h-48 bg-gray-100">
                                        {article.image ? (
                                            <img
                                                src={getImageUrl(article.image)}
                                                alt={article.titre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                            {article.titre}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {article.resume}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(article.date_publication || article.cree_le).toLocaleDateString('fr-FR')}
                                            </div>
                                            {article.vues > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {article.vues}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
