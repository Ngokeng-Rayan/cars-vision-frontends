import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Separator } from '../ui/separator'
import NewsletterForm from '../common/NewsletterForm'

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Cars Vision <span className="text-brand-mint">Auto</span>
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Votre partenaire automobile de confiance à Douala depuis 2019.
                            Garage familial spécialisé en réparation, maintenance et upgrade de véhicules.
                        </p>
                        <div className="flex space-x-4">
                            {/* Facebook */}
                            <a href="https://www.facebook.com/people/cars-vision-auto/61567000356848/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-mint transition-colors" title="Facebook">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://www.instagram.com/carvisionauto/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-mint transition-colors" title="Instagram">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            {/* TikTok */}
                            <a href="https://www.tiktok.com/@carvisionauto" target="_blank" rel="noopener noreferrer" className="hover:text-brand-mint transition-colors" title="TikTok">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.7a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.13z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="https://www.youtube.com/@CarVisionAuto" target="_blank" rel="noopener noreferrer" className="hover:text-brand-mint transition-colors" title="YouTube">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Liens Rapides</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to="/services" className="hover:text-brand-mint transition-colors">
                                    Nos Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="hover:text-brand-mint transition-colors">
                                    Boutique
                                </Link>
                            </li>
                            <li>
                                <Link to="/appointments" className="hover:text-brand-mint transition-colors">
                                    Prendre RDV
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-brand-mint transition-colors">
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-brand-mint transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold mb-4">Nos Services</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Vidange moteur</li>
                            <li>Révision complète</li>
                            <li>Diagnostic électronique</li>
                            <li>Freinage</li>
                            <li>Climatisation</li>
                            <li>Géométrie</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-brand-mint shrink-0 mt-0.5" />
                                <div>
                                    <p>Bonamoussadi, Douala</p>
                                    <p>Ndokoti, Douala</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-brand-mint" />
                                <div>
                                    <p>+237 676 889 008</p>
                                    <p>+237 678 870 171</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-brand-mint" />
                                <a href="mailto:contact@carsvisionauto.cm" className="hover:text-brand-mint transition-colors">
                                    contact@carsvisionauto.cm
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 text-sm">
                            <p className="text-brand-mint font-medium">Horaires</p>
                            <p className="text-gray-300">Lun-Sam: 7h30 - 18h30</p>
                            <p className="text-gray-300">Dimanche: Fermé</p>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="max-w-2xl mx-auto text-center">
                        <h4 className="text-xl font-bold mb-2">Restez informé</h4>
                        <p className="text-gray-300 text-sm mb-4">
                            Inscrivez-vous à notre newsletter pour recevoir nos promotions et actualités
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <Separator className="my-8 bg-gray-700" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© 2026 Cars Vision Auto. Tous droits réservés.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link to="/unsubscribe" className="hover:text-brand-mint transition-colors">
                            Se désabonner
                        </Link>
                        <Link to="/privacy" className="hover:text-brand-mint transition-colors">
                            Politique de confidentialité
                        </Link>
                        <Link to="/terms" className="hover:text-brand-mint transition-colors">
                            Conditions d'utilisation
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
