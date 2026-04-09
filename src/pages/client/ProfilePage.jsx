import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    User, Lock, Save, ShoppingBag, Calendar, Package,
    MapPin, LogOut, Eye, EyeOff, Home, Menu, X,
    ChevronLeft, Clock, CheckCircle, XCircle, Truck, Phone, Mail
} from 'lucide-react'
import { userService } from '../../services/userService'
import { orderService } from '../../services/orderService'
import { appointmentService } from '../../services/appointmentService'
import useAuthStore from '../../store/authStore'
import { getProductImageUrl } from '../../utils/imageUrl'

const ProfilePage = () => {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const [activeTab, setActiveTab] = useState('orders')
    const [mobileSidebar, setMobileSidebar] = useState(false)

    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [profileData, setProfileData] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })
    const [passwordData, setPasswordData] = useState({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', confirmer_mot_de_passe: '' })
    const [showPasswords, setShowPasswords] = useState({ ancien: false, nouveau: false, confirmer: false })
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [appointments, setAppointments] = useState([])
    const [appointmentsLoading, setAppointmentsLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderDetailLoading, setOrderDetailLoading] = useState(false)

    useEffect(() => { loadProfile() }, [])
    useEffect(() => {
        if (activeTab === 'orders' && ordersLoading) loadOrders()
        if (activeTab === 'appointments' && appointmentsLoading) loadAppointments()
    }, [activeTab])

    const loadProfile = async () => {
        try {
            setProfileLoading(true)
            const data = await userService.getProfile()
            setProfileData({
                nom: data.nom || '',
                prenom: data.prenom || '',
                email: data.email || '',
                telephone: data.telephone || '',
                adresse: data.adresse || ''
            })
        } catch (error) { console.error('Erreur chargement profil:', error) }
        finally { setProfileLoading(false) }
    }

    const loadOrders = async () => {
        try {
            setOrdersLoading(true)
            const data = await orderService.getMyOrders()
            setOrders(Array.isArray(data) ? data : (data?.commandes || data?.data || []))
        } catch (error) { console.error('Erreur chargement commandes:', error) }
        finally { setOrdersLoading(false) }
    }

    const loadAppointments = async () => {
        try {
            setAppointmentsLoading(true)
            const data = await appointmentService.getMyAppointments()
            setAppointments(Array.isArray(data) ? data : (data?.rendezVous || data?.data || []))
        } catch (error) { console.error('Erreur chargement rendez-vous:', error) }
        finally { setAppointmentsLoading(false) }
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setMessage({ type: '', text: '' })
        try {
            await userService.updateProfile(profileData)
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la mise à jour' })
        } finally { setLoading(false) }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (passwordData.nouveau_mot_de_passe !== passwordData.confirmer_mot_de_passe) {
            setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' }); return
        }
        setLoading(true); setPasswordMessage({ type: '', text: '' })
        try {
            await userService.changePassword({ ancien_mot_de_passe: passwordData.ancien_mot_de_passe, nouveau_mot_de_passe: passwordData.nouveau_mot_de_passe })
            setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' })
            setPasswordData({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', confirmer_mot_de_passe: '' })
            setShowPasswords({ ancien: false, nouveau: false, confirmer: false })
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors du changement de mot de passe' })
        } finally { setLoading(false) }
    }

    const loadOrderDetail = async (id) => {
        try {
            setOrderDetailLoading(true)
            const data = await orderService.getMyOrderDetails(id)
            setSelectedOrder(data?.commande || data)
        } catch (error) { console.error('Erreur chargement détail commande:', error) }
        finally { setOrderDetailLoading(false) }
    }

    const handleCancelOrder = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette commande?')) return
        try {
            await orderService.cancelOrder(id)
            loadOrders()
            if (selectedOrder?.id === id) { setSelectedOrder(null) }
        } catch (error) { alert(error.response?.data?.message || 'Erreur lors de l\'annulation') }
    }

    const handleCancelAppointment = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) return
        try { await appointmentService.cancelAppointment(id); loadAppointments() }
        catch (error) { alert(error.response?.data?.message || 'Erreur lors de l\'annulation') }
    }

    const handleLogout = () => { logout(); navigate('/') }
    const fmtPrice = (p) => new Intl.NumberFormat('fr-FR').format(p)

    const initials = profileData.prenom && profileData.nom
        ? `${profileData.prenom[0]}${profileData.nom[0]}`.toUpperCase()
        : user?.prenom && user?.nom ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase() : 'CV'

    const getOrderStatusColor = (s) => ({ 'EN_ATTENTE': 'bg-yellow-100 text-yellow-800', 'CONFIRMEE': 'bg-blue-100 text-blue-800', 'LIVREE': 'bg-green-100 text-green-800', 'ANNULEE': 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')
    const getOrderStatusLabel = (s) => ({ 'EN_ATTENTE': 'En attente', 'CONFIRMEE': 'Confirmée', 'LIVREE': 'Livrée', 'ANNULEE': 'Annulée' }[s] || s)
    const getRdvStatusColor = (s) => ({ 'EN_ATTENTE': 'bg-yellow-100 text-yellow-800', 'CONFIRME': 'bg-green-100 text-green-800', 'TERMINE': 'bg-blue-100 text-blue-800', 'ANNULE': 'bg-red-100 text-red-800' }[s] || 'bg-gray-100 text-gray-800')
    const getRdvStatusLabel = (s) => ({ 'EN_ATTENTE': 'En attente', 'CONFIRME': 'Confirmé', 'TERMINE': 'Terminé', 'ANNULE': 'Annulé' }[s] || s)

    const tabs = [
        { id: 'orders', label: 'Mes commandes', icon: ShoppingBag },
        { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar },
        { id: 'settings', label: 'Mon profil', icon: User },
    ]

    const switchTab = (id) => {
        setActiveTab(id)
        setMobileSidebar(false)
        setMessage({ type: '', text: '' })
        setPasswordMessage({ type: '', text: '' })
        setSelectedOrder(null)
    }

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#4DB896] border-t-transparent"></div>
            </div>
        )
    }

    // ─── Sidebar Content (shared between mobile overlay and desktop) ───
    const sidebarContent = (
        <>
            {/* User info */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#4DB896] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{profileData.prenom || user?.prenom} {profileData.nom || user?.nom}</p>
                        <p className="text-xs text-gray-500 truncate">{profileData.email || user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav className="p-3 flex-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => switchTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                            activeTab === tab.id
                                ? 'bg-[#4DB896]/10 text-[#4DB896]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <tab.icon className="h-5 w-5 flex-shrink-0" />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-gray-100 space-y-1">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <Home className="h-5 w-5" />
                    Retour à l'accueil
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-5 w-5" />
                    Déconnexion
                </button>
            </div>
        </>
    )

    // ─── Order Detail View ───
    const statusSteps = [
        { key: 'EN_ATTENTE', label: 'En attente', icon: Clock },
        { key: 'CONFIRMEE', label: 'Confirmée', icon: CheckCircle },
        { key: 'LIVREE', label: 'Livrée', icon: Truck }
    ]

    const renderOrderDetail = () => {
        const o = selectedOrder
        if (orderDetailLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4DB896] border-t-transparent"></div></div>
        if (!o) return null

        const currentStepIndex = o.statut === 'ANNULEE' ? -1 : statusSteps.findIndex(s => s.key === o.statut)

        return (
            <div className="space-y-5">
                {/* Back button */}
                <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#4DB896] transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                    Retour aux commandes
                </button>

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Commande #{o.numero_commande}</h2>
                        <p className="text-sm text-gray-500">Passée le {new Date(o.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <p className="text-2xl font-bold text-[#4DB896]">{fmtPrice(o.total)} FCFA</p>
                </div>

                {/* Status Timeline */}
                {o.statut !== 'ANNULEE' ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-5">Suivi de commande</h3>
                        <div className="relative">
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
                                <div className="h-full bg-[#4DB896] rounded transition-all duration-500" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                            </div>
                            <div className="relative flex justify-between">
                                {statusSteps.map((step, index) => {
                                    const Icon = step.icon
                                    const done = index <= currentStepIndex
                                    const current = index === currentStepIndex
                                    return (
                                        <div key={step.key} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${done ? 'bg-[#4DB896] text-white' : 'bg-gray-200 text-gray-400'} ${current ? 'ring-4 ring-[#4DB896]/30' : ''}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <p className={`text-xs text-center ${done ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{step.label}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-4">
                        <XCircle className="h-7 w-7 text-red-600 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-900">Commande annulée</h3>
                            <p className="text-red-700 text-sm">Cette commande a été annulée</p>
                        </div>
                    </div>
                )}

                {/* Products */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Produits commandés</h3>
                    <div className="space-y-3">
                        {o.articles?.map((item, i) => {
                            const imgUrl = item.produit?.images ? getProductImageUrl(item.produit.images) : null
                            return (
                                <div key={i} className="flex gap-3 pb-3 border-b last:border-b-0">
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {imgUrl ? <img src={imgUrl} alt={item.nom_produit} className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-gray-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{item.nom_produit}</p>
                                        <p className="text-xs text-gray-500">Qté: {item.quantite} &bull; {fmtPrice(item.prix)} FCFA/u</p>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{fmtPrice(item.sous_total || (item.prix * item.quantite))} FCFA</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Informations de livraison</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2.5">
                            <MapPin className="h-4 w-4 text-[#4DB896] flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{o.adresse_livraison}</span>
                        </div>
                        {o.telephone_livraison && (
                            <div className="flex items-start gap-2.5">
                                <Phone className="h-4 w-4 text-[#4DB896] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{o.telephone_livraison}</span>
                            </div>
                        )}
                        {o.email && (
                            <div className="flex items-start gap-2.5">
                                <Mail className="h-4 w-4 text-[#4DB896] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{o.email}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Sous-total</span><span>{fmtPrice(o.sous_total)} FCFA</span></div>
                        <div className="flex justify-between text-gray-600"><span>Frais de livraison</span><span>{fmtPrice(o.frais_livraison)} FCFA</span></div>
                        {o.remise > 0 && <div className="flex justify-between text-green-600"><span>Remise</span><span>-{fmtPrice(o.remise)} FCFA</span></div>}
                        <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span className="text-[#4DB896]">{fmtPrice(o.total)} FCFA</span></div>
                    </div>
                    {o.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-1">Notes</p>
                            <p className="text-sm text-gray-600">{o.notes}</p>
                        </div>
                    )}
                </div>

                {/* Cancel action */}
                {o.statut === 'EN_ATTENTE' && (
                    <button onClick={() => handleCancelOrder(o.id)} className="w-full px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors">
                        Annuler la commande
                    </button>
                )}
            </div>
        )
    }

    // ─── Orders Tab ───
    const renderOrders = () => {
        if (selectedOrder || orderDetailLoading) return renderOrderDetail()
        if (ordersLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4DB896] border-t-transparent"></div></div>
        if (orders.length === 0) return (
            <div className="text-center py-16">
                <Package className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucune commande</h3>
                <p className="text-sm text-gray-500 mb-4">Vous n'avez pas encore passé de commande</p>
                <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#4DB896] hover:bg-[#3da07e] text-white text-sm font-semibold rounded-xl transition-colors">Voir la boutique</Link>
            </div>
        )
        return (
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Commande #{order.numero_commande}</p>
                                <p className="text-xs text-gray-500">{new Date(order.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.statut)}`}>{getOrderStatusLabel(order.statut)}</span>
                                <span className="text-lg font-bold text-[#4DB896]">{fmtPrice(order.total)} FCFA</span>
                            </div>
                        </div>
                        {order.articles && order.articles.length > 0 && (
                            <div className="border-t pt-3 space-y-1">
                                {order.articles.map((item, i) => (
                                    <div key={i} className="flex justify-between text-xs text-gray-600">
                                        <span>{item.nom_produit} x{item.quantite}</span>
                                        <span className="font-medium">{fmtPrice(item.sous_total || (item.prix * item.quantite))} FCFA</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => loadOrderDetail(order.id)} className="px-4 py-2 bg-[#4DB896] hover:bg-[#3da07e] text-white rounded-lg text-xs font-semibold transition-colors">Voir détails</button>
                            {order.statut === 'EN_ATTENTE' && (
                                <button onClick={() => handleCancelOrder(order.id)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">Annuler</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // ─── Appointments Tab ───
    const renderAppointments = () => {
        if (appointmentsLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4DB896] border-t-transparent"></div></div>
        if (appointments.length === 0) return (
            <div className="text-center py-16">
                <Calendar className="mx-auto h-14 w-14 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucun rendez-vous</h3>
                <p className="text-sm text-gray-500 mb-4">Vous n'avez pas encore pris de rendez-vous</p>
                <Link to="/appointments" className="inline-block px-5 py-2.5 bg-[#4DB896] hover:bg-[#3da07e] text-white text-sm font-semibold rounded-xl transition-colors">Prendre rendez-vous</Link>
            </div>
        )
        return (
            <div className="space-y-4">
                {appointments.map(rdv => (
                    <div key={rdv.id} className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">{rdv.service_nom}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(rdv.date_rdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    {' '}&bull; {rdv.heure_debut} - {rdv.heure_fin}
                                </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRdvStatusColor(rdv.statut)}`}>{getRdvStatusLabel(rdv.statut)}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-[#4DB896]" />
                                Garage {rdv.site === 'bonamoussadi' ? 'Bonamoussadi' : 'Ndokoti'}
                            </div>
                            {rdv.marque_vehicule && <span>{rdv.marque_vehicule} {rdv.modele_vehicule} {rdv.annee_vehicule}</span>}
                        </div>
                        {rdv.statut === 'EN_ATTENTE' && (
                            <button onClick={() => handleCancelAppointment(rdv.id)} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors">Annuler</button>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    // ─── Settings Tab ───
    const renderSettings = () => (
        <div className="space-y-6">
            {message.text && (
                <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Edit Profile */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Mes informations</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input type="text" value={profileData.nom} onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input type="text" value={profileData.prenom} onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" readOnly value={profileData.email} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input type="tel" value={profileData.telephone} onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                            <textarea value={profileData.adresse} onChange={(e) => setProfileData({ ...profileData, adresse: e.target.value })} rows="2" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm resize-none" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                        <Save className="h-4 w-4" />
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    {passwordMessage.text && (
                        <div className={`p-3 rounded-xl text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            {passwordMessage.text}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe *</label>
                        <div className="relative">
                            <input type={showPasswords.ancien ? 'text' : 'password'} required value={passwordData.ancien_mot_de_passe} onChange={(e) => setPasswordData({ ...passwordData, ancien_mot_de_passe: e.target.value })} className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                            <button type="button" onClick={() => setShowPasswords(p => ({ ...p, ancien: !p.ancien }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPasswords.ancien ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
                        <div className="relative">
                            <input type={showPasswords.nouveau ? 'text' : 'password'} required minLength="6" value={passwordData.nouveau_mot_de_passe} onChange={(e) => setPasswordData({ ...passwordData, nouveau_mot_de_passe: e.target.value })} className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                            <button type="button" onClick={() => setShowPasswords(p => ({ ...p, nouveau: !p.nouveau }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPasswords.nouveau ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
                        <div className="relative">
                            <input type={showPasswords.confirmer ? 'text' : 'password'} required value={passwordData.confirmer_mot_de_passe} onChange={(e) => setPasswordData({ ...passwordData, confirmer_mot_de_passe: e.target.value })} className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DB896] focus:border-transparent text-sm" />
                            <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirmer: !p.confirmer }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPasswords.confirmer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DB896] hover:bg-[#3da07e] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                        <Lock className="h-4 w-4" />
                        {loading ? 'Modification...' : 'Changer le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    )

    const tabTitles = { orders: 'Mes commandes', appointments: 'Mes rendez-vous', settings: 'Mon profil' }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {mobileSidebar && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
                    <aside className="relative w-72 max-w-[80vw] h-full bg-white shadow-xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <span className="font-bold text-gray-900 text-sm">Mon espace</span>
                            <button onClick={() => setMobileSidebar(false)} className="p-1 rounded-lg hover:bg-gray-100">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        {sidebarContent}
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0">
                <div className="flex items-center gap-2 p-5 border-b border-gray-100">
                    <span className="font-bold text-gray-900">Mon espace</span>
                </div>
                {sidebarContent}
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0">
                {/* Top bar */}
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
                    <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">{tabTitles[activeTab]}</h1>
                </div>

                <div className="p-4 lg:p-8 max-w-4xl">
                    {activeTab === 'orders' && renderOrders()}
                    {activeTab === 'appointments' && renderAppointments()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
