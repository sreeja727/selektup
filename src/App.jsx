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
import ContactForm from './components/ContactForm'
import AboutPage from './components/AboutPage'
import CoursesPage from './components/CoursesPage'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'

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
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </>
  )
}
