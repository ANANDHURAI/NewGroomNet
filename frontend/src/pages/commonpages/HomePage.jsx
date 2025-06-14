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
import LocationModal from '../../components/basics/LocationModal'; 
import useGeolocation from '../../customHooks/useGeolocation';

function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSent, setLocationSent] = useState(false);
  
  const user = useSelector(state => state.login.user);
  const registerUser = useSelector(state => state.register?.user);
  const currentUser = user || registerUser;
  const { location, error: locationError, loading: locationLoading, requestLocation, permissionRequested } = useGeolocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!location && !locationError && !permissionRequested) {
        setShowLocationModal(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [location, locationError, permissionRequested]);

  useEffect(() => {
    if (location) {
      setShowLocationModal(false);
    }
  }, [location]);

  useEffect(() => {
    if (location && !locationSent) {
      const sendLocationToServer = async () => {
        try {
          await apiClient.post('/customersite/user-location/', {
            latitude: location.latitude,
            longitude: location.longitude,
            user_type: currentUser?.user_type || 'customer'
          });
          setLocationSent(true);
          console.log('Location sent successfully');
        } catch (error) {
          console.error('Failed to send location:', error);
        }
      };

      sendLocationToServer();
    }
  }, [location, locationSent, currentUser]);

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

  const handleRetry = () => {
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
  };

  const handleEnableLocation = () => {
    setShowLocationModal(false);
    requestLocation();
  };

  const handleDismissLocation = () => {
    setShowLocationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LocationModal 
        isOpen={showLocationModal}
        onEnableLocation={handleEnableLocation}
        onDismiss={handleDismissLocation}
      />

      {locationError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {locationError}
                <button 
                  onClick={requestLocation}
                  className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                >
                  Try Again
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      
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
              {location && (
                <p className="text-sm text-green-600 mt-2">
                  📍 Location enabled - Showing nearby services
                </p>
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