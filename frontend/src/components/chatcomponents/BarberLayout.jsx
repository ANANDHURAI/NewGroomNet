import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const BarberLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-screen flex overflow-hidden">
      <aside className="w-64 bg-[#0F172A] text-white flex-shrink-0">
        <div className="p-6 font-bold text-xl">Barber Panel</div>
        <nav className="space-y-4 px-4">
        </nav>
      </aside>

      <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BarberLayout;
