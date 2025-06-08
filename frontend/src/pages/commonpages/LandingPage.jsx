import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Scissors,
  User,
  Shield,
  Calendar,
  Star,
  CheckCircle,
  Menu,
  X,
  Smartphone,
  CreditCard
} from "lucide-react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Scissors className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                GroomNet
              </span>
            </div>
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

     
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Beauty Journey
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Connect with professional beauticians or find your perfect clients. GroomNet makes beauty services accessible, convenient, and exceptional.
            </p>
          </div>

         
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            
            <div className="group cursor-pointer border-2 border-transparent hover:border-purple-500 bg-white rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User className="text-white w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">I'm a Customer</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Find and book professional beauty services near you
                </p>
                <div className="space-y-3 mb-8">
                  {["Browse Services", "Book Appointments", "Read Reviews"].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                    to="/login"
                    className="w-full inline-block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg py-3 px-6 rounded-md transition"
                    >
                    Get Started
                </Link>
              </div>
            </div>

            <div className="group cursor-pointer border-2 border-transparent hover:border-pink-500 bg-white rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Scissors className="text-white w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">I'm a Beautician</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Grow your business and connect with new clients
                </p>
                <div className="space-y-3 mb-8">
                  {["Manage Bookings", "Build Portfolio", "Earn More"].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/barber-personal"
                  className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg py-3 px-6 rounded-md text-center transition"
                >
                  Join Now
                </Link>

              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <span>Mobile Ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">GroomNet?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the beauty industry by connecting customers with talented professionals seamlessly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="text-white w-8 h-8" />,
                title: "Easy Discovery",
                desc: "Find the perfect beautician based on location, services, and ratings.",
                color: "from-purple-500 to-purple-400"
              },
              {
                icon: <Calendar className="text-white w-8 h-8" />,
                title: "Smart Booking",
                desc: "Book appointments instantly with real-time availability and reminders.",
                color: "from-pink-500 to-pink-400"
              },
              {
                icon: <CreditCard className="text-white w-8 h-8" />,
                title: "Secure Payments",
                desc: "Multiple payment options with bank-level security and protection.",
                color: "from-blue-500 to-blue-400"
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Scissors className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold">GroomNet</span>
          </div>
          <p className="text-gray-400">
            Your trusted platform for beauty services. Connect, book, and grow.
          </p>
        </div>
      </footer>
    </div>
  );
}
