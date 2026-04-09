import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import SEO from '../../components/common/SEO'
import api from '../../lib/api'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
    })

    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/contact', data)
            return response.data
        },
        onSuccess: () => {
            setFormData({
                nom: '',
                prenom: '',
                email: '',
                telephone: '',
                sujet: '',
                message: ''
            })
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        mutation.mutate(formData)
    }

    const contactInfo = [
        {
            icon: Phone,
            title: 'Téléphone',
            details: ['+237 676 889 008', '+237 678 870 171'],
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Mail,
            title: 'Email',
            details: ['contact@carsvisionauto.cm', 'info@carsvisionauto.cm'],
            color: 'from-green-500 to-green-600'
        },
        {
            icon: MapPin,
            title: 'Adresses',
            details: ['Bonamoussadi, Douala', 'Ndokoti, Douala'],
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: Clock,
            title: 'Horaires',
            details: ['Lun-Sam: 7h30 - 18h30', 'Dimanche: Fermé'],
            color: 'from-orange-500 to-orange-600'
        },
    ]

    return (
        <div className="flex flex-col">
            <SEO title="Contactez-nous | Cars Vision Auto Douala" description="Contactez Cars Vision Auto à Douala pour toute question sur nos pièces auto et services mécaniques." keywords="contact garage, Cars Vision Auto, Douala" />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 animate-fade-in">Contact</Badge>
                    <h1 className="text-5xl font-bold mb-4 animate-slide-in-top">
                        Contactez-nous
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
                        Une question ? Un devis ? Notre équipe est à votre écoute du lundi au samedi.
                    </p>
                </div>

                {/* Vague décorative */}
                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Contact Form + Coordonnées (right after curved bar) */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold mb-4">Envoyez-nous un message</h2>
                            <p className="text-muted-foreground mb-8">
                                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                            </p>

                            <Card>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nom">Nom *</Label>
                                                <Input
                                                    type="text"
                                                    id="nom"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="prenom">Prénom *</Label>
                                                <Input
                                                    type="text"
                                                    id="prenom"
                                                    name="prenom"
                                                    value={formData.prenom}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="telephone">Téléphone *</Label>
                                            <Input
                                                type="tel"
                                                id="telephone"
                                                name="telephone"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                                placeholder="+237 6XX XXX XXX"
                                                required
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="sujet">Sujet *</Label>
                                            <Input
                                                type="text"
                                                id="sujet"
                                                name="sujet"
                                                value={formData.sujet}
                                                onChange={handleChange}
                                                placeholder="Ex: Demande de devis"
                                                required
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message *</Label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                required
                                                placeholder="Décrivez votre demande..."
                                                className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-brand-mint"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                            {mutation.isPending ? (
                                                'Envoi en cours...'
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Envoyer le message
                                                </>
                                            )}
                                        </Button>

                                        {mutation.isSuccess && (
                                            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                                                <CheckCircle className="h-5 w-5" />
                                                <p className="text-sm">
                                                    Message envoyé avec succès ! Nous vous répondrons rapidement.
                                                </p>
                                            </div>
                                        )}

                                        {mutation.isError && (
                                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                                <AlertCircle className="h-5 w-5" />
                                                <p className="text-sm">
                                                    Une erreur est survenue. Veuillez réessayer ou nous appeler directement.
                                                </p>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Coordonnées */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-3xl font-bold mb-4">Nos coordonnées</h2>
                            <p className="text-muted-foreground mb-8">
                                Visitez-nous sur l’un de nos deux sites à Douala.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border">
                                    <div className="bg-brand-mint w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Bonamoussadi (Boutique)</p>
                                        <p className="text-sm text-muted-foreground">+237 676 889 008</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border">
                                    <div className="bg-brand-mint w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Ndokoti (Garage)</p>
                                        <p className="text-sm text-muted-foreground">+237 678 870 171</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border">
                                    <div className="bg-brand-mint w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Horaires</p>
                                        <p className="text-sm text-muted-foreground">Lun-Sam: 7h30 - 18h30</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border">
                                    <div className="bg-brand-mint w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p className="text-sm text-muted-foreground">contact@carsvisionauto.cm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards (en bas) */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <Card
                                key={index}
                                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-in-bottom overflow-hidden"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${info.color}`}></div>
                                <CardHeader className="pt-8">
                                    <div className={`bg-gradient-to-br ${info.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                                        <info.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-lg">{info.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-sm text-muted-foreground">
                                            {detail}
                                        </p>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
