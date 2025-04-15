
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

const MainLayout = () => {
  return (
    <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Outlet />
    </div>
  )
}

export default MainLayout;