import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/common/SEO'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Wrench, Clock, Shield, Users, Star, Quote, ArrowRight, Loader2 } from 'lucide-react'
import { serviceService } from '../../services/serviceService'
import { getImageUrl } from '../../utils/imageUrl'
import garagistImage from '../../assets/images/garagist.jpeg'
import garageImage from '../../assets/images/voiture au garage,.avif'

export default function HomePage() {
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceService.getAll()
        const list = Array.isArray(data) ? data : (data?.services || [])
        setServices(list.slice(0, 3))
      } catch (err) {
        console.error('Erreur chargement services:', err)
      } finally {
        setServicesLoading(false)
      }
    }
    loadServices()
  }, [])

  const features = [
    {
      icon: Clock,
      title: 'Service rapide',
      description: 'Intervention dans les 24-48h',
      color: 'bg-blue-500'
    },
    {
      icon: Shield,
      title: 'Garantie 3 ans',
      description: 'Sur tous nos travaux',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Équipe experte',
      description: 'Techniciens certifiés',
      color: 'bg-purple-500'
    },
  ]

  const testimonials = [
    {
      name: 'Jomia Lawrence',
      role: 'Client depuis 2020',
      content: 'Excellent service ! Mon véhicule a été réparé rapidement et le prix était très honnête. Je recommande vivement Cars Vision Auto.',
      rating: 5
    },
    {
      name: 'Gilbert Fon',
      role: 'Client depuis 2019',
      content: 'Équipe professionnelle et accueillante. Ils ont pris le temps de m\'expliquer tous les travaux nécessaires. Très satisfait !',
      rating: 5
    },
    {
      name: 'Elenga Joseph',
      role: 'Client depuis 2021',
      content: 'Garage de confiance à Douala. Prix transparents, travail de qualité et respect des délais. Je ne vais plus ailleurs !',
      rating: 5
    },
  ]

  const stats = [
    { value: '400+', label: 'Clients satisfaits' },
    { value: '5+', label: 'Ans d\'expérience' },
    { value: '2', label: 'Sites à Douala' },
    { value: '4.9/5', label: 'Note moyenne' },
  ]

  return (
    <div className="flex flex-col">
      <SEO title="Cars Vision Auto - Pièces Auto & Services Mécaniques à Douala" description="Votre partenaire automobile à Douala. Pièces détachées de qualité, services mécaniques professionnels et rendez-vous en ligne." keywords="pièces auto, garage, mécanique, Douala, Cameroun, voiture, entretien" />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-20 pb-32 overflow-hidden">
        {/* Background avec overlay */}
        <div className="absolute inset-0">
          <img src={garageImage} alt="Garage" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-dark/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="max-w-2xl animate-fade-in">
              <Badge className="mb-6 text-sm animate-slide-in-top">Depuis 2019 • Douala, Cameroun</Badge>

              <h1 className="text-6xl font-bold mb-6 leading-tight animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
                <span className="text-white">Cars Vision</span>{' '}
                <span className="text-brand-mint">Auto</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
                Votre partenaire automobile de confiance à Douala.
                Garage familial spécialisé en réparation, maintenance et upgrade de véhicules.
              </p>

              <div className="flex flex-wrap gap-4 mb-8 animate-slide-in-top" style={{ animationDelay: '0.3s' }}>
                <Link to="/appointments">
                  <Button size="lg" className="text-lg group">
                    Prendre rendez-vous
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-brand-dark">
                    Nos services
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-brand-mint">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image du garagiste */}
            <div className="hidden lg:block animate-slide-in-bottom animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-mint/20 rounded-3xl blur-2xl"></div>
                <img
                  src={garagistImage}
                  alt="Mécanicien professionnel"
                  className="relative rounded-2xl shadow-2xl border-4 border-brand-mint/30 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vague décorative sans ligne */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Features avec fond coloré */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-in-bottom"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services populaires avec fond dégradé */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in">
            <Badge className="mb-3">Services</Badge>
            <h2 className="text-4xl font-bold mb-3">Nos services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des prestations de qualité par des professionnels certifiés. Tous nos travaux sont garantis.
            </p>
          </div>

          {servicesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-mint" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
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

                  <CardFooter className="pt-2">
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

          <div className="text-center mt-8 animate-fade-in">
            <Link to="/services">
              <Button variant="outline" size="lg" className="group">
                Voir tous les services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages simple */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl font-bold mb-3">Ce que disent nos clients</h2>
            <p className="text-muted-foreground">
              Plus de 400 clients nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Quote className="h-8 w-8 text-brand-mint/20 absolute top-4 right-4" />
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-brand-mint text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand-mint text-brand-mint" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section compacte */}
      <section className="relative py-12 bg-gradient-to-r from-brand-mint to-brand-mint-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <h2 className="text-3xl font-bold text-brand-dark mb-3">
            Besoin d'un service automobile ?
          </h2>
          <p className="text-lg text-brand-dark/80 mb-6 max-w-xl mx-auto">
            Prenez rendez-vous en ligne en quelques clics
          </p>
          <Link to="/appointments">
            <Button size="lg" variant="outline" className="border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white group">
              Prendre rendez-vous
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
