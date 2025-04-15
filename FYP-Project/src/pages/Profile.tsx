
import { useNavigate } from "react-router-dom";

const Profile = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout")    
  }

  return (
    <div>
        <h1>Profile Page</h1>
        <button className="btn-logout" onClick={handleLogout}>
            Logout
        </button>
    </div>
  )
}

export default Profile