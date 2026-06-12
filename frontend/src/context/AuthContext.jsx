import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [user, setUser] = useState(() => {
   try {
     return JSON.parse(localStorage.getItem("user")) || null;
   } catch {
     return null;
   }
 });

 const login = (userData) => {
   setUser(userData);

   localStorage.setItem("user", JSON.stringify(userData));
   localStorage.setItem("token", userData.token);
 };

 const logout = () => {
   setUser(null);
   localStorage.clear();
 };

 return (
   <AuthContext.Provider
     value={{
       user,
       isAuthenticated: !!user,
       login,
       logout,
     }}
   >
     {children}
   </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) throw new Error("useAuth must be used within AuthProvider");
 return context;
}