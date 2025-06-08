import React, { useEffect, useState } from 'react'
import BarberSidebar from '../../components/barbercompo/BarberSidebar'
import apiClient from '../../slices/api/apiIntercepters'
import LoadingSpinner from '../../components/admincompo/LoadingSpinner'

function BarberDash() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) {
        return (
            <LoadingSpinner/>
        )
    }

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BarberSidebar />
            
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {data?.user?.name || 'Barber'}!
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {data?.user?.email}
                                </p>
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