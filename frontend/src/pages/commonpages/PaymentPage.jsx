const PaymentPage = ({ bookingData, onNext, onBack }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'razorpay', name: 'Razorpay', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' }
  ];

  const handlePayment = async () => {
    if (!selectedPayment) return;
    
    setProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointmentData = {
        service: bookingData.service.id,
        barber: bookingData.barberId,
        slot: bookingData.selectedSlot.id,
        payment_method: selectedPayment
      };
      
      const response = await apiClient.post('customersite/appointments/', appointmentData);
      
      onNext({ 
        ...bookingData, 
        appointmentId: response.data.id,
        paymentMethod: selectedPayment 
      });
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <BackButton onClick={onBack} />
      
      <div className="text-center mb-8">
        <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Payment Method</h2>
        <p className="text-gray-600">Choose your preferred payment option</p>
      </div>

      <div className="space-y-4 mb-8">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedPayment === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => setSelectedPayment(method.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium">{method.name}</span>
              </div>
              {selectedPayment === method.id && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Amount:</span>
          <span className="text-xl font-bold text-green-600">${bookingData.service?.price || '0.00'}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={!selectedPayment || processing}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {processing ? 'Processing Payment...' : 'Confirm Payment'}
      </button>
    </div>
  );
};