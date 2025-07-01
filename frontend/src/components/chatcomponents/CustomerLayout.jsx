import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <h1 
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/customer/home')}
        >
          GroomNet
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/profile')}
            className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
