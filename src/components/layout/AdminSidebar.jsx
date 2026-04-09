import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Package, ShoppingCart, Calendar, Users, Wrench,
    MapPin, FolderTree, Tag, FileText, Mail, Activity,
    ChevronLeft, ChevronRight, LogOut, Menu, X
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()
    const { logout } = useAuthStore()

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            activeColor: 'bg-blue-100'
        },
        {
            name: 'Produits',
            href: '/admin/products',
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            activeColor: 'bg-purple-100'
        },
        {
            name: 'Commandes',
            href: '/admin/orders',
            icon: ShoppingCart,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            activeColor: 'bg-green-100'
        },
        {
            name: 'Rendez-vous',
            href: '/admin/appointments',
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            activeColor: 'bg-orange-100'
        },
        {
            name: 'Utilisateurs',
            href: '/admin/users',
            icon: Users,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            activeColor: 'bg-pink-100'
        },
        {
            name: 'Services',
            href: '/admin/services',
            icon: Wrench,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            activeColor: 'bg-cyan-100'
        },
        {
            name: 'Zones Livraison',
            href: '/admin/zones',
            icon: MapPin,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            activeColor: 'bg-indigo-100'
        },
        {
            name: 'Catégories',
            href: '/admin/categories',
            icon: FolderTree,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            activeColor: 'bg-yellow-100'
        },
        {
            name: 'Promotions',
            href: '/admin/promotions',
            icon: Tag,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            activeColor: 'bg-red-100'
        },
        {
            name: 'Blog',
            href: '/admin/blog',
            icon: FileText,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            activeColor: 'bg-teal-100'
        },
        {
            name: 'Newsletter',
            href: '/admin/newsletter',
            icon: Mail,
            color: 'text-violet-600',
            bgColor: 'bg-violet-50',
            activeColor: 'bg-violet-100'
        },
        {
            name: 'Journal',
            href: '/admin/activity',
            icon: Activity,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            activeColor: 'bg-gray-100'
        },
    ]

    const isActive = (href) => location.pathname === href

    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Overlay Mobile */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        {!collapsed && (
                            <Link to="/admin/dashboard" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#4DB896] to-[#3da07d] rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">CV</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">Cars Vision</h1>
                                    <p className="text-xs text-gray-500">Admin Panel</p>
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {collapsed ? (
                                <ChevronRight className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronLeft className="h-5 w-5 text-gray-600" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${active
                                            ? `${item.activeColor} ${item.color} font-semibold shadow-sm`
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                                    title={collapsed ? item.name : ''}
                                >
                                    <div className={`p-2 rounded-lg ${active ? item.bgColor : 'bg-gray-100'}`}>
                                        <Icon className={`h-5 w-5 ${active ? item.color : 'text-gray-600'}`} />
                                    </div>
                                    {!collapsed && (
                                        <span className="flex-1">{item.name}</span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                text-red-600 hover:bg-red-50 transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
              `}
                            title={collapsed ? 'Déconnexion' : ''}
                        >
                            <div className="p-2 rounded-lg bg-red-100">
                                <LogOut className="h-5 w-5" />
                            </div>
                            {!collapsed && <span className="flex-1 text-left font-medium">Déconnexion</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar
