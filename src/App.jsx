import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import CoursesSection from './components/CoursesSection'
import WhyChooseUs from './components/WhyChooseUs'
import ToppersSection from './components/ToppersSection'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from './components/Footer'
<<<<<<< HEAD
import ContactForm from './components/ContactForm'
import AboutPage from './components/AboutPage'
import CoursesPage from './components/CoursesPage'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
=======
import ContactForm from './pages/components/ContactForm'
import AboutPage from './pages/components/AboutPage'
import CoursesPage from './pages/components/CoursesPage'
import TestSeriesPage from './pages/components/TestSeriesPage'
import TestCategoryPage from './pages/components/TestCategoryPage'
import TestDetailPage from './pages/components/TestDetailPage'
import CheckoutPage from './pages/components/CheckoutPage'
import PrivacyPolicy from './pages/components/PrivacyPolicy'
import TermsOfService from './pages/components/TermsOfService'
import Login from './pages/components/Login'
import Register from './pages/components/Register'
// import Dashboard from './pages/components/Dasboard'
import PaymentPage from './pages/components/PaymentPage'
import AdminRoutes from './Admin/Routes/AdminRoutes'
import Dashboard from './Admin/pages/Dashboard'
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <WhyChooseUs />
      <ToppersSection />
      <TestimonialsSection />
    </main>
  )
}

export default function App() {
<<<<<<< HEAD
=======
  const location = useLocation()
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
        <Route path="/contact" element={<ContactForm key={location.key} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/test-series" element={<TestSeriesPage />} />
        <Route path="/test-series/:categorySlug" element={<TestCategoryPage />} />
        <Route path="/test-series/:categorySlug/:testSlug" element={<TestDetailPage />} />
        <Route path="/checkout/:categorySlug/:testSlug" element={<CheckoutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="/terms-of-service" element={<TermsOfService />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path="/admin" element={<AdminRoutes />}
      />
      

  

>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
      </Routes>
      <Footer />
    </>
  )
}
