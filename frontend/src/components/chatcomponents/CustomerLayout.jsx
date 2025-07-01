import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;