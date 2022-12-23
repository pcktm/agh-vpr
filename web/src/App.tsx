import {useState} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import IndexView from './views/Index';
import LoginView from './views/Login';
import SignupView from './views/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexView />,
  },
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/signup',
    element: <SignupView />,
  }
]);

function App() {
  return (
    <div className="bg-slate-900 text-slate-100">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
