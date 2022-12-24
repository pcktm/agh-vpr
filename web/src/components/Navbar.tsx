import {UserIcon} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';
import {useAuthStore, useUserStore} from '../utils/stores';

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const logout = () => {
    useUserStore.setState({user: undefined});
    useAuthStore.setState({token: undefined});
  };
  return (
    <div className="mx-auto mt-1 md:mt-3 w-full container px-6 md:px-2">
      <div className="flex flex-row justify-end gap-4">
        {
          user ? (
            <div className="flex flex-col gap-0 items-end">
              <Link to="/profile" className="text-md flex items-center text-indigo-100 font-semibold hover:underline">
                {`${user.first_name} ${user.last_name}`}
              </Link>
              <button
                type="button"
                className="text-xs flex items-center text-indigo-300 hover:underline"
                onClick={logout}
              >
                Wyloguj się
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-indigo-200 font-semibold hover:underline">
              Zaloguj się
            </Link>
          )
        }
      </div>
    </div>
  );
}
