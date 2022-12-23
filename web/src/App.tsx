import {useState} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import IndexView from './views/Index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexView />,
  },
]);

function App() {
  return (
    <div className="bg-slate-900 text-slate-100">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
