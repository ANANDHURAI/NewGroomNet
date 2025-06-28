import React from 'react';
import Navbar from '../basics/Navbar';
import CusSideNavBar from './CusSideNavBar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <CusSideNavBar />
        <main className="ml-64 p-6 w-full bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
