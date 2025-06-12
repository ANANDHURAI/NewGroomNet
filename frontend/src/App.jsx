import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import LoginPage from './pages/authservice/LoginPage'
import RegisterPage from './pages/authservice/RegsiterPage'
import HomePage from './pages/commonpages/HomePage'
import OtpPage from './pages/authservice/OtpPage'
import AdminLogin from './pages/authservice/AdminLogin'
import AdminDasboard from './pages/adminsite/AdminDasboard'
import CustomersList from './pages/adminsite/CustomersList'
import UsersDetails from './pages/adminsite/UsersDeatails'
import Landing from './pages/commonpages/LandingPage'
import ProfilePage from './pages/commonpages/ProfilePage'
import BarberPersDetails from './pages/authservice/BarberPersDetails'
import DocumentUpload from './pages/authservice/DocumentUpload'
import BarberStatus from './pages/authservice/BarberStatus'
import VerificationPage from './pages/adminsite/VericationPage'
import BarberDash from './pages/barbersite/BarberDash'
import BarbersList from './pages/adminsite/BarbersList'
import BarberDetails from './pages/adminsite/BarberDetails'
import Portfolio from './pages/barbersite/Portfolio'
import Categoryslist from './pages/adminsite/Categoryslist'
import Servicelist from './pages/adminsite/Servicelist'
import BookServices from './pages/barbersite/BookServices'
import SelectService from './pages/barbersite/SelectService'
import MyServices from './pages/barbersite/MyServices'
import { ServiceProvider } from './contexts/ServiceContext';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ServiceProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin-dashboard" element={<AdminDasboard />} />
            <Route path="/customers-list" element={<CustomersList />} />
            <Route path="/customer-details/:id" element={<UsersDetails />} />
            <Route path="/landing-page" element={<Landing />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/barber-personal" element={<BarberPersDetails />} />
            <Route path="/barber-document-upload" element={<DocumentUpload />} />
            <Route path="/barber-status" element={<BarberStatus />} />
            <Route path="/admin-verification" element={<VerificationPage />} />
            <Route path="/barber-dash" element={<BarberDash />} />
            <Route path="/barbers-list" element={<BarbersList />} />
            <Route path="/barbers-details/:id" element={<BarberDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/barbers-portfolio" element={<Portfolio />} />
            <Route path="/category" element={<Categoryslist />} />
            <Route path="/service" element={<Servicelist />} />
            
            <Route path="/barber/book-services" element={<BookServices />} />
            <Route path="/barber/select-service/:id" element={<SelectService />} />
            <Route path="/barber/my-services" element={<MyServices />} />
          </Routes>
        </ServiceProvider>
      </BrowserRouter>
    </Provider>
  );
}
export default App;

