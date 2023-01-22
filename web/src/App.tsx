import {useEffect, useState} from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import {useAuthStore, useUserStore} from './utils/stores';
import AddPlaceView from './views/AddPlace';
import IndexView from './views/Index';
import LoginView from './views/Login';
import ProfileView from './views/Profile';
import SignupView from './views/Signup';

function App() {
  const token = useAuthStore((state) => state.token);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(undefined);
      console.debug('Logged out');
    }
  }, [token, setUser, fetchUser]);

  return (
    <div className="bg-slate-900 text-slate-100">
      <RouterProvider router={createBrowserRouter(
        createRoutesFromElements([
          <Route path="/" element={<IndexView />} />,
          <Route path="/login" element={<LoginView />} />,
          <Route path="/signup" element={<SignupView />} />,
          <Route
            path="/profile"
            element={<ProfileView />}
            loader={async () => {
              if (!user) {
                return redirect('/login');
              }
              return null;
            }}
          />,
          <Route path="/add" element={<AddPlaceView />} />,
        ]),
      )}
      />
    </div>
  );
}

export default App;
