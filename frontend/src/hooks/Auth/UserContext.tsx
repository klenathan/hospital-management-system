import { createContext, ReactNode, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  first_name: string,
  last_name: string,
  username: string;
  password: string;
  job_type: string;
  userID: number,

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
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    job_type: '',
    userID: 0,

  },
  login: async () => { },
  logout: () => { },
};

export const UserContext = createContext<UserContextType>(DefaultUserContext);

export function UserProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<User>({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    job_type: '',
    userID: 0,
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
          first_name: response.data.user[0].first_name,
          last_name: response.data.user[0].last_name,
          username,
          password,
          job_type: response.data.user[0].job_type,
          userID: response.data.user[0].id,
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
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      job_type: '',
      userID: 0,
    });
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
