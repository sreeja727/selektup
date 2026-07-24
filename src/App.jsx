import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import { Toaster, toaster } from './components/ui/toaster'
import { getApiLoading, getCustomToast, getNavigation } from './pages/common/selectors'
import { actions as commonActions } from './pages/common/slice'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import CoursesSection from './components/CoursesSection'
import WhyChooseUs from './components/WhyChooseUs'
import ToppersSection from './components/ToppersSection'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from './components/Footer'
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
import ForgotPassword from './pages/components/ForgotPassword'
import PaymentPage from './pages/components/PaymentPage'
import AdminRoutes from './Admin/Routes/AdminRoutes'
// import Dashboard from './Admin/components/Dashboard'
import Instructions from "./pages/components/MockTest/Instructions";
import TestScreen from "./pages/components/MockTest/TestScreen";
import Result from "./pages/components/MockTest/Result";
import Review from "./pages/components/MockTest/Review";

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
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const apiLoading = useSelector(getApiLoading)
  const navigation = useSelector(getNavigation)
  const customToast = useSelector(getCustomToast)

  useEffect(() => {
    if (navigation && navigation.to) {
      navigate(navigation.to, navigation.options || {})
      dispatch(commonActions.navigateTo(null))
    }
  }, [navigation, navigate, dispatch])

  useEffect(() => {
    if (customToast && customToast.open) {
      toaster.create({
        title: customToast.title,
        description: customToast.message,
        type: customToast.variant || 'info',
        duration: 4000,
        closable: true,
      })
      dispatch(commonActions.setCustomToast({ open: false, variant: 'info', message: '', title: '' }))
    }
  }, [customToast, dispatch])

  return (
    <>
      <ScrollToTop />
      <Toaster />
      {apiLoading && <Loader fullScreen />}
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
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
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/instructions" element={<Instructions />}/>
        <Route path="/mock-test" element={<TestScreen />} />
        <Route path="/result" element={<Result />} />
        <Route path="/review" element={<Review/>}/>
        
      
     </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}
  

