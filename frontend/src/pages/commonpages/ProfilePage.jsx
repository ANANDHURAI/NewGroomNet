import React, { useState, useEffect } from 'react';
import apiClient from '../../slices/api/apiIntercepters';
import Navbar from '../../components/basics/Navbar';
import { ProfileImageUpload } from '../../components/profilecompo/ProfileImageUpload';
import { ProfileDisplay } from '../../components/profilecompo/ProfileDisplay';
import { ProfileField } from '../../components/profilecompo/ProfileField';
import { ProfileInput } from '../../components/profilecompo/ProfileInput';

function ProfilePage() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null); 

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        setLoading(true);
        apiClient.get('/profile-service/user-profile/')
            .then(response => {
                setData(response.data);
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.error('Profile load error:', error);
                setError('Failed to load profile');
                setLoading(false);
            });
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('gender', data.gender);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('bio', data.bio);

        if (uploadedImage instanceof File) {
            formData.append('profileimage', uploadedImage);
        }

        apiClient.put('/profile-service/user-profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setData(response.data);
            setUploadedImage(null);
            setIsEdit(false);
            setError(null);
        })
        .catch(error => {
            console.error('Profile update error:', error);
            setError('Failed to update profile');
        });
    };

    const handleCancel = () => {
        setIsEdit(false);
        setUploadedImage(null); 
        fetchProfile(); 
    };

    const handleInputChange = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleImageChange = (file) => {
        const previewUrl = URL.createObjectURL(file);
        setUploadedImage(file);
        setData(prev => ({
            ...prev,
            profileimage: previewUrl
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow p-6 max-w-md mx-4 text-center">
                    <div className="text-red-600 mb-2">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-24 rounded-t-lg"></div>
                    
                    <div className="px-6 pb-6 -mt-16 relative">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                            <ProfileImageUpload 
                                currentImage={uploadedImage || data.profileimage}
                                onImageChange={handleImageChange}
                                isEdit={isEdit}
                            />
                            
                            <div className="flex-1 mt-4 sm:mt-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {data.name || 'Profile'}
                                        </h1>
                                        <p className="text-gray-500 text-sm">
                                            {data.usertype || 'User'} • {data.email || 'No email'}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-3 mt-4 sm:mt-0">
                                        {!isEdit ? (
                                            <button 
                                                onClick={handleEdit}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={handleSave}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="Name" icon="👤">
                            {isEdit ? (
                                <ProfileInput 
                                    value={data.name || ''} 
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled 
                                />
                            ) : (
                                <ProfileDisplay value={data.name} />
                            )}
                        </ProfileField>

                        <ProfileField label="Email" icon="📧">
                            <ProfileDisplay value={data.email} />
                        </ProfileField>

                        <ProfileField label="Phone" icon="📞">
                            {isEdit ? (
                                <ProfileInput 
                                    value={data.phone || ''} 
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    disabled 
                                />
                            ) : (
                                <ProfileDisplay value={data.phone} />
                            )}
                        </ProfileField>

                        <ProfileField label="Gender" icon="⚥">
                            {isEdit ? (
                                <ProfileInput 
                                    type="select"
                                    value={data.gender || ''} 
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                />
                            ) : (
                                <ProfileDisplay value={data.gender} />
                            )}
                        </ProfileField>

                        <ProfileField label="Date of Birth" icon="📅">
                            {isEdit ? (
                                <ProfileInput 
                                    type="date"
                                    value={data.date_of_birth || ''} 
                                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                />
                            ) : (
                                <ProfileDisplay value={data.date_of_birth} />
                            )}
                        </ProfileField>

                        <ProfileField label="User Type" icon="🏷️">
                            <ProfileDisplay value={data.usertype} badge />
                        </ProfileField>
                    </div>

                    <ProfileField label="Bio" icon="📝" className="mt-6">
                        {isEdit ? (
                            <ProfileInput 
                                type="textarea"
                                value={data.bio || ''} 
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        ) : (
                            <ProfileDisplay value={data.bio} />
                        )}
                    </ProfileField>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;