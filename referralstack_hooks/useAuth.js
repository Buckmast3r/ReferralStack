import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    return authService.login(email, password).then(setUser);
  };

  const register = async (email, password) => {
    return authService.register(email, password).then(setUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}