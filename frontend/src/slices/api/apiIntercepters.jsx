// Enhanced apiIntercepters.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:8000/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Helper function to clear all auth data
const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_type");
  localStorage.removeItem("is_admin");
};

// Helper function to redirect based on user type
const redirectToLogin = () => {
  const userType = localStorage.getItem('user_type');
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  
  clearAuthData();
  
  if (isAdmin) {
    window.location.href = '/admin-login';
  } else if (userType === 'barber') {
    window.location.href = '/barber-login';
  } else {
    window.location.href = '/login';
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Avoid infinite loops
      if (originalRequest.url?.includes('/token/refresh/')) {
        console.error('Refresh token is invalid');
        redirectToLogin();
        return Promise.reject(error);
      }

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token...');
        
        const response = await axios.post('http://localhost:8000/auth/token/refresh/', {
          refresh: refreshToken
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const newAccessToken = response.data.access;
        
        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }
        
        // Update stored token
        localStorage.setItem('access_token', newAccessToken);
        
        // Update the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Notify all queued requests
        onRefreshed(newAccessToken);
        isRefreshing = false;
        
        console.log('Token refreshed successfully');
        
        // Retry the original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        
        // Clear subscribers array
        refreshSubscribers = [];
        
        // If refresh fails, redirect to login
        redirectToLogin();
        
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 errors (Forbidden)
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
      // Don't redirect for 403, just reject the promise
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;