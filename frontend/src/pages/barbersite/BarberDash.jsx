import React, { useEffect, useState } from 'react';
import BarberSidebar from '../../components/barbercompo/BarberSidebar';
import apiClient from '../../slices/api/apiIntercepters';
import LoadingSpinner from '../../components/admincompo/LoadingSpinner';
import LocationModal from '../../components/basics/LocationModal';
import { getCurrentLocation } from '../../utils/getCurrentLocation';
import { MapPin } from 'lucide-react';

function BarberDash() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem('locationSent')) {
      const timer = setTimeout(() => setShowLocationModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnableLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      sessionStorage.setItem('locationSent', 'true');
      setShowLocationModal(false);

      await apiClient.post('/customersite/user-location/', {
        latitude: loc.latitude,
        longitude: loc.longitude,
        user_type: 'barber'
      });
      console.log('Barber location sent successfully');
    } catch (err) {
      setLocationError(err);
    }
  };

  const handleDismissLocation = () => setShowLocationModal(false);

  useEffect(() => {
    apiClient.get('/barbersite/barber-dash/')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BarberSidebar />
      <LocationModal 
        isOpen={showLocationModal}
        onEnableLocation={handleEnableLocation}
        onDismiss={handleDismissLocation}
      />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {locationError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-700">
                {locationError}
                <button onClick={handleEnableLocation} className="ml-2 underline">
                  Try Again
                </button>
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {data?.user?.name || 'Barber'}!
                </h1>
                <p className="text-gray-600 text-lg">{data?.user?.email}</p>
                {location && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location enabled - Customers can find you nearby
                  </p>
                )}
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BarberDash;
