import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar, Clock, MapPin, Car, CheckCircle, AlertCircle, Wrench, Loader2, User, Phone } from 'lucide-react'
import SEO from '../../components/common/SEO'
import { serviceService } from '../../services/serviceService'
import useAuthStore from '../../store/authStore'
import api from '../../lib/api'

export default function AppointmentsPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { isAuthenticated, user } = useAuthStore()
    const [success, setSuccess] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [services, setServices] = useState([])
    const [servicesLoading, setServicesLoading] = useState(true)
    const [heureError, setHeureError] = useState('')

    const [formData, setFormData] = useState({
        service_id: searchParams.get('service') || '',
        site: 'ndokoti',
        date_rdv: '',
        heure_debut: '',
        description_vehicule: '',
        notes_client: '',
        nom_client: '',
        telephone_client: '',
        email_client: ''
    })

    // Load services on mount
    useEffect(() => {
        const loadServices = async () => {
            try {
                setServicesLoading(true)
                const res = await serviceService.getAll()
                const list = res.services || res.data || res
                setServices(Array.isArray(list) ? list : [])
            } catch (err) {
                console.error('Erreur chargement services:', err)
            } finally {
                setServicesLoading(false)
            }
        }
        loadServices()
    }, [])


    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'heure_debut') {
            // Validate working hours: 07:30 - 18:00
            if (value && (value < '07:30' || value > '18:00')) {
                setHeureError('Les horaires sont de 7h30 à 18h00 (Lun-Sam)')
            } else {
                setHeureError('')
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (heureError) return

        // Validate working hours
        if (formData.heure_debut < '07:30' || formData.heure_debut > '18:00') {
            setError('L\'heure doit être entre 7h30 et 18h00')
            return
        }

        // Validate day (no Sunday)
        const dayOfWeek = new Date(formData.date_rdv).getDay()
        if (dayOfWeek === 0) {
            setError('Nous sommes fermés le dimanche. Veuillez choisir un autre jour.')
            return
        }

        setError('')
        setSubmitting(true)
        try {
            await api.post('/appointments', formData)
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.')
        } finally {
            setSubmitting(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]
    const selectedService = services.find(s => String(s.id) === String(formData.service_id))
    const canSubmit = formData.service_id && formData.date_rdv && formData.heure_debut &&
        formData.description_vehicule && !heureError &&
        (isAuthenticated || (formData.nom_client && formData.telephone_client))

    return (
        <div className="flex flex-col">
            <SEO title="Prendre Rendez-vous | Cars Vision Auto Douala" description="Réservez un rendez-vous en ligne pour l'entretien ou la réparation de votre véhicule à Douala." keywords="rendez-vous mécanique, réservation garage, Douala" />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white py-16 pb-28">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block bg-white/10 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">Rendez-vous</span>
                    <h1 className="text-5xl font-bold mb-4">
                        Prenez rendez-vous en ligne
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Réservez votre créneau en quelques clics. Notre garage de Ndokoti vous accueille.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 -mb-1">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
                    </svg>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 max-w-3xl">

                    {/* Success State */}
                    {success ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Rendez-vous confirmé !</h3>
                            <p className="text-gray-500 mb-6">
                                Un email de confirmation vous sera envoyé. Vous pouvez suivre votre rendez-vous depuis votre espace client.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg text-left max-w-sm mx-auto mb-6 space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-[#4DB896]" />
                                    <span className="font-medium">Service:</span>
                                    <span>{selectedService?.nom}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-[#4DB896]" />
                                    <span className="font-medium">Date:</span>
                                    <span>{new Date(formData.date_rdv).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#4DB896]" />
                                    <span className="font-medium">Heure:</span>
                                    <span>{formData.heure_debut}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-[#4DB896]" />
                                    <span className="font-medium">Lieu:</span>
                                    <span>Garage de Ndokoti</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-[#4DB896]" />
                                    <span className="font-medium">Véhicule:</span>
                                    <span>{formData.description_vehicule}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                                <a href="/mes-rendez-vous" className="inline-flex items-center px-6 py-2.5 bg-[#4DB896] text-white rounded-lg font-medium hover:bg-[#3da07e] transition-colors">
                                    Mes rendez-vous
                                </a>
                                <a href="/" className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    Retour à l'accueil
                                </a>
                            </div>
                        </div>
                    ) : (

                    /* Single-Step Form */
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Réserver un rendez-vous</h2>
                            <p className="text-sm text-gray-500 mt-1">Remplissez les informations ci-dessous pour réserver votre créneau</p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* --- Section: Service & Date --- */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Wrench className="h-4 w-4 text-[#4DB896]" />
                                    Service & Date
                                </h3>
                                <div className="space-y-4">
                                    {/* Service */}
                                    <div>
                                        <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                                        {servicesLoading ? (
                                            <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
                                        ) : (
                                            <select
                                                id="service_id"
                                                name="service_id"
                                                value={formData.service_id}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                            >
                                                <option value="">Sélectionnez un service</option>
                                                {services.filter(s => s.est_actif !== false).map((service) => (
                                                    <option key={service.id} value={service.id}>
                                                        {service.nom}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Date + Location side by side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="date_rdv" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                            <input
                                                type="date"
                                                id="date_rdv"
                                                name="date_rdv"
                                                value={formData.date_rdv}
                                                onChange={handleChange}
                                                min={today}
                                                required
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                                            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                                <MapPin className="h-4 w-4 text-[#4DB896]" />
                                                Garage de Ndokoti, Douala
                                            </div>
                                        </div>
                                    </div>

                                    {/* Heure */}
                                    <div>
                                        <label htmlFor="heure_debut" className="block text-sm font-medium text-gray-700 mb-1">Heure souhaitée *</label>
                                        <input
                                            type="time"
                                            id="heure_debut"
                                            name="heure_debut"
                                            value={formData.heure_debut}
                                            onChange={handleChange}
                                            min="07:30"
                                            max="18:00"
                                            required
                                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm ${heureError ? 'border-red-400' : 'border-gray-300'}`}
                                        />
                                        {heureError ? (
                                            <p className="text-xs text-red-500 mt-1">{heureError}</p>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-1">Lun-Sam : 7h30 - 18h00</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- Section: Coordonnées (invité) --- */}
                            {!isAuthenticated && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <User className="h-4 w-4 text-[#4DB896]" />
                                    Vos coordonnées
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="nom_client" className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                                            <input
                                                type="text"
                                                id="nom_client"
                                                name="nom_client"
                                                value={formData.nom_client}
                                                onChange={handleChange}
                                                placeholder="Ex: Jean Dupont"
                                                required
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="telephone_client" className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                                            <input
                                                type="tel"
                                                id="telephone_client"
                                                name="telephone_client"
                                                value={formData.telephone_client}
                                                onChange={handleChange}
                                                placeholder="+237 6XX XXX XXX"
                                                required
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email_client" className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
                                        <input
                                            type="email"
                                            id="email_client"
                                            name="email_client"
                                            value={formData.email_client}
                                            onChange={handleChange}
                                            placeholder="votre@email.com"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Pour recevoir la confirmation par email</p>
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* --- Section: Véhicule --- */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Car className="h-4 w-4 text-[#4DB896]" />
                                    Véhicule
                                </h3>
                                <div>
                                    <label htmlFor="description_vehicule" className="block text-sm font-medium text-gray-700 mb-1">Description du véhicule *</label>
                                    <input
                                        type="text"
                                        id="description_vehicule"
                                        name="description_vehicule"
                                        value={formData.description_vehicule}
                                        onChange={handleChange}
                                        placeholder="Ex: Toyota Corolla 2020 — LT-1234-AB"
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Marque, modèle, année, immatriculation…</p>
                                </div>
                            </div>

                            {/* --- Section: Notes --- */}
                            <div>
                                <label htmlFor="notes_client" className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                                <textarea
                                    id="notes_client"
                                    name="notes_client"
                                    value={formData.notes_client}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Décrivez le problème ou vos besoins spécifiques..."
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={!canSubmit || submitting}
                                className="w-full py-3 bg-[#4DB896] text-white rounded-lg font-semibold hover:bg-[#3da07e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Réservation en cours...
                                    </>
                                ) : (
                                    'Confirmer le rendez-vous'
                                )}
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            </section>
        </div>
    )
}
