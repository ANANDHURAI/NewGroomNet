import React, { useEffect, useState } from 'react'
import apiClient from '../../slices/api/apiIntercepters'
import AdminSidebar from '../../components/admincompo/AdminSidebar'

function AdminWallet() {
    const [walletData, setWalletData] = useState(null)
    const [paymentHistory, setPaymentHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchWalletData()
        fetchPaymentHistory()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/adminsite/admin-wallet/')
            setWalletData(response.data)
        } catch (error) {
            console.error('Error fetching wallet data:', error)
            setError('Failed to load wallet data')
        } finally {
            setLoading(false)
        }
    }

    const fetchPaymentHistory = async () => {
        try {
            const res = await apiClient.get('/adminsite/payment-history/')
            setPaymentHistory(res.data.history || [])
        } catch (err) {
            console.error("Error fetching payment history", err)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleString('en-IN')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading wallet data...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto mt-8">
                <strong className="font-bold">Error!</strong>
                <div className="mt-2">{error}</div>
                <button 
                    onClick={fetchWalletData}
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64">
                <AdminSidebar />
            </div>
            <div className="flex-1 p-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Wallet Dashboard</h1>

                    {/* Wallet Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">💰 Total Earnings</h2>
                            <p className="text-3xl font-bold">
                                {formatCurrency(walletData?.total_earnings)}
                            </p>
                            <p className="text-sm opacity-80 mt-2">
                                Last updated: {formatDate(walletData?.last_updated)}
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">📊 Wallet Details</h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Wallet ID:</span> {walletData?.id}</p>
                                <p><span className="font-medium">Status:</span> Active</p>
                                <p><span className="font-medium">Currency:</span> INR</p>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <button
                            onClick={() => {
                                fetchWalletData()
                                fetchPaymentHistory()
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            🔄 Refresh Data
                        </button>
                    </div>

                    {/* Payment Activity Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Payment Activity</h3>
                        {walletData?.last_updated && (
                            <div className="mt-4 p-3 bg-blue-100 rounded">
                                <p className="text-sm font-medium text-blue-800">
                                    Last transaction processed: {formatDate(walletData.last_updated)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment History Table */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">💳 Payment History</h3>
                        {paymentHistory.length === 0 ? (
                            <p className="text-gray-600">No payment history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-left border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 border">Customer</th>
                                            <th className="p-3 border">Barber</th>
                                            <th className="p-3 border">Category</th>
                                            <th className="p-3 border">Service</th>
                                            <th className="p-3 border">Method</th>
                                            <th className="p-3 border">Status</th>
                                            <th className="p-3 border">Amount</th>
                                            <th className="p-3 border">Platform Fee</th>
                                            <th className="p-3 border">Total</th>
                                            <th className="p-3 border">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((item, index) => (
                                            <tr key={index} className="border-t hover:bg-gray-50">
                                                <td className="p-3 border">{item.customer}</td>
                                                <td className="p-3 border">{item.barber}</td>
                                                <td className="p-3 border">{item.category}</td>
                                                <td className="p-3 border">{item.service}</td>
                                                <td className="p-3 border">{item.payment_method.toUpperCase()}</td>
                                                <td className="p-3 border">{item.payment_status}</td>
                                                <td className="p-3 border">{formatCurrency(item.service_amount)}</td>
                                                <td className="p-3 border">{formatCurrency(item.platform_fee)}</td>
                                                <td className="p-3 border font-semibold">{formatCurrency(item.total_amount)}</td>
                                                <td className="p-3 border">{formatDate(item.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminWallet
