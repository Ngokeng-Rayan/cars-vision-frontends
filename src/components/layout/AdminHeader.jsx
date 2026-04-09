import { useState } from 'react'
import { Search, Bell, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const AdminHeader = () => {
    const [showProfile, setShowProfile] = useState(false)
    const { user } = useAuthStore()

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher produits, commandes, clients..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DB896] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4 ml-6">
                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Bell className="h-6 w-6 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4DB896] to-[#3da07d] rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.prenom?.[0]}{user?.nom?.[0]}
                                </span>
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">
                                    {user?.prenom} {user?.nom}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfile && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowProfile(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {user?.prenom} {user?.nom}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <a
                                        href="/admin/dashboard"
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="h-4 w-4" />
                                        Dashboard
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader
