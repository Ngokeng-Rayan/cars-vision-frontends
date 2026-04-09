import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, Phone, MapPin, X, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import logoImage from '../../assets/images/logo.jpeg'

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const itemCount = useCartStore((state) => state.getItemCount())
    const { isAuthenticated, user, logout } = useAuthStore()
    const location = useLocation()
    const navigate = useNavigate()

    // Lien profil selon le rôle
    const profileLink = user?.role === 'admin' ? '/admin/dashboard' : '/profile'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(path)
    }

    const navLinkClass = (path) => {
        return `text-sm font-medium transition-colors relative pb-1 ${isActive(path)
            ? 'text-brand-mint font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-mint'
            : 'hover:text-brand-mint'
            }`
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top bar */}
            <div className="bg-brand-dark text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>+237 676 889 008</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Douala, Bonamoussadi & Ndokoti</span>
                        </div>
                    </div>
                    <div className="text-brand-mint font-medium">
                        Lun-Sam: 7h30 - 18h30
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={logoImage}
                            alt="Cars Vision Auto"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className={navLinkClass('/')}>Accueil</Link>
                        <Link to="/services" className={navLinkClass('/services')}>Services</Link>
                        <Link to="/shop" className={navLinkClass('/shop')}>Boutique</Link>
                        <Link to="/appointments" className={navLinkClass('/appointments')}>Rendez-vous</Link>
                        <Link to="/blog" className={navLinkClass('/blog')}>Blog</Link>
                        <Link to="/about" className={navLinkClass('/about')}>À propos</Link>
                        <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* User — FIX #5 : lien dynamique selon le rôle */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Link to={profileLink}>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Déconnexion
                                </Button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="outline" size="sm">Connexion</Button>
                            </Link>
                        )}

                        {/* Hamburger mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Menu mobile — Phase 3 */}
            {mobileOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="md:hidden fixed top-[88px] left-0 right-0 bg-white border-b shadow-lg z-50 animate-slide-down">
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            {[
                                { to: '/', label: 'Accueil' },
                                { to: '/services', label: 'Services' },
                                { to: '/shop', label: 'Boutique' },
                                { to: '/appointments', label: 'Rendez-vous' },
                                { to: '/blog', label: 'Blog' },
                                { to: '/about', label: 'À propos' },
                                { to: '/contact', label: 'Contact' },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                                >
                                    {label}
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </Link>
                            ))}
                            <div className="border-t mt-2 pt-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={profileLink}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                                        >
                                            Mon compte
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                        <button
                                            onClick={() => { setMobileOpen(false); handleLogout(); }}
                                            className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between px-4 py-3 rounded-lg text-brand-mint hover:bg-green-50 font-medium"
                                    >
                                        Connexion
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </>
            )}
        </header>
    )
}
