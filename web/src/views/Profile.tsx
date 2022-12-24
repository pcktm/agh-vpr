import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {User, useUserStore} from '../utils/stores';

export default function ProfileView() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  if (!user) {
    navigate('/login');
    return null;
  }
  return (
    <div className="min-h-screen container mx-auto pt-10 px-4">
      <div className="flex flex-row items-cente mb-10">
        <Link to="/">
          <div className="flex flex-row items-center gap-2">
            <ArrowLeftIcon className="h-6 w-6 text-indigo-200" />
            <p className="underline">
              <span className="text-indigo-200 text-lg">Wróć do wyszukiwania</span>
            </p>
          </div>
        </Link>
      </div>
      <h1 className="text-3xl font-bold font-secondary mb-4">Twój profil:</h1>
      <p>
        <span className="font-bold">Imię:</span>
        {' '}
        {user.first_name}
      </p>
      <p>
        <span className="font-bold">Nazwisko:</span>
        {' '}
        {user.last_name}
      </p>

      <p>
        <span className="font-bold">Email:</span>
        {' '}
        {user.email}
      </p>
      <hr className="my-5 border-indigo-500" />
      <h2 className="text-2xl font-bold font-secondary mb-4">Historia twoich wyszukiwań:</h2>
    </div>
  );
}
