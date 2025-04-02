import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons/faKeyboard';
import { faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="p-7 navbar">
        <div className="flex justify-between text-2xl">
            <div className="text-white text-base">
                <a href="">LOGO</a>
            </div>
 
            <div className='text-center flex space-x-5'>
                <div>
                    <a href="#"><FontAwesomeIcon className="navbar-btn" icon={faKeyboard} /></a>
                </div>

                <div>
                    <a href="#"><FontAwesomeIcon className="navbar-btn" icon={faChartSimple} /></a>
                </div>
            </div>

            <div>
                <a href="#"><FontAwesomeIcon className="navbar-btn" icon={faUser} /></a>
            </div>
        </div>
    </nav>
  )
}

export default Navbar;