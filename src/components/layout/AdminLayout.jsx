import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { ToastProvider } from '../../components/common/Toast'

const AdminLayout = () => {
    const { user, token, setAuth } = useAuthStore()

    useEffect(() => {
        // Restaurer la session depuis localStorage au rechargement
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')   // FIX #1 : user est maintenant stocké
        const storedRefreshToken = localStorage.getItem('refreshToken')

        if (storedToken && storedUser && !token) {
            try {
                setAuth(JSON.parse(storedUser), storedToken, storedRefreshToken || '') // FIX #1
            } catch (error) {
                // JSON parse échoué → session corrompue, on nettoie
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
            }
        }
    }, [token, setAuth])

    // Redirection si pas connecté
    if (!token) {
        return <Navigate to="/login" replace />
    }

    // Vérifier le rôle admin (seul le rôle 'admin' est défini dans le modèle)
    const userRole = user?.role?.toLowerCase()
    if (userRole !== 'admin') {
        return <Navigate to="/" replace />
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />

                <div className="lg:pl-72 transition-all duration-300">
                    <AdminHeader />

                    <main className="p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ToastProvider>
    )
}

export default AdminLayout
