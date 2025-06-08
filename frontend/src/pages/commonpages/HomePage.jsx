import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../../slices/api/apiIntercepters';
import Navbar from '../../components/basics/Navbar';

function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const user = useSelector(state => state.login.user);
  const registerUser = useSelector(state => state.register?.user);
  const currentUser = user || registerUser;

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('auth/home/');
        setData(response.data.great_massage);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Failed to load home data');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Welcome to GroomNet
                {currentUser?.name && (
                  <span className="block text-3xl md:text-4xl mt-2 text-gray-700">
                    {currentUser.name}!
                  </span>
                )}
              </h1>
              
              {loading && !data && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-4 h-4 bg-pink-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse delay-150"></div>
                  <span className="text-gray-600 ml-2">Loading...</span>
                </div>
              )}
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
              
              {data && (
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
                  <p className="text-lg text-gray-700 leading-relaxed">{data}</p>
                </div>
              )}
            </div>
          </div>

          {currentUser && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentUser.name || 'User'}
                  </h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile</h3>
              <p className="text-gray-600 text-sm">Manage your account settings</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Appointments</h3>
              <p className="text-gray-600 text-sm">Book your next grooming session</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">History</h3>
              <p className="text-gray-600 text-sm">View your service history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;