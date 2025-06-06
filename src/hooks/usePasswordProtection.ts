
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const usePasswordProtection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isPasswordVerified = localStorage.getItem('utopia_password_verified') === 'true';
    const isOnPasswordScreen = location.pathname === '/';

    // If not verified and not on password screen, redirect to password screen
    if (!isPasswordVerified && !isOnPasswordScreen) {
      navigate('/');
    }

    // If verified and on password screen, redirect to home
    if (isPasswordVerified && isOnPasswordScreen) {
      navigate('/home');
    }
  }, [navigate, location.pathname]);

  const isPasswordVerified = () => {
    return localStorage.getItem('utopia_password_verified') === 'true';
  };

  const clearPassword = () => {
    localStorage.removeItem('utopia_password_verified');
    navigate('/');
  };

  return {
    isPasswordVerified,
    clearPassword
  };
};
