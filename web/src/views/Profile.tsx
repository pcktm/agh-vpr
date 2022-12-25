import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {useEffect, useMemo} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import gravatarUrl from 'gravatar-url';
import {User, useUserStore} from '../utils/stores';

export default function ProfileView() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const avatarUrl = useMemo(() => gravatarUrl(user?.email ?? 'AGH', {size: 256, default: 'identicon'}), [user?.email]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen container mx-auto pt-6 md:pt-10 px-4">
      <div className="flex flex-row items-cente mb-5 md:mb-10">
        <Link to="/">
          <div className="flex flex-row items-center gap-2">
            <ArrowLeftIcon className="h-6 w-6 text-indigo-200" />
            <p className="underline">
              <span className="text-indigo-200 text-lg">Wróć do wyszukiwania</span>
            </p>
          </div>
        </Link>
      </div>
      <h1 className="text-3xl font-bold font-secondary mb-6">Twój profil</h1>
      <div className="flex flex-col items-center mb-12 w-full">
        <div className="flex flex-col w-full sm:flex-row items-center gap-4 md:gap-10 p-6 md:p-8 rounded border border-indigo-600 backdrop-brightness-125">
          <img
            className="rounded-full w-32 h-32 object-cover border-indigo-500"
            src={avatarUrl}
            alt=""
          />
          <div className="flex flex-col items-center">
            <h4 className="text-2xl font-bold font-secondary">{`${user.first_name} ${user.last_name}`}</h4>
            <p className="text-sm">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold font-secondary mb-4">Historia twoich wyszukiwań</h2>
    </div>
  );
}
