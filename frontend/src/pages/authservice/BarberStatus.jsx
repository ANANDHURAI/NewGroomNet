import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import apiClient from '../../slices/api/apiIntercepters'
import { useNavigate } from 'react-router-dom'


function BarberStatus() {
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [adminComment, setAdminComment] = useState('')
    const navigate = useNavigate()
    
    const barberState = useSelector(state => state.barberRegistration)

    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        try {
            const response = await apiClient.get('barber-reg/approve-request/')
            setStatus(response.data.status)
            setAdminComment(response.data.admin_comment || '')
        } catch (error) {
            console.error('Failed to fetch status:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEnterGroomNet = () => {
        navigate('/barber-dash')
    }

    const getStatusMessage = () => {
        switch (status) {
            case 'pending':
                return 'Your documents are under review. Please wait for admin approval.'
            case 'approved':
                return 'Congratulations! Your barber registration has been approved. You can now access your dashboard.'
            case 'rejected':
                return 'Your registration has been rejected. Please check the admin comments below.'
            default:
                return 'No status available.'
        }
    }

    const getStatusConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    color: 'text-orange-700',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    badgeColor: 'bg-orange-100 text-orange-800',
                    icon: '⏳'
                }
            case 'approved':
                return {
                    color: 'text-green-700',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    badgeColor: 'bg-green-100 text-green-800',
                    icon: '✅'
                }
            case 'rejected':
                return {
                    color: 'text-red-700',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    badgeColor: 'bg-red-100 text-red-800',
                    icon: '❌'
                }
            default:
                return {
                    color: 'text-gray-700',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    badgeColor: 'bg-gray-100 text-gray-800',
                    icon: '❓'
                }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading status...</p>
                </div>
            </div>
        )
    }

    const statusConfig = getStatusConfig()

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                        <h2 className="text-2xl font-bold text-white">Registration Status</h2>
                        <p className="text-blue-100 mt-2">Track your barber registration application</p>
                    </div>

                    {/* Status Content */}
                    <div className="p-6">
                        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6 mb-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <span className="text-3xl mr-3">{statusConfig.icon}</span>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Current Status
                                    </h3>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.badgeColor}`}>
                                    {status?.toUpperCase()}
                                </span>
                            </div>
                            
                            <p className={`text-lg ${statusConfig.color} leading-relaxed`}>
                                {getStatusMessage()}
                            </p>
                        </div>

                        {/* Progress Indicators */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>Application Submitted</span>
                                <span>Under Review</span>
                                <span>Decision Made</span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1 h-2 bg-blue-200 rounded-full">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            status === 'pending' ? 'bg-blue-500 w-1/2' :
                                            status === 'approved' || status === 'rejected' ? 'bg-blue-500 w-full' :
                                            'bg-blue-300 w-1/3'
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Admin Comment Section */}
                        {adminComment && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    Admin Comment
                                </h4>
                                <div className="bg-white border border-gray-200 rounded p-3">
                                    <p className="text-gray-700 leading-relaxed">{adminComment}</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {status === 'approved' && (
                                <button 
                                    onClick={handleEnterGroomNet}
                                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-3 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <svg className="h-6 w-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                                    </svg>
                                    Enter GroomNet
                                    <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                            
                            {status === 'rejected' && (
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Try Again
                                </button>
                            )}
                            
                            <button 
                                onClick={fetchStatus}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Refresh Status
                            </button>
                        </div>

                        {/* Success Message for Approved Status */}
                        {status === 'approved' && (
                            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-green-800 mb-1">
                                            Welcome to GroomNet!
                                        </h4>
                                        <p className="text-sm text-green-700">
                                            Your registration has been approved. Click "Enter GroomNet" to access your barber dashboard 
                                            where you can manage appointments, update your portfolio, and track your earnings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Help Section for Pending Status */}
                        {status === 'pending' && (
                            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-blue-800 mb-1">
                                            What happens next?
                                        </h4>
                                        <p className="text-sm text-blue-700">
                                            Our admin team is reviewing your submitted documents. This process typically takes 2-3 business days. 
                                            You'll receive an email notification once a decision has been made.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarberStatus