import { useState } from 'react'
import {
    ShoppingCart, Calendar, Users, Package,
    Banknote, ArrowRight, RefreshCw
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import {
    useDashboardStats,
    useDashboardStatsByPeriod
} from '../../hooks/useDashboard'
import StatCard from '../../components/admin/StatCard'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Alert from '../../components/common/Alert'
import { useToast } from '../../components/common/Toast'

const DashboardPagePro = () => {
    const [period, setPeriod] = useState('mois')
    const queryClient = useQueryClient()
    const toast = useToast()

    // PHASE 3.2 : TanStack Query pour gestion d'état et cache
    const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats()
    const { data: periodStatsData, isLoading: periodLoading } = useDashboardStatsByPeriod(period)
    const loading = statsLoading || periodLoading

    const stats = statsData?.data ? {
        ...statsData.data,
        periodStats: periodStatsData?.data
    } : null

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        toast.success('Dashboard actualisé')
    }

    if (statsError) {
        toast.error('Erreur lors du chargement du dashboard')
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR').format(price || 0)
    }

    const periodLabel = { jour: "aujourd'hui", semaine: 'cette semaine', mois: 'ce mois', annee: 'cette année' }[period] || ''

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">
                        Vue d'ensemble de votre activité • {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {['jour', 'semaine', 'mois', 'annee'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${period === p
                                    ? 'bg-[#4DB896] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }
              `}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                    <button
                        onClick={handleRefresh}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Actualiser"
                    >
                        <RefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Alertes */}
            {stats?.produits_stock_faible?.length > 0 && (
                <Alert
                    type="warning"
                    title="Stock faible"
                    message={`${stats.produits_stock_faible.length} produit(s) ont un stock faible`}
                />
            )}
            {stats?.avis_en_attente > 0 && (
                <Alert
                    type="info"
                    title="Avis en attente"
                    message={`${stats.avis_en_attente} avis en attente de modération`}
                />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={`Chiffre d'affaires (${periodLabel})`}
                    value={formatPrice(stats?.periodStats?.revenu_total || stats?.commandes_mois?.revenu) + ' FCFA'}
                    subtitle={`${stats?.periodStats?.nombre_commandes ?? stats?.commandes_mois?.nombre ?? 0} commande(s)`}
                    icon={Banknote}
                    color="mint"
                />
                <StatCard
                    title="Total commandes"
                    value={stats?.periodStats?.nombre_commandes ?? stats?.statistiques_generales?.total_commandes ?? 0}
                    subtitle={periodLabel}
                    icon={ShoppingCart}
                    color="blue"
                />
                <StatCard
                    title="Rendez-vous"
                    value={stats?.statistiques_generales?.total_rendezvous || 0}
                    subtitle="Total"
                    icon={Calendar}
                    color="green"
                />
                <StatCard
                    title="Clients"
                    value={stats?.statistiques_generales?.total_clients || 0}
                    subtitle="Inscrits"
                    icon={Users}
                    color="purple"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-[#4DB896]" />
                                Commandes récentes
                            </h2>
                            <a href="/admin/orders" className="text-sm text-[#4DB896] hover:text-[#3da07d] font-medium flex items-center gap-1">
                                Voir tout <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                    <div className="p-6">
                        {stats?.recentOrders?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={`${order.utilisateur?.prenom || 'Invité'} ${order.utilisateur?.nom || ''}`} size="sm" />
                                            <div>
                                                <p className="font-semibold text-gray-900">#{order.numero_commande}</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.utilisateur?.prenom || 'Commande invité'} {order.utilisateur?.nom || ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {/* FIX #8 : champ s'appelle 'total' dans le modèle */}
                                            <p className="font-bold text-[#4DB896]">{formatPrice(order.total)} FCFA</p>
                                            <Badge variant={
                                                order.statut === 'LIVREE' ? 'success' :
                                                    order.statut === 'EN_ATTENTE' ? 'warning' :
                                                        'info'
                                            } size="sm">
                                                {order.statut}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">Aucune commande récente</p>
                        )}
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#4DB896]" />
                                Rendez-vous du jour
                            </h2>
                            <a href="/admin/appointments" className="text-sm text-[#4DB896] hover:text-[#3da07d] font-medium flex items-center gap-1">
                                Voir tout <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                    <div className="p-6">
                        {stats?.recentAppointments?.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentAppointments.slice(0, 5).map((rdv) => (
                                    <div key={rdv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={`${rdv.utilisateur?.prenom} ${rdv.utilisateur?.nom}`} size="sm" />
                                            <div>
                                                <p className="font-semibold text-gray-900">{rdv.service_nom}</p>
                                                <p className="text-sm text-gray-600">
                                                    {rdv.utilisateur?.prenom} {rdv.utilisateur?.nom}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(rdv.date_rdv).toLocaleDateString('fr-FR')} {rdv.heure_debut}
                                            </p>
                                            <Badge variant={
                                                rdv.statut === 'TERMINE' ? 'success' :
                                                    rdv.statut === 'CONFIRME' ? 'info' : 'warning'
                                            } size="sm">
                                                {rdv.statut}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">Aucun rendez-vous aujourd'hui</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { href: '/admin/products', label: 'Gérer produits', icon: Package, color: 'purple' },
                            { href: '/admin/orders', label: 'Voir commandes', icon: ShoppingCart, color: 'green' },
                            { href: '/admin/appointments', label: 'Gérer RDV', icon: Calendar, color: 'blue' },
                            { href: '/admin/users', label: 'Gérer utilisateurs', icon: Users, color: 'orange' },
                        ].map(({ href, label, icon: Icon, color }) => (
                            <a
                                key={href}
                                href={href}
                                className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 group`}
                            >
                                <div className={`p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow mb-3`}>
                                    <Icon className={`h-8 w-8 text-${color}-600`} />
                                </div>
                                <span className={`text-sm font-semibold text-${color}-900`}>{label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPagePro
