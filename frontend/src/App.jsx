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
import BarberSlotBooking from './pages/barbersite/BarberSlotBooking'
import CategoryList from './pages/customersite/CategoryList'
import ServicesList from './pages/customersite/ServicesList'
import SelectBarber from './pages/customersite/SelectBarbers'
import SelectDate from './pages/customersite/SelectDate'
import SelectTime from './pages/customersite/SelectTimeSlots'
import AddAddress from './pages/customersite/AddAddress'
import ConfirmBooking from './pages/customersite/ConfirmBooking'

// Import Protected Route components
import ProtectedRoute from './components/protectRoute/ProtectedRoute'
import AuthRoute from './components/protectRoute/AuthRoute'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ServiceProvider>
          <Routes>

            <Route path="/" element={<Landing />} />
            <Route path="/landing-page" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            
            <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/admin-login" element={<AuthRoute><AdminLogin /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            <Route path="/otp" element={<AuthRoute><OtpPage /></AuthRoute>} />

            <Route path="/barber-personal" element={<BarberPersDetails />} />
            <Route path="/barber-document-upload" element={<DocumentUpload />} />
            <Route path="/barber-status" element={<BarberStatus />} />

            <Route path="/home" element={
              <ProtectedRoute allowedUserTypes={['customer']}>
                <HomePage />
              </ProtectedRoute>
            } />
            
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedUserTypes={['admin']}>
                <AdminDasboard />
              </ProtectedRoute>
            } />

            <Route path="/barber-dash" element={
              <ProtectedRoute allowedUserTypes={['barber']}>
                <BarberDash />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/customer/categoryes" element={<CategoryList />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/select-barber" element={<SelectBarber />} />
            <Route path="/select-date" element={<SelectDate />} />
            <Route path="/select-time" element={<SelectTime />} />
            <Route path="/add-address" element={<AddAddress />} />
            <Route path="/confirm-booking" element={<ConfirmBooking />} />
            <Route path="/customers-list" element={<CustomersList />} />
            <Route path="/customer-details/:id" element={<UsersDetails />} />
            <Route path="/admin-verification" element={<VerificationPage />} />
            <Route path="/barbers-list" element={<BarbersList />} />
            <Route path="/barbers-details/:id" element={<BarberDetails />} />
            <Route path="/category" element={<Categoryslist />} />
            <Route path="/service" element={<Servicelist />} />
            <Route path="/barbers-portfolio" element={<Portfolio />} />
            <Route path="/barber/book-services" element={<BookServices />} />
            <Route path="/barber/select-service/:id" element={<SelectService />} />
            <Route path="/barber/my-services" element={<MyServices />} />
            <Route path="/barber-slot-booking" element={<BarberSlotBooking />} />

          </Routes>
        </ServiceProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;