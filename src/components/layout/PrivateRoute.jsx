import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * PrivateRoute — Protège les routes qui nécessitent une authentification.
 * Redirige vers /login si non connecté.
 */
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default PrivateRoute
