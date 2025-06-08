import React from 'react';

const RequestCard = ({ 
    barber, 
    onViewDocuments, 
    onApprove, 
    onReject,
    showActions = true 
}) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-orange-100 text-orange-800 border-orange-200';
        }
    };

    const handleReject = () => {
        const comment = prompt('Enter rejection reason (optional):');
        if (comment !== null) {
            onReject(barber.id, comment);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
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

            {barber.admin_comment && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <span className="font-medium text-gray-800">Admin Comment:</span>
                    <p className="text-gray-600 mt-1">{barber.admin_comment}</p>
                </div>
            )}
            
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => onViewDocuments(barber.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    View Documents
                </button>
                
                {showActions && barber.status === 'pending' && (
                    <>
                        <button 
                            onClick={() => onApprove(barber.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Approve
                        </button>
                        <button 
                            onClick={handleReject}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RequestCard;