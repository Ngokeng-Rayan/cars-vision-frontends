import { Badge } from '../../components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Shield, Users, Clock, MapPin, Heart, Zap } from 'lucide-react'
import SEO from '../../components/common/SEO'

export default function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: 'Qualité',
            description: 'Nous utilisons uniquement des pièces certifiées et garantissons tous nos travaux pendant 3 ans.',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Heart,
            title: 'Passion',
            description: 'Notre équipe est passionnée par l\'automobile et met tout en œuvre pour votre satisfaction.',
            color: 'from-red-500 to-red-600'
        },
        {
            icon: Users,
            title: 'Proximité',
            description: 'Garage familial à taille humaine, nous prenons le temps d\'écouter et de conseiller nos clients.',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Zap,
            title: 'Réactivité',
            description: 'Intervention rapide sous 24-48h et service express disponible pour les urgences.',
            color: 'from-yellow-500 to-yellow-600'
        },
    ]

    const stats = [
        { value: '400+', label: 'Clients satisfaits' },
        { value: '5+', label: 'Ans d\'expérience' },
        { value: '2', label: 'Sites à Douala' },
        { value: '4', label: 'Techniciens experts' },
    ]

    return (
        <div className="flex flex-col">
            <SEO title="À Propos | Cars Vision Auto Douala" description="Découvrez Cars Vision Auto, votre garage de confiance à Douala. Plus de 5 ans d'expérience en mécanique automobile." keywords="à propos, garage Douala, Cars Vision Auto, mécanique" />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 animate-fade-in">À propos</Badge>
                    <h1 className="text-5xl font-bold mb-4 animate-slide-in-top">
                        Notre histoire
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
                        Garage familial depuis 2019, nous sommes votre partenaire automobile de confiance à Douala.
                    </p>
                </div>

                {/* Vague décorative */}
                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow animate-slide-in-bottom"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="text-4xl font-bold text-brand-mint mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About + Values */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Fondé en 2019, Cars Vision Auto est votre partenaire automobile de confiance à Douala.
                            Avec plus de 400 clients satisfaits et une équipe de techniciens qualifiés, nous offrons un service
                            de qualité, transparent et accessible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-in-bottom overflow-hidden"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color}`}></div>
                                <CardHeader className="text-center pt-8">
                                    <div className={`bg-gradient-to-br ${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                        <value.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold mb-4">Nos sites</h2>
                        <p className="text-lg text-muted-foreground">
                            Deux sites complémentaires pour tous vos besoins automobiles
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="hover:shadow-xl transition-shadow animate-slide-in-bottom border-2 border-brand-mint/20">
                            <CardHeader>
                                <div className="bg-brand-mint w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle>Bonamoussadi - Boutique</CardTitle>
                                <Badge className="w-fit">Vente de pièces</Badge>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p className="text-muted-foreground">
                                    Rue principale, Bonamoussadi<br />
                                    Douala, Cameroun
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4 text-brand-mint" />
                                    <span>Lun-Sam: 7h30 - 18h30</span>
                                </div>
                                <p className="text-muted-foreground">
                                    📞 +237 676 889 008
                                </p>
                                <div className="pt-3 border-t">
                                    <p className="font-medium text-gray-900 mb-2">Services disponibles:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>✓ Vente de pièces détachées</li>
                                        <li>✓ Commandes en ligne</li>
                                        <li>✓ Livraison à domicile</li>
                                        <li>✓ Retrait sur place</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-shadow animate-slide-in-bottom border-2 border-brand-mint/20" style={{ animationDelay: '0.1s' }}>
                            <CardHeader>
                                <div className="bg-brand-mint w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle>Ndokoti - Garage</CardTitle>
                                <Badge className="w-fit">Services mécaniques</Badge>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p className="text-muted-foreground">
                                    Avenue du marché, Ndokoti<br />
                                    Douala, Cameroun
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4 text-brand-mint" />
                                    <span>Lun-Sam: 7h30 - 18h30</span>
                                </div>
                                <p className="text-muted-foreground">
                                    📞 +237 678 870 171
                                </p>
                                <div className="pt-3 border-t">
                                    <p className="font-medium text-gray-900 mb-2">Services disponibles:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                        <li>✓ Révision et entretien</li>
                                        <li>✓ Réparations mécaniques</li>
                                        <li>✓ Diagnostic électronique</li>
                                        <li>✓ Rendez-vous en ligne</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
