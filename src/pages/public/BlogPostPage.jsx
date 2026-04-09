import { useState, useEffect } from 'react'
import { getImageUrl } from '../../utils/imageUrl'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Eye, ChevronLeft, Package } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { blogService } from '../../services/blogService'

export default function BlogPostPage() {
    const { slug } = useParams()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadArticle()
    }, [slug])

    const loadArticle = async () => {
        try {
            setLoading(true)
            const res = await blogService.getArticle(slug)
            setArticle(res?.data || res)
        } catch (err) {
            console.error('Erreur chargement article:', err)
            setError(err)
        } finally {
            setLoading(false)
        }
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

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Article introuvable</h2>
                    <p className="text-gray-600 mb-6">Cet article n'existe pas ou a été supprimé</p>
                    <Link to="/blog" className="btn-primary inline-block">
                        Retour au blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO title={`${article.titre} | Cars Vision Auto`} description={article.meta_description || article.resume || article.contenu?.substring(0, 160)} keywords={article.meta_keywords || 'blog auto, Douala'} />
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to="/" className="hover:text-primary">Accueil</Link>
                        <span>/</span>
                        <Link to="/blog" className="hover:text-primary">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-900">{article.titre}</span>
                    </nav>
                </div>
            </div>

            <article className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back Button */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Retour au blog
                    </Link>

                    {/* Article Header */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        {article.image && (
                            <div className="h-96 bg-gray-100">
                                <img
                                    src={getImageUrl(article.image)}
                                    alt={article.titre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {article.titre}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>
                                        {new Date(article.date_publication || article.cree_le).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {article.auteur && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        <span>{article.auteur}</span>
                                    </div>
                                )}
                                {article.vues > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        <span>{article.vues} vues</span>
                                    </div>
                                )}
                            </div>

                            {article.resume && (
                                <p className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b">
                                    {article.resume}
                                </p>
                            )}

                            <div
                                className="prose prose-lg max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: article.contenu }}
                            />
                        </div>
                    </div>

                    {/* Back to Blog */}
                    <div className="text-center">
                        <Link to="/blog" className="btn-secondary inline-block">
                            Voir tous les articles
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    )
}
