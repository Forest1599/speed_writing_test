import { Link } from "react-router-dom";
import { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons/faKeyboard';
import { faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';

import { ACCESS_TOKEN } from "../../constants/constants";

const Navbar = () => {

    // const { isLoggedIn } = useAuth();
    const [ isLoggedIn ] = useState(!!localStorage.getItem(ACCESS_TOKEN));


  return (
    <nav className="p-7 navbar">
        <div className="flex justify-between text-2xl">
            <div className="text-white text-base">
                <Link to="/">
                    LOGO
                </Link>
            </div>
 
            <div className='text-center flex space-x-5'>
                <div>
                    <Link to="/">
                        <FontAwesomeIcon className="navbar-btn" icon={faKeyboard} />
                    </Link>
                </div>

                <div>
                    <Link to={isLoggedIn ? "/adaptive" : "/login"}>
                        <FontAwesomeIcon className="navbar-btn" icon={faChartSimple} />
                    </Link>
                </div>
            </div>

            <div>
                <Link to={isLoggedIn ? "/profile" : "/login"}>
                    <FontAwesomeIcon className="navbar-btn" icon={faUser} />
                </Link>
            </div>

        </div>
    </nav>
  )
}

export default Navbar;