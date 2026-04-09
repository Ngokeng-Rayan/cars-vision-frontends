import { useState, useEffect } from 'react'
import {
    Settings, Save, Mail, CreditCard, Truck, Globe, Shield, AlertCircle
} from 'lucide-react'
import { settingsService } from '../../services/settingsService'
import Button from '../../components/common/Button'
import Input from '../../components/forms/Input'
import Textarea from '../../components/forms/Textarea'
import Switch from '../../components/forms/Switch'
import { useToast } from '../../components/common/Toast'

const SettingsPagePro = () => {
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('general')
    const toast = useToast()

    const [settings, setSettings] = useState({
        // Général
        site_name: '',
        site_description: '',
        contact_email: '',
        contact_phone: '',
        address: '',

        // Email
        smtp_host: '',
        smtp_port: '',
        smtp_user: '',
        smtp_password: '',

        // Paiement
        payment_method: 'cash',
        stripe_key: '',

        // Livraison
        default_shipping_fee: '',
        free_shipping_threshold: '',

        // SEO
        meta_title: '',
        meta_description: '',
        meta_keywords: '',

        // Sécurité
        maintenance_mode: false,
        allow_registration: true
    })

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            setLoading(true)
            const response = await settingsService.getAllSettings()
            const settingsData = response.data || response

            // Convertir le tableau de paramètres en objet
            const settingsObj = {}
            settingsData.forEach(param => {
                settingsObj[param.cle] = param.valeur
            })

            setSettings({ ...settings, ...settingsObj })
        } catch (error) {
            console.error('Erreur:', error)
            toast.error('Erreur lors du chargement des paramètres')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (section) => {
        try {
            // Sauvegarder les paramètres de la section active
            await settingsService.updateSettings(settings)
            toast.success('Paramètres enregistrés avec succès')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur')
        }
    }

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'payment', label: 'Paiement', icon: CreditCard },
        { id: 'shipping', label: 'Livraison', icon: Truck },
        { id: 'seo', label: 'SEO', icon: Globe },
        { id: 'security', label: 'Sécurité', icon: Shield }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres</h1>
                <p className="text-gray-600">Configurez votre application</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tabs Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${activeTab === tab.id
                                            ? 'bg-[#4DB896] text-white font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Général */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres généraux</h2>

                                <Input
                                    label="Nom du site"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                    placeholder="Cars Vision Auto"
                                />

                                <Textarea
                                    label="Description du site"
                                    value={settings.site_description}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    rows={3}
                                    placeholder="Description de votre site..."
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Email de contact"
                                        type="email"
                                        value={settings.contact_email}
                                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                        placeholder="contact@carsvision.com"
                                    />

                                    <Input
                                        label="Téléphone"
                                        value={settings.contact_phone}
                                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                        placeholder="+237 6XX XXX XXX"
                                    />
                                </div>

                                <Textarea
                                    label="Adresse"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows={2}
                                    placeholder="Adresse complète"
                                />

                                <Button variant="primary" icon={Save} onClick={() => handleSave('general')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}

                        {/* Email */}
                        {activeTab === 'email' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Email (SMTP)</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Hôte SMTP"
                                        value={settings.smtp_host}
                                        onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                                        placeholder="smtp.gmail.com"
                                    />

                                    <Input
                                        label="Port SMTP"
                                        type="number"
                                        value={settings.smtp_port}
                                        onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
                                        placeholder="587"
                                    />

                                    <Input
                                        label="Utilisateur SMTP"
                                        value={settings.smtp_user}
                                        onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                                        placeholder="votre@email.com"
                                    />

                                    <Input
                                        label="Mot de passe SMTP"
                                        type="password"
                                        value={settings.smtp_password}
                                        onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <Button variant="primary" icon={Save} onClick={() => handleSave('email')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}

                        {/* Paiement */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Paiement</h2>

                                <Input
                                    label="Clé API Stripe (optionnel)"
                                    value={settings.stripe_key}
                                    onChange={(e) => setSettings({ ...settings, stripe_key: e.target.value })}
                                    placeholder="sk_test_..."
                                />

                                <Button variant="primary" icon={Save} onClick={() => handleSave('payment')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}

                        {/* Livraison */}
                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Livraison</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Frais de livraison par défaut (FCFA)"
                                        type="number"
                                        value={settings.default_shipping_fee}
                                        onChange={(e) => setSettings({ ...settings, default_shipping_fee: e.target.value })}
                                        placeholder="2000"
                                    />

                                    <Input
                                        label="Seuil livraison gratuite (FCFA)"
                                        type="number"
                                        value={settings.free_shipping_threshold}
                                        onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                                        placeholder="50000"
                                    />
                                </div>

                                <Button variant="primary" icon={Save} onClick={() => handleSave('shipping')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}

                        {/* SEO */}
                        {activeTab === 'seo' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration SEO</h2>

                                <Input
                                    label="Meta Title"
                                    value={settings.meta_title}
                                    onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                                    placeholder="Cars Vision Auto - Pièces détachées"
                                />

                                <Textarea
                                    label="Meta Description"
                                    value={settings.meta_description}
                                    onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                                    rows={3}
                                    maxLength={160}
                                    showCount
                                    placeholder="Description pour les moteurs de recherche..."
                                />

                                <Input
                                    label="Meta Keywords"
                                    value={settings.meta_keywords}
                                    onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                                    placeholder="pièces auto, garage, douala"
                                />

                                <Button variant="primary" icon={Save} onClick={() => handleSave('seo')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}

                        {/* Sécurité */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sécurité & Maintenance</h2>

                                <div className="space-y-4">
                                    <Switch
                                        label="Mode maintenance"
                                        description="Le site affichera une page de maintenance"
                                        checked={settings.maintenance_mode}
                                        onChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
                                    />

                                    <Switch
                                        label="Autoriser les inscriptions"
                                        description="Les nouveaux utilisateurs peuvent créer un compte"
                                        checked={settings.allow_registration}
                                        onChange={(checked) => setSettings({ ...settings, allow_registration: checked })}
                                    />
                                </div>

                                {settings.maintenance_mode && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-orange-900">Mode maintenance activé</p>
                                            <p className="text-sm text-orange-700">Le site public n'est pas accessible</p>
                                        </div>
                                    </div>
                                )}

                                <Button variant="primary" icon={Save} onClick={() => handleSave('security')}>
                                    Enregistrer
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPagePro
