import React, { useEffect, useState } from 'react'
import apiClient from '../../slices/api/apiIntercepters';
import TableList from '../../components/admincompo/TableList';
import AdminSidebar from '../../components/admincompo/AdminSidebar';

function CustomersList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/adminsite/customers-list/')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('customers list load error:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            {loading ? (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                    <div className="text-white text-xl">Loading...</div>
                </div>
            ) : (
                <TableList 
                    listname={'Customers List'} 
                    data={data} 
                    setData={setData}
                />
            )}
        </div>
    )
}

export default CustomersList;