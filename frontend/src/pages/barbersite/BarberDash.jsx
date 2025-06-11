import React, { useEffect, useState } from 'react'
import BarberSidebar from '../../components/barbercompo/BarberSidebar'
import apiClient from '../../slices/api/apiIntercepters'
import LoadingSpinner from '../../components/admincompo/LoadingSpinner'
import LocationModal from '../../components/basics/LocationModal'
import useGeolocation from '../../customHooks/useGeolocation'

function BarberDash() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showLocationModal, setShowLocationModal] = useState(false)
    const [locationSent, setLocationSent] = useState(false)
    
    const { location, error: locationError, requestLocation, permissionRequested } = useGeolocation()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!location && !locationError && !permissionRequested) {
                setShowLocationModal(true)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [location, locationError, permissionRequested])

    useEffect(() => {
        if (location) {
            setShowLocationModal(false)
        }
    }, [location])

    useEffect(() => {
        if (location && !locationSent) {
            const sendLocationToServer = async () => {
                try {
                    await apiClient.post('/customersite/user-location/', {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        user_type: 'barber'
                    })
                    setLocationSent(true)
                    console.log('Barber location sent successfully')
                } catch (error) {
                    console.error('Failed to send barber location:', error)
                }
            }

            sendLocationToServer()
        }
    }, [location, locationSent])

    useEffect(() => {
        apiClient.get('/barbersite/barber-dash/')
            .then(response => {
                setData(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }, [])

    const handleEnableLocation = () => {
        setShowLocationModal(false)
        requestLocation()
    }

    const handleDismissLocation = () => {
        setShowLocationModal(false)
    }

    if (loading) {
        return (
            <LoadingSpinner/>
        )
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BarberSidebar />
            
            <LocationModal 
                isOpen={showLocationModal}
                onEnableLocation={handleEnableLocation}
                onDismiss={handleDismissLocation}
            />
            
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    
                    {locationError && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        {locationError}
                                        <button 
                                            onClick={requestLocation}
                                            className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                                        >
                                            Try Again
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {data?.user?.name || 'Barber'}!
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {data?.user?.email}
                                </p>
                                {location && (
                                    <p className="text-sm text-green-600 mt-2">
                                        📍 Location enabled - Customers can find you nearby
                                    </p>
                                )}
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>   
                    
                </div>
            </main>
        </div>
    )
}

export default BarberDash