import axios from 'axios';
import {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import {useAuthStore} from './stores';

export const useAxios = () => {
  const token = useAuthStore((state) => state.token);
  const ax = useMemo(() => axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  }), [token]);

  return ax;
};
