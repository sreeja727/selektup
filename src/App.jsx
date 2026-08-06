import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import { Toaster, toaster } from './components/ui/toaster'
import { getApiLoading, getCustomToast, getNavigation } from './pages/selectors'
import { actions as commonActions } from './pages/slice'
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
import PrivacyPolicy from './pages/components/PrivacyPolicy'
import TermsOfService from './pages/components/TermsOfService'
import Login from './pages/components/Login'
import Register from './pages/components/Register'
import ForgotPassword from './pages/components/ForgotPassword'
import ResetPassword from './pages/components/ResetPassword'
import ChangePassword from './pages/components/ChangePassword'
import AdminRoutes from './Admin/Routes/AdminRoutes'
import Instructions from "./pages/components/Mocktest/Instructions";
import TestScreen from "./pages/components/Mocktest/TestScreen";
import Result from "./pages/components/Mocktest/Result";
import Review from "./pages/components/Mocktest/Review";

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
  // Instructions (/test-series/:categorySlug/:testSlug) and TestScreen
  // (/mock-test/:categorySlug/:testSlug) run full-screen during an exam
  // attempt, so the navbar/footer chrome shouldn't be shown alongside them.
  const isExamRoute = /^\/test-series\/[^/]+\/[^/]+$/.test(location.pathname)
    || /^\/mock-test\/[^/]+\/[^/]+$/.test(location.pathname)
  const hideChrome = isAdminRoute || isExamRoute
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
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactForm key={location.key} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/test-series" element={<TestSeriesPage />} />
        <Route path="/test-series/:categoryId" element={<TestCategoryPage />} />
        <Route path="/test-series/:categorySlug/:testSlug" element={<Instructions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="/terms-of-service" element={<TermsOfService />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/change-password" element={<ChangePassword />}/>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mock-test/:categorySlug/:testSlug" element={<TestScreen />} />
        <Route path="/result" element={<Result />} />
        <Route path="/result/:submissionId" element={<Result />} />
        <Route path="/review" element={<Review/>}/>
        <Route path="/review/:submissionId" element={<Review/>}/>
     </Routes>

      {!hideChrome && <Footer />}
    </>
  );
}
  

