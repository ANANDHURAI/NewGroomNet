import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '../../slices/api/apiIntercepters';
import Navbar from '../../components/basics/Navbar';
import Carousel from '../../components/basics/Carousel';
import CCard from '../../components/basics/Ccard';
import SCard from '../../components/basics/Scard';
import LoadingSpinner from '../../components/admincompo/LoadingSpinner';
import { ErrorMessage } from '../../components/admincompo/categoryCom/ErrorMessage';
import ShowType from '../../components/customercompo/ShowType';

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
        const response = await apiClient.get('/customersite/home/');
        setData(response.data);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome to GroomNet
              </h1>
              {data?.greeting_message && (
                <p className="text-lg text-gray-600">{data.greeting_message}</p>
              )}
            </div>
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentUser.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <ShowType/>
        <br />
        {loading && (
          <LoadingSpinner size="large" text="Loading your dashboard..." />
        )}

        {error && (
          <ErrorMessage error={error} onRetry={handleRetry} />
        )}

        {data?.categories && data.categories.length > 0 && (
          <Carousel title="Categories">
            {data.categories.map((category) => (
              <CCard key={category.id} category={category} />
            ))}
          </Carousel>
        )}

        {data?.services && data.services.length > 0 && (
          <Carousel title="Our Services">
            {data.services.map((service) => (
              <SCard key={service.id} service={service} />
            ))}
          </Carousel>
        )}

        {data && (!data.categories?.length && !data.services?.length) && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No categories or services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;