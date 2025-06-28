export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
          resolve({
            latitude: 13.0827,
            longitude: 80.2707,
            fallback: true,
          });
        } else {
          reject('Unable to fetch location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};
