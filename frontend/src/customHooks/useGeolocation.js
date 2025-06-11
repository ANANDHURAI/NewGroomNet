import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');
    setPermissionRequested(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, 
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
        setError('');
      },
      (err) => {
        setLoading(false);
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions to use this service.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      options
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!permissionRequested && !location) {
        requestLocation();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [permissionRequested, location]);

  return { 
    location, 
    error, 
    loading, 
    requestLocation, 
    permissionRequested 
  };
}