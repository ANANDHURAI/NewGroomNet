import React from 'react';
import Navbar from '../basics/Navbar';
import AdminSidebar from '../admincompo/AdminSidebar';
import BarberSidebar from '../barbercompo/BarberSidebar';

function ProfileNavbar({ userType }) {
  const renderNavigation = () => {
    switch (userType?.toLowerCase()) {
      case 'admin':
        return <AdminSidebar />;
      case 'barber':
        return <BarberSidebar />;
      case 'customer':
      default:
        return <Navbar />;
    }
  };

  return renderNavigation();
}

export default ProfileNavbar;