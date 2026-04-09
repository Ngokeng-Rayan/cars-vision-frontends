import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react'
import { appointmentService } from '../../services/appointmentService'

const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAppointments()
    }, [])

    const loadAppointments = async () => {
        try {
            const data = await appointmentService.getMyAppointments()
            setAppointments(data)
        } catch (error) {
            console.error('Erreur chargement rendez-vous:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelAppointment = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) return

        try {
            await appointmentService.cancelAppointment(id)
            loadAppointments()
            alert('Rendez-vous annulé avec succès')
        } catch (error) {
            alert(error.response?.data?.message || 'Erreur lors de l\'annulation')
        }
    }

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'EN_ATTENTE': return <Clock className="text-yellow-500 h-4 w-4" />
            case 'CONFIRME': return <CheckCircle className="text-green-500 h-4 w-4" />
            case 'TERMINE': return <CheckCircle className="text-blue-500 h-4 w-4" />
            case 'ANNULE': return <XCircle className="text-red-500 h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    const getStatusLabel = (statut) => {
        const labels = {
            'EN_ATTENTE': 'En attente',
            'CONFIRME': 'Confirmé',
            'TERMINE': 'Terminé',
            'ANNULE': 'Annulé'
        }
        return labels[statut] || statut
    }

    const getStatusColor = (statut) => {
        const colors = {
            'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
            'CONFIRME': 'bg-green-100 text-green-800',
            'TERMINE': 'bg-blue-100 text-blue-800',
            'ANNULE': 'bg-red-100 text-red-800'
        }
        return colors[statut] || 'bg-gray-100 text-gray-800'
    }

    const getSiteLabel = (site) => {
        return site === 'bonamoussadi' ? 'Bonamoussadi' : 'Ndokoti'
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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Rendez-vous</h1>

                {appointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Calendar className="mx-auto text-gray-400 mb-4 h-16 w-16" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun rendez-vous</h2>
                        <p className="text-gray-600 mb-6">Vous n'avez pas encore pris de rendez-vous</p>
                        <a href="/appointments" className="btn-primary inline-block">
                            Prendre rendez-vous
                        </a>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map(appointment => (
                            <div key={appointment.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(appointment.statut)}`}>
                                            {getStatusIcon(appointment.statut)}
                                            {getStatusLabel(appointment.statut)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">{appointment.service_nom}</h3>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Date et heure */}
                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-primary mt-1 h-5 w-5" />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {new Date(appointment.date_rdv).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {appointment.heure_debut} - {appointment.heure_fin}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Site */}
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-primary mt-1 h-5 w-5" />
                                        <div>
                                            <p className="font-medium text-gray-800">Garage {getSiteLabel(appointment.site)}</p>
                                        </div>
                                    </div>

                                    {/* Véhicule */}
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-600 mb-1">Véhicule</p>
                                        <p className="font-medium text-gray-800">
                                            {appointment.marque_vehicule} {appointment.modele_vehicule}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Année: {appointment.annee_vehicule}
                                            {appointment.plaque_vehicule && ` • ${appointment.plaque_vehicule}`}
                                        </p>
                                    </div>

                                    {/* Services additionnels */}
                                    {(appointment.besoin_remorquage || appointment.besoin_navette || appointment.voiture_courtoisie) && (
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-600 mb-2">Services additionnels</p>
                                            <div className="space-y-1">
                                                {appointment.besoin_remorquage && (
                                                    <p className="text-sm text-gray-800">✓ Remorquage</p>
                                                )}
                                                {appointment.besoin_navette && (
                                                    <p className="text-sm text-gray-800">✓ Service navette</p>
                                                )}
                                                {appointment.voiture_courtoisie && (
                                                    <p className="text-sm text-gray-800">✓ Voiture de courtoisie</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {appointment.notes_client && (
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-600 mb-1">Notes</p>
                                            <p className="text-sm text-gray-800">{appointment.notes_client}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {appointment.statut === 'EN_ATTENTE' && (
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Annuler le rendez-vous
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyAppointmentsPage
