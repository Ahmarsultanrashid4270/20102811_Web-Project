// ==============================================================================
// AUTHENTICATION CONTEXT (frontend/src/context/AuthContext.jsx)
// Global Login State, Session Persistence Aur Auth Functions
// Roman Urdu Comments: Har line ki asaan wazahat
// ==============================================================================

// 1. React Context hooks import karna
import React, { createContext, useContext, useState, useEffect } from 'react';

// 2. AuthContext object create karna
const AuthContext = createContext();

/**
 * 3. AuthProvider Component: Poori website ke bachon (children) ko login info deta hai
 */
export const AuthProvider = ({ children }) => {
  // Login user ki state (Shuru mein null hoga ya LocalStorage se aayega)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. useEffect: Jab page pehli dafa browser mein khulay
  // LocalStorage check karo taake browser refresh karne par login khatam na ho
  useEffect(() => {
    const savedUser = localStorage.getItem('kindred_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser)); // JSON string ko wapis object bana kar state mein save karo
      } catch (e) {
        localStorage.removeItem('kindred_user');
      }
    }
    setLoading(false); // Check mukammal ho gaya
  }, []);

  /**
   * 5. login function: Backend API ko email aur password bhejta hai
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // Agar backend se error aaye (e.g. Invalid password)
      if (!response.ok) {
        throw new Error(data.message || 'Login nakam ho gaya');
      }

      // User data ke sath token jodna
      const userData = {
        ...data.user,
        token: data.token
      };

      // State aur browser ki permanent memory (LocalStorage) dono mein save karna
      setUser(userData);
      localStorage.setItem('kindred_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /**
   * 6. register function: Naya account banane ke liye backend API ko call karna
   */
  const register = async (name, email, password, role = 'donor') => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account registration nakam ho gayi');
      }

      const userData = {
        ...data.user,
        token: data.token
      };

      // Naya user foran login ho jaye
      setUser(userData);
      localStorage.setItem('kindred_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /**
   * 7. logout function: User ko sign out karna
   */
  const logout = () => {
    setUser(null);                           // React state ko khali karo
    localStorage.removeItem('kindred_user'); // Browser ki memory se token ura do
  };

  return (
    // Context Provider: Har component ko yeh 5 cheezein dastiyab karata hai
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook taake kisi bhi component mein asani se 'const { user, login } = useAuth();' likh sakein
export const useAuth = () => useContext(AuthContext);
