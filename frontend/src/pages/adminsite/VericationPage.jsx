import React, { useEffect, useState } from 'react'
import apiClient from '../../slices/api/apiIntercepters'
import AdminSidebar from '../../components/admincompo/AdminSidebar'

function VerificationPage() {
    const [pendingRequests, setPendingRequests] = useState([])
    const [allRequests, setAllRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pending')
    const [selectedBarber, setSelectedBarber] = useState(null)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            const [pendingResponse, allResponse] = await Promise.all([
                apiClient.get('adminsite/pending-requests/'),
                apiClient.get('adminsite/all-requests/')
            ])
            
            setPendingRequests(pendingResponse.data)
            setAllRequests(allResponse.data)
        } catch (error) {
            console.error('Failed to fetch requests:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (userId, action, comment = '') => {
        try {
            await apiClient.post('adminsite/pending-requests/', {
                user_id: userId,
                action: action,
                comment: comment
            })
            
            fetchRequests()
            alert(`Request ${action}d successfully!`)
        } catch (error) {
            console.error(`Failed to ${action} request:`, error)
            alert(`Failed to ${action} request`)
        }
    }

    const viewDocuments = async (barberId) => {
        try {
            const response = await apiClient.get(`adminsite/barber-details/${barberId}/`)
            setSelectedBarber(response.data)
        } catch (error) {
            console.error('Failed to fetch barber details:', error)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-orange-100 text-orange-800 border-orange-200'
        }
    }

    const renderRequestCard = (barber) => (
        <div key={barber.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{barber.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(barber.status)}`}>
                    {barber.status?.toUpperCase()}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium text-gray-800">Email:</span> {barber.email}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium text-gray-800">Phone:</span> {barber.phone}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium text-gray-800">Gender:</span> {barber.gender}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <span className="font-medium text-gray-800">Request Date:</span> {new Date(barber.request_date).toLocaleDateString()}
                    </p>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => viewDocuments(barber.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    View Documents
                </button>
                
                {barber.status === 'pending' && (
                    <>
                        <button 
                            onClick={() => handleAction(barber.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={() => {
                                const comment = prompt('Enter rejection reason (optional):')
                                handleAction(barber.id, 'reject', comment || '')
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <AdminSidebar />
            
            <div className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Barber Verification</h1>
                    
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button 
                                    onClick={() => setActiveTab('pending')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'pending' 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Pending Requests 
                                    <span className="bg-gray-100 text-gray-900 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                        {pendingRequests.length}
                                    </span>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('all')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'all' 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    All Requests 
                                    <span className="bg-gray-100 text-gray-900 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                        {allRequests.length}
                                    </span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'pending' ? (
                            pendingRequests.length > 0 ? (
                                pendingRequests.map(renderRequestCard)
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                                    <p className="text-gray-500">All verification requests have been processed.</p>
                                </div>
                            )
                        ) : (
                            allRequests.length > 0 ? (
                                allRequests.map(renderRequestCard)
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                                    <p className="text-gray-500">No verification requests have been submitted yet.</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Document Modal */}
                    {selectedBarber && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Documents for {selectedBarber.name}
                                    </h3>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">📄 Licence</h4>
                                        {selectedBarber.licence ? (
                                            <a 
                                                href={selectedBarber.licence} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
                                            >
                                                View Licence
                                                <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <p className="text-gray-500">No licence document uploaded</p>
                                        )}
                                    </div>
                                    
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-3">🎓 Certificate</h4>
                                        {selectedBarber.certificate ? (
                                            <a 
                                                href={selectedBarber.certificate} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
                                            >
                                                View Certificate
                                                <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <p className="text-gray-500">No certificate document uploaded</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-6 border-t border-gray-200">
                                    <button 
                                        onClick={() => setSelectedBarber(null)}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerificationPage