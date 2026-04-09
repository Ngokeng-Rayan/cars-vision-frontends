import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Wrench, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react'
// Clock kept for whyChooseUs section
import { serviceService } from '../../services/serviceService'
import { getImageUrl } from '../../utils/imageUrl'

export default function ServicesPage() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadServices()
    }, [])

    const loadServices = async () => {
        try {
            const data = await serviceService.getAll()
            const list = Array.isArray(data) ? data : (data?.services || [])
            setServices(list)
        } catch (err) {
            console.error('Erreur chargement services:', err)
            setServices([])
        } finally {
            setLoading(false)
        }
    }

    const whyChooseUs = [
        {
            icon: Shield,
            title: 'Garantie 3 ans',
            description: 'Tous nos travaux sont garantis pendant 3 ans'
        },
        {
            icon: Clock,
            title: 'Intervention rapide',
            description: 'Rendez-vous sous 24-48h, service express disponible'
        },
        {
            icon: CheckCircle,
            title: 'Pièces d\'origine',
            description: 'Nous utilisons uniquement des pièces de qualité certifiées'
        },
    ]

    return (
        <div className="flex flex-col">
            <SEO title="Nos Services Mécaniques | Cars Vision Auto Douala" description="Services mécaniques professionnels à Douala : entretien, réparation, diagnostic. Prenez rendez-vous en ligne." keywords="services mécaniques, réparation voiture, entretien auto, Douala" />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 animate-fade-in">Nos Services</Badge>
                    <h1 className="text-5xl font-bold mb-4 animate-slide-in-top">
                        Services automobiles professionnels
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
                        De la simple vidange à la révision complète, nos techniciens certifiés prennent soin de votre véhicule
                        avec expertise et professionnalisme.
                    </p>
                </div>

                {/* Vague décorative */}
                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-mint mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Chargement des services...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-12">
                            <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-muted-foreground text-lg">Aucun service disponible pour le moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <Card
                                    key={service.id || index}
                                    className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border hover:border-brand-mint animate-slide-in-bottom overflow-hidden"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Service Image */}
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        {service.image ? (
                                            <img
                                                src={getImageUrl(service.image)}
                                                alt={service.nom}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-dark to-brand-dark-light">
                                                <Wrench className="h-12 w-12 text-white/40" />
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl">{service.nom}</CardTitle>
                                        {service.description && (
                                            <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                                        )}
                                    </CardHeader>

                                    <CardFooter className="pt-4">
                                        <Link to={`/appointments?service=${service.id}`} className="w-full">
                                            <Button className="w-full group/btn">
                                                Réserver ce service
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold mb-3">Pourquoi nous choisir ?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Plus de 400 clients nous font confiance pour l'entretien de leur véhicule
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {whyChooseUs.map((item, index) => (
                            <div
                                key={index}
                                className="text-center group animate-slide-in-bottom"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="bg-brand-mint w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-16 bg-gradient-to-r from-brand-mint to-brand-mint-dark overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
                    <h2 className="text-4xl font-bold text-brand-dark mb-4">
                        Besoin d'un service ?
                    </h2>
                    <p className="text-lg text-brand-dark/80 mb-8 max-w-2xl mx-auto">
                        Prenez rendez-vous en ligne en quelques clics. Nos experts sont disponibles du lundi au samedi.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/appointments">
                            <Button size="lg" variant="outline" className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white group">
                                Prendre rendez-vous
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button size="lg" variant="outline" className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
                                Nous contacter
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
