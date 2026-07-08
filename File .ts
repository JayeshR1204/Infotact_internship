import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimeoutOptions {
  timeoutInMinutes: number;
  onTimeout?: () => void;
}

export function useSessionTimeout({ timeoutInMinutes, onTimeout }: TimeoutOptions) {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const timeoutMs = timeoutInMinutes * 60 * 1000;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMs);
  };

  const handleLogout = () => {
    // Clear tokens out of system local storage safely
    localStorage.removeItem('auth_token');
    
    if (onTimeout) {
      onTimeout();
    } else {
      alert('Your session has expired due to inactivity. Please log back in.');
      navigate('/login');
    }
  };

  useEffect(() => {
    // Track key active user interaction signals
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Initialize primary activity tracker countdown
    resetTimer();

    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
}

