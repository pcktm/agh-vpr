import {useEffect, useState} from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import create from 'zustand/react';
import {useAuthStore, useUserStore} from './utils/stores';
import {useAxios} from './utils/useAxios';
import IndexView from './views/Index';
import LoginView from './views/Login';
import SignupView from './views/Signup';

function App() {
  const token = useAuthStore((state) => state.token);
  const setUser = useUserStore((state) => state.setUser);
  const axios = useAxios();
  useEffect(() => {
    if (token) {
      axios.get('/user/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setUser(undefined);
      console.debug('Logged out');
    }
  }, [token, axios, setUser]);

  return (
    <div className="bg-slate-900 text-slate-100">
      <RouterProvider router={createBrowserRouter(
        createRoutesFromElements([
          <Route path="/" element={<IndexView />} />,
          <Route path="/login" element={<LoginView />} />,
          <Route path="/signup" element={<SignupView />} />,
        ]),
      )}
      />
    </div>
  );
}

export default App;
