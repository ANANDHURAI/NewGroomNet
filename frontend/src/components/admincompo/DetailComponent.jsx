import React from 'react'

function DetailComponent({ user }) {
    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-4xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Customer Details</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded"></div>
                </div>

                
                <div className="bg-white/10 backdrop-blur-lg border border-purple-300/20 rounded-2xl p-8 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-1 flex flex-col items-center">
                            <div className="relative">
                                {user.profileimage_url ? (
                                    <img 
                                        src={user.profileimage_url} 
                                        alt="Profile" 
                                        className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/30 shadow-xl"
                                    />
                                ) : (
                                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                                        <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                    {user.is_active ? (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            
                            
                            <div className="mt-6 flex flex-col gap-2">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold text-center ${
                                    user.is_active 
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                    {user.is_active ? 'Active Account' : 'Inactive Account'}
                                </span>
                                
                                {user.is_blocked && (
                                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/30 text-center">
                                        Blocked User
                                    </span>
                                )}
                            </div>
                        </div>

                       
                        <div className="lg:col-span-2 space-y-6">
                           
                            <div className="bg-white/5 rounded-xl p-6 border border-purple-300/10">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">Full Name</label>
                                        <p className="text-white text-lg font-semibold">{user.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">User Type</label>
                                        <p className="text-white text-lg capitalize font-semibold">{user.user_type}</p>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="bg-white/5 rounded-xl p-6 border border-purple-300/10">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">Email Address</label>
                                        <p className="text-white text-lg break-all">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">Phone Number</label>
                                        <p className="text-white text-lg">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="bg-white/5 rounded-xl p-6 border border-purple-300/10">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    Account Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">Member Since</label>
                                        <p className="text-white text-lg">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm text-purple-300 font-medium">Account ID</label>
                                        <p className="text-white text-lg font-mono">#{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="mt-8 flex justify-end space-x-4">
            
                        <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                            user.is_blocked 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}>
                            {user.is_blocked ? 'Unblock User' : 'Block User'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailComponent