import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import PrivateRoute from './components/layout/PrivateRoute'

// Public pages
import HomePage from './pages/public/HomePage'
import ServicesPage from './pages/public/ServicesPage'
import ShopPage from './pages/public/ShopPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import AppointmentsPage from './pages/public/AppointmentsPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import UnsubscribePage from './pages/public/UnsubscribePage'
import BlogPage from './pages/public/BlogPage'
import BlogPostPage from './pages/public/BlogPostPage'
import TrackingPage from './pages/public/TrackingPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Client pages
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import ProfilePage from './pages/client/ProfilePage'

// Admin pages - REFONTE PRO
import DashboardPagePro from './pages/admin/DashboardPagePro'
import ProductsManagementPagePro from './pages/admin/ProductsManagementPagePro'
import OrdersManagementPagePro from './pages/admin/OrdersManagementPagePro'
import AppointmentsManagementPagePro from './pages/admin/AppointmentsManagementPagePro'
import UsersManagementPagePro from './pages/admin/UsersManagementPagePro'
import ServicesManagementPagePro from './pages/admin/ServicesManagementPagePro'
import ZonesManagementPagePro from './pages/admin/ZonesManagementPagePro'
import CategoriesManagementPagePro from './pages/admin/CategoriesManagementPagePro'
import PromotionsManagementPagePro from './pages/admin/PromotionsManagementPagePro'
import NewsletterManagementPagePro from './pages/admin/NewsletterManagementPagePro'
import BlogManagementPagePro from './pages/admin/BlogManagementPagePro'
import ActivityLogPagePro from './pages/admin/ActivityLogPagePro'

function App() {
  return (
    <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:id" element={<ProductDetailPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
          </Route>

      {/* Standalone pages hors Layout */}
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
      <Route path="/track" element={<TrackingPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Cart — accessible sans connexion */}
      <Route path="/cart" element={<Layout />}>
        <Route index element={<CartPage />} />
      </Route>

      {/* Checkout — accessible sans connexion (guest checkout) */}
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Client routes — protégées par PrivateRoute */}
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/orders" element={<Navigate to="/profile" replace />} />
      <Route path="/orders/:id" element={<Navigate to="/profile" replace />} />
      <Route path="/my-appointments" element={<Navigate to="/profile" replace />} />

      {/* Admin routes - REFONTE PRO */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPagePro />} />
        <Route path="products" element={<ProductsManagementPagePro />} />
        <Route path="orders" element={<OrdersManagementPagePro />} />
        <Route path="appointments" element={<AppointmentsManagementPagePro />} />
        <Route path="users" element={<UsersManagementPagePro />} />
        <Route path="services" element={<ServicesManagementPagePro />} />
        <Route path="zones" element={<ZonesManagementPagePro />} />
        <Route path="categories" element={<CategoriesManagementPagePro />} />
        <Route path="promotions" element={<PromotionsManagementPagePro />} />
        <Route path="newsletter" element={<NewsletterManagementPagePro />} />
        <Route path="blog" element={<BlogManagementPagePro />} />
        <Route path="activity" element={<ActivityLogPagePro />} />
      </Route>

          {/* 404 — catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
  )
}

export default App
