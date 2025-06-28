import Navbar from '../basics/Navbar';
import AdminSidebar from '../admincompo/AdminSidebar';
import BarberSidebar from '../barbercompo/BarberSidebar';

function ProfileNavbar({ userType }) {
  switch (userType?.toLowerCase()) {
    case 'admin':
      return <AdminSidebar />;
    case 'barber':
      return <BarberSidebar />;
    case 'customer':
    default:
      return <Navbar />;
  }
}

export default ProfileNavbar;
