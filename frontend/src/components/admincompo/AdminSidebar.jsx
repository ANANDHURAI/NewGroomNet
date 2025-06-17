import React from 'react'
import { Link } from 'react-router-dom';
import Logout from '../basics/Logout';

function AdminSidebar() {
 return (
    <div className="w-64 min-h-screen bg-violet-200 border-r border-violet-300 p-6 flex-shrink-0">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-purple-600 tracking-wide">GroomNet</h2>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded"></div>
      </div>
      
      <nav className="space-y-2">
        <Link to="/customers-list" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0H9m1.5-2.25a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 11-3 0m3 0H1.5"></path>
          </svg>
          <p className="transition-colors font-medium">Users</p>
        </Link>

        <Link to="/barbers-list" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="transition-colors font-medium">Barbers</p>
        </Link>

        <Link to="/admin-verification" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="transition-colors font-medium">Verification Pendings</p>
        </Link>

        <Link to="/category" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p className="transition-colors font-medium">Categories</p>
        </Link>

        <Link to="/service" className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
          <p className="transition-colors font-medium">Services</p>
        </Link>

        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 cursor-pointer group">
          <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <p className="transition-colors font-medium">Settings</p>
        </div>

        <Link 
          to="/profile" 
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-all duration-200 group"
        >
          <svg className="w-5 h-5 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="transition-colors font-medium">Profile</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-violet-300">
          <Logout className="w-full bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/90 hover:to-red-700/90 text-white border-0" />
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar