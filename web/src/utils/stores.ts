import create from 'zustand';
import {persist} from 'zustand/middleware';

interface AuthState {
  token?: string;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (token: string) => set({token}),
    }),
    {
      name: 'authStore',
      getStorage: () => localStorage,
    },
  ),
);

export type Place = {
  id: number;
  name: string;
  description: string;
  address: string;
  main_image: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  history: Place[];
};

interface UserState {
  user?: User;
  setUser: (user?: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: User) => set({user}),
    }),
    {
      name: 'userStore',
      getStorage: () => localStorage,
    },
  ),
);
