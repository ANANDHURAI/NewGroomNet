import React from 'react';

const DocumentModal = ({ barber, onClose }) => {
    if (!barber) return null;

    const DocumentSection = ({ title, icon, document, documentType }) => {
        
        return (
            <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                    {icon} {title}
                </h4>
                {document ? (
                    <div className="space-y-2">
                        <a 
                            href={document} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
                            onClick={(e) => {
                    
                                fetch(document, { method: 'HEAD' })
                                    .then(response => {
                                        if (!response.ok) {
                                            alert(`Error: File not accessible (${response.status})`);
                                        }
                                    })
                                    .catch(error => {
                                        alert('Error: Cannot access file. Check console for details.');
                                    });
                            }}
                        >
                            View {documentType}
                            <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                ) : (
                    <p className="text-gray-500">No {documentType.toLowerCase()} document uploaded</p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Documents for {barber.name}
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    {barber.profile_image && (
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-gray-900 mb-3">
                                👤 Profile Image
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={barber.profile_image} 
                                        alt={`${barber.name}'s profile`}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            console.error('Image failed to load:', barber.profile_image);
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMCAxNi0yLTJtMCAwbC0yLTJtMiAybC0yIDJtMiAybC0yIDIiLz4KPHN2Zz4KPC9zdmc+';
                                        }}
                                    />
                                    <a 
                                        href={barber.profile_image} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        View Full Image
                                        <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    <DocumentSection 
                        title="Licence"
                        icon="📄"
                        document={barber.licence}
                        documentType="Licence"
                    />
                    
                    <DocumentSection 
                        title="Certificate"
                        icon="🎓"
                        document={barber.certificate}
                        documentType="Certificate"
                    />

                    <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                            📋 Additional Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><span className="font-medium">Status:</span> {barber.status}</p>
                            <p><span className="font-medium">Gender:</span> {barber.gender}</p>
                            <p><span className="font-medium">Email:</span> {barber.email}</p>
                            <p><span className="font-medium">Phone:</span> {barber.phone}</p>
                            <p className="md:col-span-2">
                                <span className="font-medium">Request Date:</span> {new Date(barber.request_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-200">
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentModal;