import { useEffect, useState } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(Boolean(token));
  }, []);

  return { isLoggedIn };
}
