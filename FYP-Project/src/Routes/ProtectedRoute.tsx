import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../components/api/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants/constants";
import { useState, useEffect } from "react"; 


type ProtectedRouteProps = {
    children: React.ReactNode;
  };
  

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    // Makes sure we run auth first when the component is loaded
    useEffect(() => {
        auth().catch(() => setIsAuthorised(false));
    }, [])

    // Trying to get a new token from the backend
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            // Try get new token
            const res = await api.post("/api/token/refresh/",{
                 refresh: refreshToken
            } )

            // If successful se the token
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorised(true);
            } else {
                setIsAuthorised(false);
            }

        } catch (error) { // If any error occurs during that process
            console.log(error);
            setIsAuthorised(false);
        }
    }

    const auth = async () => {

        // Try to get the access token first
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorised(false);
            return;
        }

        // Check if the token has expired or not
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;

        const now = Date.now() / 1000;

        // If the token expired refresh
        if (tokenExpiration != null && tokenExpiration < now) {
            await refreshToken();

        } else {
            setIsAuthorised(true);
        }
    }

    // Nothing has happened yet
    if (isAuthorised == null) {
        return (
            <div>Loading...</div>
        )
    }


    // If is authorised return children else got to the login page
    return (
        isAuthorised ? <>{children}</> : <Navigate to="/login"/>
    )
}

export default ProtectedRoute;