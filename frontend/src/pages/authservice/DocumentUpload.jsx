import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Award, CheckCircle } from 'lucide-react'
import apiClient from '../../slices/api/apiIntercepters'
import { requestToAdmin } from '../../slices/auth/BarberRegSlice'

function DocumentUpload() {
    const [licence, setLicence] = useState(null)
    const [certificate, setCertificate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!licence || !certificate) {
            setErrors({ general: 'Please upload both licence and certificate files.' })
            return
        }

        setLoading(true)
        setErrors({})

        const formData = new FormData()
        formData.append('licence', licence)
        formData.append('certificate', certificate)

        try {
            const response = await apiClient.post('barber-reg/approve-request/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            
            dispatch(requestToAdmin())
            navigate('/barber/status')
            
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data)
            } else {
                setErrors({ general: 'Failed to upload documents. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e, type) => {
        const file = e.target.files[0]
        if (type === 'licence') {
            setLicence(file)
        } else {
            setCertificate(file)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Documents</h2>
                        <p className="text-gray-600">Please upload your professional credentials</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Licence Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors duration-200">
                            <div className="text-center">
                                <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Licence</h3>
                                <p className="text-gray-600 mb-4">Upload your barber licence (PDF, JPG, PNG)</p>
                                
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, 'licence')}
                                        className="hidden"
                                        required
                                    />
                                    <div className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Choose Licence File
                                    </div>
                                </label>
                                
                                {licence && (
                                    <div className="mt-4 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        <span className="text-sm font-medium">{licence.name}</span>
                                    </div>
                                )}
                                
                                {errors.licence && (
                                    <p className="mt-2 text-sm text-red-600">{errors.licence[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Certificate Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors duration-200">
                            <div className="text-center">
                                <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Certificate</h3>
                                <p className="text-gray-600 mb-4">Upload your barber certificate (PDF, JPG, PNG)</p>
                                
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, 'certificate')}
                                        className="hidden"
                                        required
                                    />
                                    <div className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Choose Certificate File
                                    </div>
                                </label>
                                
                                {certificate && (
                                    <div className="mt-4 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        <span className="text-sm font-medium">{certificate.name}</span>
                                    </div>
                                )}
                                
                                {errors.certificate && (
                                    <p className="mt-2 text-sm text-red-600">{errors.certificate[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Error Message */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !licence || !certificate}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Uploading Documents...
                                </div>
                            ) : (
                                'Submit for Approval'
                            )}
                        </button>

                        {/* Info Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Note:</strong> Your documents will be reviewed by our admin team. 
                                You'll receive a notification once the review is complete.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DocumentUpload