import React, { useEffect, useState } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import AdminSidebar from '../../components/admincompo/AdminSidebar';

function AdminDashboard() {
    const [data, setData] = useState('');

    useEffect(() => {
        apiClient.get('/auth/admin-dashboard/')
            .then(response => {
                setData(response.data.great_massage); 
            })
            .catch(error => {
                console.error('Dashboard load error:', error);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex">
            <AdminSidebar />
            
            <div className="flex-1 p-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-300/20">
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {data || "Welcome Admin!"}
                            </h1>
                            <p className="text-purple-200">You have successfully logged into the admin dashboard</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;