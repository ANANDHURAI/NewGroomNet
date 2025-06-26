import React, { useEffect, useState } from 'react';
import { ChatProvider } from '../../contexts/ChatContext';
import MainChatInterface from '../../components/chatcomponents/MainChatInterface';
import apiClient from '../../slices/api/apiIntercepters';

const CustomerChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/profile-service/user-profile/');
        console.log('User profile response:', response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="h-screen">
        <MainChatInterface currentUser={currentUser} />
      </div>
    </ChatProvider>
  );
};

export default CustomerChatPage;