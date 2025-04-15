// AuthContext.tsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import { ACCESS_TOKEN } from '../constants/constants';

// const AuthContext = createContext({
//     isLoggedIn: false,
//     setIsLoggedIn: (value: boolean) => {}
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem(ACCESS_TOKEN));

//     return (
//         <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);