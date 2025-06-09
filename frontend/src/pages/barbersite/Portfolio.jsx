import React, { useEffect, useState } from 'react'
import BarberSidebar from '../../components/barbercompo/BarberSidebar'
import apiClient from '../../slices/api/apiIntercepters'
import { ProfileDisplay } from '../../components/profilecompo/ProfileDisplay'
import { ProfileField } from '../../components/profilecompo/ProfileField'
import { ProfileInput } from '../../components/profilecompo/ProfileInput'
import { User, MapPin, Calendar, Globe, Edit2, Save, X } from 'lucide-react'

function Portfolio() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        expert_at: '',
        current_location: '',
        experience_years: '',
        travel_radius_km: '',
        is_available: true
    })

    useEffect(() => {
        fetchPortfolio()
    }, [])

    const fetchPortfolio = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/barbersite/barber-portfolio/')
            setData(response.data)
            setFormData({
                expert_at: response.data.expert_at || '',
                current_location: response.data.current_location || '',
                experience_years: response.data.experience_years || '',
                travel_radius_km: response.data.travel_radius_km || '',
                is_available: response.data.is_available !== undefined ? response.data.is_available : true
            })
        } catch (error) {
            console.error('Error fetching portfolio:', error)
            if (error.response?.status === 404) {
                setData(null)
                setFormData({
                    expert_at: '',
                    current_location: '',
                    experience_years: '',
                    travel_radius_km: '10.0',
                    is_available: true
                })
                setIsEditing(true)
                setError('') 
            } else {
                setError('Failed to load portfolio. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            if (!formData.expert_at.trim()) {
                setError('Expertise field is required');
                setSuccess('');
                return;
            }
            if (!formData.current_location.trim()) {
                setError('Current location is required');
                setSuccess('');
                return;
            }

            const response = await apiClient.put('/barbersite/barber-portfolio/', formData);
            setData(response.data);
            setIsEditing(false);
            setError('');
            setSuccess('Portfolio saved successfully!');

            setTimeout(() => setSuccess(''), 2000);
        } catch (error) {
            console.error('Error saving portfolio:', error);
            setSuccess('');
            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else if (error.response?.data) {
                const errors = Object.values(error.response.data).flat();
                setError(errors.join(', '));
            } else {
                setError('Failed to save portfolio. Please try again.');
            }
        }
    };


    const handleCancel = () => {
        if (data) {
            setFormData({
                expert_at: data.expert_at || '',
                current_location: data.current_location || '',
                experience_years: data.experience_years || '',
                travel_radius_km: data.travel_radius_km || '',
                is_available: data.is_available || true
            })
        }
        setIsEditing(false)
        setError('')
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <BarberSidebar />
                <div className="flex-1 p-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <BarberSidebar />
            <div className="flex-1 p-6 ml-64">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
                                <p className="text-gray-600 mt-1">
                                    {data ? 'Manage your professional information' : 'Create your professional portfolio'}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        {data ? 'Edit Portfolio' : 'Create Portfolio'}
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {data ? 'Save Changes' : 'Create Portfolio'}
                                        </button>
                                        {data && (
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {!data && !isEditing ? (
                            <div className="text-center py-12">
                                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Portfolio Found</h3>
                                <p className="text-gray-600 mb-6">Create your professional portfolio to get started</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Create Portfolio
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileField label="Expertise" icon={User}>
                                    {isEditing ? (
                                        <ProfileInput
                                            value={formData.expert_at}
                                            onChange={(value) => handleInputChange('expert_at', value)}
                                            placeholder="e.g., Hair Cutting, Beard Styling, Hair Coloring"
                                        />
                                    ) : (
                                        <ProfileDisplay 
                                            value={data?.expert_at} 
                                            icon={User} 
                                        />
                                    )}
                                </ProfileField>
                                <ProfileField label="Current Location" icon={MapPin}>
                                    {isEditing ? (
                                        <ProfileInput
                                            value={formData.current_location}
                                            onChange={(value) => handleInputChange('current_location', value)}
                                            placeholder="e.g., Downtown, City Center"
                                        />
                                    ) : (
                                        <ProfileDisplay 
                                            value={data?.current_location} 
                                            icon={MapPin} 
                                        />
                                    )}
                                </ProfileField>
                                <ProfileField label="Years of Experience" icon={Calendar}>
                                    {isEditing ? (
                                        <ProfileInput
                                            type="number"
                                            value={formData.experience_years}
                                            onChange={(value) => handleInputChange('experience_years', value)}
                                            placeholder="Enter years of experience"
                                        />
                                    ) : (
                                        <ProfileDisplay 
                                            value={data?.experience_years ? `${data.experience_years} years` : 'Not specified'} 
                                            icon={Calendar} 
                                        />
                                    )}
                                </ProfileField>
                                <ProfileField label="Travel Radius (km)" icon={Globe}>
                                    {isEditing ? (
                                        <ProfileInput
                                            type="number"
                                            value={formData.travel_radius_km}
                                            onChange={(value) => handleInputChange('travel_radius_km', value)}
                                            placeholder="Maximum travel distance"
                                        />
                                    ) : (
                                        <ProfileDisplay 
                                            value={data?.travel_radius_km ? `${data.travel_radius_km} km` : 'Not specified'} 
                                            icon={Globe} 
                                        />
                                    )}
                                </ProfileField>
                                <div className="md:col-span-2">
                                    <ProfileField label="Availability Status">
                                        {isEditing ? (
                                            <div className="flex items-center space-x-3">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_available}
                                                        onChange={(e) => handleInputChange('is_available', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-gray-900">Available for bookings</span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    data?.is_available 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {data?.is_available ? 'Available' : 'Unavailable'}
                                                </div>
                                            </div>
                                        )}
                                    </ProfileField>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Portfolio