
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="max-w-7xl m-auto">
        <Navbar></Navbar>
        <Outlet></Outlet>
    </div>
  )
}

export default MainLayout;