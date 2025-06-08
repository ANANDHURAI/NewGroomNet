import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../slices/api/apiIntercepters';
import DetailComponent from '../../components/admincompo/DetailComponent';
import AdminSidebar from '../../components/admincompo/AdminSidebar';

function BarberDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/adminsite/barbers-details/${id}/`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log('Customer detail load error:', error);
                setLoading(false);
            });
    }, [id]);

    const handleUserUpdate = (updatedUser) => {
        setData(updatedUser);
    };

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            {loading ? (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            ) : data ? (
                <DetailComponent 
                    user={data}
                    setUsers={handleUserUpdate}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    <div className="text-white text-xl">No Users</div>
                </div>
            )}
        </div>
    );
}

export default BarberDetails;