import { Link } from "react-router-dom";

const CusSideNavBar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 border-r fixed">
      <h2 className="text-2xl font-bold mb-6 text-purple-600">My Account</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/profile" className="text-gray-700 hover:text-purple-600">
          Profile
        </Link>
        <Link to="/booking-history" className="text-gray-700 hover:text-purple-600">
          Booking History
        </Link>
        <Link to="/my-addresses" className="text-gray-700 hover:text-purple-600">
          My Addresses
        </Link>
        <Link to="/wallet" className="text-gray-700 hover:text-purple-600">
          Wallet
        </Link>
      </nav>
    </div>
  );
};

export default CusSideNavBar;
