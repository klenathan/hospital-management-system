/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse, CreateAxiosDefaults } from 'axios';
import { useContext, useEffect } from 'react';
import { UserContext } from '../Auth/UserContext';

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_BE_ENDPOINT}`,
  timeout: 10000,
};

/**
 * Axios instance for general API calls
 */
export const useAxios = axios.create(baseConfig);

useAxios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

useAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 * Axios instance for API calls where user context or authentication is needed
 */
export const useAxiosWithToken = () => {
  const { logout } = useContext(UserContext);

  const reqResInterceptor = (config: any) => {
    // You can add any headers or modify the config here if needed
    return config;
  };

  const reqErrInterceptor = async (error: any) => Promise.reject(error);

  const resResInterceptor = async (response: AxiosResponse) => {
    return response;
  };

  const resErrInterceptor = async (error: any) => {
    const originalRequest = error.config;

    // Handle 401 errors and trigger logout or refresh actions
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = false;
      console.error('Unauthorized request, triggering logout.', error);

      setTimeout(logout, 3000);

      // Optionally, you could also navigate to a login or home page:
      // navigate('/', { replace: true });
    }

    return Promise.reject(error);
  };

  useEffect(() => {
    // Set up interceptors
    const reqInterceptor = useAxios.interceptors.request.use(reqResInterceptor, reqErrInterceptor);
    const resInterceptor = useAxios.interceptors.response.use(resResInterceptor, resErrInterceptor);

    // Cleanup interceptors on component unmount
    return () => {
      useAxios.interceptors.request.eject(reqInterceptor);
      useAxios.interceptors.response.eject(resInterceptor);
    };
  }, [logout]);

  return useAxios;
};
