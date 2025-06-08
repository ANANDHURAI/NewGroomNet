import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserToggleButton from '../basics/UserToggleButton';

function TableList({ listname, data, setData }) {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/customer-details/${id}`);
    };

    const handleUserUpdate = (updatedUser) => {
        try {
            if (!data || !Array.isArray(data)) {
                console.error('Data is not an array:', data);
                return;
            }
            
            if (!setData || typeof setData !== 'function') {
                console.error('setData is not a function:', setData);
                return;
            }

            const updatedUsers = data.map((u) =>
                u.id === updatedUser.id ? updatedUser : u
            );
            setData(updatedUsers);
        } catch (error) {
            console.error('Error in handleUserUpdate:', error);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">{listname}</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-500/20">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0H9m1.5-2.25a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 11-3 0m3 0H1.5"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-purple-300">Total Users</p>
                                <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-500/20">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-purple-300">Active Users</p>
                                <p className="text-2xl font-bold text-white">
                                    {data?.filter(user => user.is_active && !user.is_blocked).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Blocked Users */}
                    <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-500/20">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-purple-300">Blocked Users</p>
                                <p className="text-2xl font-bold text-white">
                                    {data?.filter(user => user.is_blocked).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* New This Month */}
                    <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-500/20">
                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-purple-300">New This Month</p>
                                <p className="text-2xl font-bold text-white">
                                    {data?.filter(user => {
                                        const userDate = new Date(user.created_at);
                                        const now = new Date();
                                        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                                    }).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-purple-300/20">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Customer Directory</h2>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search customers..."
                                        className="bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-purple-300"
                                    />
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300 uppercase">Joined</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-300/10">
                                {data && data.length > 0 ? (
                                    data.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {user.profileimage_url ? (
                                                        <img
                                                            src={user.profileimage_url}
                                                            alt={user.name}
                                                            className="h-10 w-10 rounded-full object-cover border border-white shadow"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                                        <div className="text-sm text-purple-300">ID: #{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-white">{user.email}</div>
                                                <div className="text-sm text-purple-300">{user.phone || 'No phone'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.is_active 
                                                            ? 'bg-green-500/20 text-green-300' 
                                                            : 'bg-gray-500/20 text-gray-300'
                                                    }`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {user.is_blocked && (
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300">
                                                            Blocked
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleView(user.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                    <UserToggleButton 
                                                        user={user} 
                                                        onUserUpdate={handleUserUpdate}
                                                        size="sm"
                                                        showText={false}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-purple-300">
                                            No customers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableList;