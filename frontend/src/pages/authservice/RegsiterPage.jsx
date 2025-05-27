import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '../../components/basics/Input';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import { setRegisterData } from '../../slices/auth/RegisterSlice';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, password, name, phone } = formData;
    
    if (!email || !password || !name || !phone) {
      setError('Please fill in all fields');
      return false;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }

    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Sending registration data:', formData); 
      
      const response = await apiClient.post('/auth/register/', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        user_type: 'customer'
      });
      
      console.log('Registration response:', response.data)
      if (response.data.email) {
        
        dispatch(setRegisterData(formData));
        localStorage.setItem('pending_email', response.data.email);
        navigate('/otp');
      }
    } catch (error) {
      console.error("Registration error", error);
      console.error("Error response:", error.response?.data)
      
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = [];
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${errorData[key]}`);
            }
          });
          setError(errorMessages.join('\n'));
        } else {
          setError(errorData.error || errorData.message || 'Registration failed');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm whitespace-pre-line">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <Input
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Full Name"
              required
              autoComplete="off"
            />
            
            <Input
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="Email Address"
              type="email"
              required
              autoComplete="off"
            />
            
            <Input
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              placeholder="Phone Number (10 digits)"
              type="tel"
              maxLength="10"
              required
              autoComplete="off"
            />
            
            <Input
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              placeholder="Password (min 8 characters)"
              type="password"
              required
              autoComplete="new-password"
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;







