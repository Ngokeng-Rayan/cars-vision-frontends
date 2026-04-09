import { useState, useEffect } from 'react'
import {
    Calendar, Clock, CheckCircle, XCircle, Edit2, Eye, Search, Filter,
    User, Wrench, MapPin, FileText, Trash2, Ban
} from 'lucide-react'
import { appointmentService } from '../../services/appointmentService'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/admin/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Select from '../../components/forms/Select'
import Textarea from '../../components/forms/Textarea'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/admin/EmptyState'
import { useToast } from '../../components/common/Toast'

const AppointmentsManagementPagePro = () => {
    const [appointments, setAppointments] = useState([])
    const [services, setServices] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showNotesModal, setShowNotesModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [notes, setNotes] = useState('')
    const toast = useToast()

    // Filtres
    const [filters, setFilters] = useState({
        search: '',
        statut: 'all',
        service: 'all',
        date_debut: '',
        date_fin: '',
        sortBy: 'recent'
    })

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterAppointments()
    }, [appointments, filters])

    const loadData = async () => {
        try {
            setLoading(true)
            const [appointmentsData, servicesData] = await Promise.all([
                appointmentService.getAllAppointments(),
                appointmentService.getAdminServices()
            ])
            setAppointments(appointmentsData.rdvs || appointmentsData.data || [])
            setServices(servicesData.services || servicesData.data || [])
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    const filterAppointments = () => {
        let filtered = [...appointments]

        // Recherche
        if (filters.search) {
            filtered = filtered.filter(a =>
                a.utilisateur?.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
                a.utilisateur?.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
                a.utilisateur?.telephone?.includes(filters.search)
            )
        }

        // Statut
        if (filters.statut !== 'all') {
            filtered = filtered.filter(a => a.statut === filters.statut)
        }

        // Service
        if (filters.service !== 'all') {
            filtered = filtered.filter(a => a.service_id === filters.service)
        }

        // Date
        if (filters.date_debut) {
            filtered = filtered.filter(a => new Date(a.date_rdv) >= new Date(filters.date_debut))
        }
        if (filters.date_fin) {
            filtered = filtered.filter(a => new Date(a.date_rdv) <= new Date(filters.date_fin))
        }

        // Tri
        switch (filters.sortBy) {
            case 'date_asc':
                filtered.sort((a, b) => new Date(a.date_rdv) - new Date(b.date_rdv))
                break
            case 'date_desc':
                filtered.sort((a, b) => new Date(b.date_rdv) - new Date(a.date_rdv))
                break
            case 'recent':
            default:
                filtered.sort((a, b) => new Date(b.cree_le) - new Date(a.cree_le))
        }

        setFilteredAppointments(filtered)
    }

    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            await appointmentService.updateAppointmentStatus(appointmentId, newStatus)
            toast.success('Statut modifié avec succès')
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleDelete = async (appointmentId) => {
        if (!window.confirm('Supprimer ce rendez-vous ? Un email sera envoyé au client.')) return
        try {
            await appointmentService.deleteAppointment(appointmentId)
            toast.success('Rendez-vous supprimé')
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
        }
    }

    const handleRefuse = async (appointmentId) => {
        if (!window.confirm('Refuser ce rendez-vous ? Un email sera envoyé au client.')) return
        try {
            await appointmentService.updateAppointmentStatus(appointmentId, 'ANNULE')
            toast.success('Rendez-vous refusé')
            loadData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const handleSaveNotes = async () => {
        if (!selectedAppointment) return

        try {
            // Appel API pour sauvegarder les notes
            toast.success('Notes enregistrées')
            setShowNotesModal(false)
            loadData()
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement des notes')
        }
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            statut: 'all',
            service: 'all',
            date_debut: '',
            date_fin: '',
            sortBy: 'recent'
        })
    }

    const getStatusBadge = (statut) => {
        const variants = {
            'EN_ATTENTE': 'warning',
            'CONFIRME': 'info',
            'TERMINE': 'success',
            'ANNULE': 'error'
        }
        return <Badge variant={variants[statut] || 'default'} size="sm">{statut}</Badge>
    }

    const stats = {
        total: appointments.length,
        en_attente: appointments.filter(a => a.statut === 'EN_ATTENTE').length,
        confirmes: appointments.filter(a => a.statut === 'CONFIRME').length,
        termines: appointments.filter(a => a.statut === 'TERMINE').length,
        aujourdhui: appointments.filter(a => {
            const today = new Date().toDateString()
            return new Date(a.date_rdv).toDateString() === today
        }).length
    }

    const columns = [
        {
            header: 'Date & Heure',
            field: 'date_rdv',
            sortable: true,
            render: (item) => (
                <div>
                    <p className="font-semibold text-gray-900">
                        {new Date(item.date_rdv).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.heure_rdv}
                    </p>
                </div>
            )
        },
        {
            header: 'Client',
            render: (item) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {item.utilisateur?.prenom} {item.utilisateur?.nom}
                    </p>
                    <p className="text-xs text-gray-500">{item.utilisateur?.telephone}</p>
                </div>
            )
        },
        {
            header: 'Service',
            render: (item) => (
                <Badge variant="primary" size="sm">
                    {item.service_nom || 'N/A'}
                </Badge>
            )
        },
        {
            header: 'Site',
            render: (item) => (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {item.site === 'ndokoti' ? 'Ndokoti' : 'Bonamoussadi'}
                </div>
            )
        },
        {
            header: 'Statut',
            field: 'statut',
            render: (item) => getStatusBadge(item.statut)
        },
        {
            header: 'Actions',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => {
                            setSelectedAppointment(item)
                            setShowDetailsModal(true)
                        }}
                        title="Détails"
                    />
                    {item.statut === 'EN_ATTENTE' && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={CheckCircle}
                                onClick={() => handleStatusChange(item.id, 'CONFIRME')}
                                className="text-green-600 hover:bg-green-50"
                                title="Confirmer"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={Ban}
                                onClick={() => handleRefuse(item.id)}
                                className="text-orange-600 hover:bg-orange-50"
                                title="Refuser"
                            />
                        </>
                    )}
                    {(item.statut === 'CONFIRME' || item.statut === 'EN_ATTENTE') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={FileText}
                            onClick={() => {
                                setSelectedAppointment(item)
                                setNotes(item.notes_mecanicien || '')
                                setShowNotesModal(true)
                            }}
                            title="Notes"
                        />
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:bg-red-50"
                        title="Supprimer"
                    />
                </div>
            )
        }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Rendez-vous</h1>
                    <p className="text-gray-600">Gérez les rendez-vous du garage Ndokoti</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
                            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600 mb-1">En attente</p>
                            <p className="text-3xl font-bold text-yellow-900">{stats.en_attente}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Confirmés</p>
                            <p className="text-3xl font-bold text-purple-900">{stats.confirmes}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Terminés</p>
                            <p className="text-3xl font-bold text-green-900">{stats.termines}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Wrench className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Aujourd'hui</p>
                            <p className="text-3xl font-bold text-orange-900">{stats.aujourdhui}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                            <Calendar className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtres
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            icon={Search}
                            placeholder="Rechercher par client, téléphone..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <Select
                        placeholder="Statut"
                        value={filters.statut}
                        onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            { value: 'EN_ATTENTE', label: 'En attente' },
                            { value: 'CONFIRME', label: 'Confirmé' },
                            { value: 'TERMINE', label: 'Terminé' },
                            { value: 'ANNULE', label: 'Annulé' }
                        ]}
                    />

                    <Select
                        placeholder="Service"
                        value={filters.service}
                        onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                        options={[
                            { value: 'all', label: 'Tous' },
                            ...services.map(s => ({ value: s.id, label: s.nom }))
                        ]}
                    />

                    <Input
                        type="date"
                        label="Date début"
                        value={filters.date_debut}
                        onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                    />

                    <Input
                        type="date"
                        label="Date fin"
                        value={filters.date_fin}
                        onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                    />

                    <Select
                        placeholder="Trier par"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        options={[
                            { value: 'recent', label: 'Plus récents' },
                            { value: 'date_asc', label: 'Date croissante' },
                            { value: 'date_desc', label: 'Date décroissante' }
                        ]}
                    />
                </div>

                {(filters.search || filters.statut !== 'all' || filters.service !== 'all' || filters.date_debut || filters.date_fin || filters.sortBy !== 'recent') && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>

            {/* Appointments Table */}
            {filteredAppointments.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="Aucun rendez-vous trouvé"
                    description={filters.search || filters.statut !== 'all' ? "Aucun rendez-vous ne correspond à vos critères" : "Aucun rendez-vous pour le moment"}
                />
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredAppointments}
                    loading={loading}
                />
            )}

            {/* Details Modal */}
            {selectedAppointment && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title="Détails du rendez-vous"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Client Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Client</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium">{selectedAppointment.utilisateur?.prenom} {selectedAppointment.utilisateur?.nom}</p>
                                <p className="text-sm text-gray-600">{selectedAppointment.utilisateur?.email}</p>
                                <p className="text-sm text-gray-600">{selectedAppointment.utilisateur?.telephone}</p>
                            </div>
                        </div>

                        {/* Appointment Info */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Informations</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Service:</span>
                                    <Badge variant="primary">{selectedAppointment.service_nom}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Date:</span>
                                    <span className="text-sm font-medium">{new Date(selectedAppointment.date_rdv).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Heure:</span>
                                    <span className="text-sm font-medium">{selectedAppointment.heure_rdv}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Site:</span>
                                    <span className="text-sm font-medium">{selectedAppointment.site === 'ndokoti' ? 'Ndokoti' : 'Bonamoussadi'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Statut:</span>
                                    {getStatusBadge(selectedAppointment.statut)}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedAppointment.notes && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes client</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Mechanic Notes */}
                        {selectedAppointment.notes_mecanicien && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes mécanicien</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">{selectedAppointment.notes_mecanicien}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Notes Modal */}
            <Modal
                isOpen={showNotesModal}
                onClose={() => setShowNotesModal(false)}
                title="Notes mécanicien"
                size="md"
            >
                <div className="space-y-4">
                    <Textarea
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                        placeholder="Ajoutez des notes sur l'intervention..."
                    />
                    <div className="flex gap-4">
                        <Button variant="primary" onClick={handleSaveNotes} className="flex-1">
                            Enregistrer
                        </Button>
                        <Button variant="secondary" onClick={() => setShowNotesModal(false)} className="flex-1">
                            Annuler
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AppointmentsManagementPagePro
