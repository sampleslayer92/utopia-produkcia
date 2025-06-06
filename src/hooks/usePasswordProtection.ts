
import { useState, useEffect } from 'react';

const PASSWORD = '9211';
const STORAGE_KEY = 'utopia_password_authenticated';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const usePasswordProtection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { timestamp } = JSON.parse(stored);
        const now = Date.now();
        
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const authenticate = (password: string): boolean => {
    if (password === PASSWORD) {
      const authData = {
        authenticated: true,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    authenticate,
    logout
  };
};
