import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Plus, Home, Phone, User } from 'lucide-react';
import apiClient from '../../slices/api/apiIntercepters'; 
import Navbar from '../../components/basics/Navbar';


const AddAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [bookingParams, setBookingParams] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    building: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const bookingData = {
      service_id: params.get('service_id'),
      service_name: params.get('service_name'),
      barber_id: params.get('barber_id'),
      barber_name: params.get('barber_name'),
      slot_id: params.get('slot_id'),
      slot_date: params.get('slot_date'),
      slot_time: params.get('slot_time')
    };
    setBookingParams(bookingData);
    
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/customersite/addresses/');
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      alert('Failed to load addresses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    const queryParams = new URLSearchParams({
      ...bookingParams,
      address_id: address.id
    });

    const filteredParams = new URLSearchParams();
    for (const [key, value] of queryParams) {
      if (value && value !== 'null' && value !== 'undefined') {
        filteredParams.append(key, value);
      }
    }
    
    window.location.href = `/confirm-booking?${filteredParams.toString()}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      building: '',
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      is_default: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.mobile.trim() || !formData.city.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const response = await apiClient.post('/customersite/addresses/', formData);

      setAddresses(prev => [...prev, response.data]);
      resetForm();
      setShowForm(false);
      
      alert('Address added successfully!');
      
    } catch (error) {
      console.error('Error creating address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center mb-6">
            <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
            <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-800">Select Address</h1>
            </div>
        </div>

        {addresses.length === 0 && !showForm && (
            <div className="text-center py-8">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No Address Found</h2>
            <p className="text-gray-600 text-sm mb-6">Add your first address to continue</p>
            <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
                Add Address
            </button>
            </div>
        )}

        {addresses.length > 0 && !showForm && (
            <>
            <button
                onClick={() => setShowForm(true)}
                className="w-full bg-blue-600 text-white rounded-lg p-3 mb-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-5 h-5 mr-2" />
                Add New Address
            </button>

            <div className="space-y-4 w-full">
                {addresses.map((address) => (
                <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className="w-full bg-white rounded-xl p-5 cursor-pointer hover:shadow-md border border-gray-200 hover:border-blue-400 transition-all"
                >
                    <div className="flex items-start gap-4">
                    <Home className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">{address.name}</h3>
                        {address.is_default && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Default
                            </span>
                        )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                        {address.building}, {address.street}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {address.mobile}
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </>
        )}

        {showForm && (
            <div className="bg-white rounded-lg p-4 mt-4">
            <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number *"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                </div>

                <input
                type="text"
                name="building"
                placeholder="Building/House No."
                value={formData.building}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />

                <input
                type="text"
                name="street"
                placeholder="Street/Area"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                </div>

                <div className="grid grid-cols-2 gap-3">
                <input
                    type="text"
                    name="district"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                </div>

                <div className="flex items-center">
                <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                />
                <label className="text-sm text-gray-600">Set as default address</label>
                </div>

                <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => {
                    setShowForm(false);
                    resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 rounded-lg p-3 font-medium hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Address'}
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    </div>
    );

};

export default AddAddress;