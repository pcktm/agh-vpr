import create from 'zustand';
import {persist} from 'zustand/middleware';
import {axiosInstanceFactory} from './useAxios';

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
  lastly_logged: string;
  history: Place[];
};

interface UserState {
  user?: User;
  setUser: (user?: User) => void;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user?: User) => set({user}),
      fetchUser: async () => {
        try {
          const {data} = await axiosInstanceFactory(useAuthStore.getState().token).get('/user/me');
          set({user: data});
        } catch (e) {
          console.error(e);
        }
      },
    }),
    {
      name: 'userStore',
      getStorage: () => localStorage,
    },
  ),
);
