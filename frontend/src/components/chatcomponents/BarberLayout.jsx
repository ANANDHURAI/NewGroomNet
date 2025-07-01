import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const BarberLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <h1 
          className="text-xl font-bold text-green-600 cursor-pointer"
          onClick={() => navigate('/barber/home')}
        >
          GroomNet Barber
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/barber/profile')}
            className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700"
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

export default BarberLayout;
