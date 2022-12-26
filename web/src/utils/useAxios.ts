import axios from 'axios';
import {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import useSWR, {useSWRConfig} from 'swr';
import {useAuthStore, useUserStore} from './stores';

export const axiosInstanceFactory = (token?: string) => axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: token ? {
    Authorization: `Bearer ${token}`,
  } : {},
});

export const useAxios = () => {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  const ax = useMemo(() => {
    const instance = axiosInstanceFactory(token);

    instance.interceptors.response.use((response) => response, (error) => {
      console.debug(error);
      if (error.response.status === 401) {
        setToken('');
        setUser(undefined);
      }
    });

    return instance;
  }, [token, setToken, setUser]);

  return ax;
};

export const useAxiosSWR = <T>(url: string, axiosOptions?: any, swrOptions?: any) => {
  const token = useAuthStore((state) => state.token);
  const ax = useAxios();
  return useSWR<T>([url, token], async ([u, t]) => {
    const {data: d} = await ax.get(u, axiosOptions);
    return d;
  });
};

export const useMutate = () => {
  const {mutate: om} = useSWRConfig();
  const token = useAuthStore((state) => state.token);
  return useCallback((key: string | string[]) => om([key, token]), [token, om]);
};
