import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { store } from './redux/store'
import { syncWithStorage } from './slices/auth/LoginSlice'
import LoginPage from './pages/authservice/LoginPage'
import RegisterPage from './pages/authservice/RegsiterPage'
import HomePage from './pages/commonpages/HomePage'
import OtpPage from './pages/authservice/OtpPage'
import ProtectedRoute from './components/protectRoute/ProtectedRoute'
import AdminLogin from './pages/authservice/AdminLogin'
import AdminDasboard from './pages/adminsite/AdminDasboard'
import AdminProtectedRoute from './components/protectRoute/AdminProtectedRoute';
import CustomersList from './pages/adminsite/CustomersList'
import UsersDetails from './pages/adminsite/UsersDeatails'
import Landing from './pages/commonpages/LandingPage'
import ProfilePage from './pages/commonpages/ProfilePage'
import BarberPersDetails from './pages/authservice/BarberPersDetails'
import DocumentUpload from './pages/authservice/DocumentUpload'
import BarberStatus from './pages/authservice/BarberStatus'
import VerificationPage from './pages/adminsite/VericationPage'
import BarberDash from './pages/barbersite/BarberDash'
import BarberLoginPage from './pages/authservice/BarberLoginPage'


function AppInitializer() {
  const dispatch = useDispatch();
  
  useEffect(() => {

    dispatch(syncWithStorage());
  }, [dispatch]);
  
  return null;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp" element={<OtpPage />} />
          
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDasboard />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/" element={<Landing />} />
          <Route path="/customers-list" element={<CustomersList />} />
          <Route path="/customer-details/:id" element={<UsersDetails />} />
          <Route path="/landing-page" element={<Landing />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/barber-personal/" element={< BarberPersDetails/>} />
          <Route path="/barber/document-upload" element={<DocumentUpload />} />
          <Route path="/barber/status" element={<BarberStatus />} />
          <Route path="/admin-verification" element={<VerificationPage />} />

          <Route path="/barber-dash" element={<BarberDash />} />
          <Route path="/barber-login" element={<BarberLoginPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App