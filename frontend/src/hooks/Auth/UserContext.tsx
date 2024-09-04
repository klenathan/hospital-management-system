import { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  username: string;
  password: string;
  job_type: string;
}

interface UserContextType {
  loggedIn: boolean;
  user: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const DefaultUserContext: UserContextType = {
  loggedIn: false,
  user: {
    username: '',
    password: '',
    job_type: '',
  },
  login: async () => { },
  logout: () => { },
};

export const UserContext = createContext<UserContextType>(DefaultUserContext);

export function UserProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User>({
    username: '',
    password: '',
    job_type: '',
  });
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const decodedUser = JSON.parse(atob(((savedUser))));
      setUser(decodedUser);
      setLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BE_ENDPOINT}api/auth/login`, {
        username,
        password,
      });

      if (response.data.status === 'success' && response.data.user.length > 0) {
        const userData: User = {
          username,
          password,
          job_type: response.data.user[0].job_type,
        };
        const encodedUser = btoa(JSON.stringify(userData));
        localStorage.setItem('user', encodedUser);
        setUser(userData);
        setLoggedIn(true);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser({
      username: '',
      password: '',
      job_type: '',
    });
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
