import React, { useState } from 'react'
import Input from '../../components/basics/Input'
import apiClient from '../../slices/api/apiIntercepters'
import { useDispatch } from 'react-redux'
import { barberlogin } from '../../slices/auth/BarberLogSlice'
import { useNavigate } from 'react-router-dom'

function BarberLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    apiClient.post('/barbersite/barber-login/', { email, password })
      .then(response => {
        const { access, refresh } = response.data
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        dispatch(barberlogin({ email, password }))
        navigate('/barber-dash')
      })
      .catch(error => {
        console.error('Login error:', error)
        alert('Login failed. Please check your credentials.')
      })
  }

  const handleRegisterRedirect = () => {
    navigate('/barber-personal')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Beautician Login</h2>

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          name="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          name="password"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 mt-2"
        >
          Login as Beautician
        </button>

        <button
          onClick={handleRegisterRedirect}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-200 mt-4"
        >
          Register as Groomnet Beautician
        </button>
      </div>
    </div>
  )
}

export default BarberLoginPage
