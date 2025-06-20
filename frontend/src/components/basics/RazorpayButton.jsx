import { useEffect, useState } from "react";
import apiClient from "../../slices/api/apiIntercepters";

const RazorpayButton = ({ 
  orderId, 
  amount, 
  serviceAmount,
  platformFee,
  razorpayKey, 
  customer, 
  onSuccess, 
  onError,
  bookingId 
}) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setScriptLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          setScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePaymentSuccess = async (response) => {
    try {
      const verifyResponse = await apiClient.post("/customersite/verify-payment/", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verifyResponse.status === 200) {
        if (onSuccess) {
          onSuccess(verifyResponse.data);
        }
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      const errorMessage = error.response?.data?.error || "Payment verification failed";
      alert(errorMessage);
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = async (response) => {
    console.error('Payment failed:', response.error);
    
    try {
      await apiClient.post("/customersite/payment-failure/", {
        razorpay_order_id: orderId,
        error_code: response.error.code,
        error_description: response.error.description,
      });
    } catch (error) {
      console.error("Error reporting payment failure:", error);
    }

    alert(`Payment failed: ${response.error.description}`);
    setLoading(false);
    
    if (onError) {
      onError(response.error);
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || !window.Razorpay) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    const options = {
      key: razorpayKey,
      amount: amount * 100,
      currency: "INR",
      name: "GroomNet",
      description: "Service Booking Payment",
      order_id: orderId,
      handler: handlePaymentSuccess,
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.mobile || "",
      },
      theme: {
        color: "#2563eb",
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          console.log("Payment modal closed by user");
        },
      },
      retry: {
        enabled: true,
        max_count: 3,
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', handlePaymentFailure);
      rzp.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      alert("Unable to open payment gateway. Please try again.");
      setLoading(false);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">Payment Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Amount:</span>
            <span className="font-medium">₹{serviceAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee (5%):</span>
            <span className="font-medium">₹{platformFee}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{amount}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition duration-200 ${
          loading || !scriptLoaded
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : !scriptLoaded ? (
          "Loading Payment Gateway..."
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Secured by{" "}
          <span className="font-semibold text-blue-600">Razorpay</span>
        </p>
      </div>
    </div>
  );
};

export default RazorpayButton;