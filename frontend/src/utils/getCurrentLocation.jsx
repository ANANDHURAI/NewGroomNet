export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        if (err.code === err.POSITION_UNAVAILABLE) {

          console.warn('Falling back to Bengaluru location');

          resolve({
            latitude: 13.0827,   
            longitude: 80.2707, 
          });
        } else {
          reject('Location error: ' + err.message);
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
