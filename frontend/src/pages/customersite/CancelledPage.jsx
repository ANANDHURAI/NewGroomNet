import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/basics/Navbar';

function CancelledPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center mt-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
        <p className="text-gray-700 mb-4">You cancelled the payment. Your booking was not completed.</p>
        <button
          onClick={() => navigate('/home')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    </>
  );
}

export default CancelledPage;
