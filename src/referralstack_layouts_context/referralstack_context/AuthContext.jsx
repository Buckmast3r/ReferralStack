import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../referralstack_services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const register = async (email, password) => {
    const user = await authService.register(email, password);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}