import {
  ArrowLeftIcon, ClockIcon, PlusIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';
import {useEffect, useMemo} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import gravatarUrl from 'gravatar-url';
import {
  Modal, ModalBody, ModalContent, ModalOverlay, useDisclosure,
} from '@chakra-ui/react';
import {useAuthStore, User, useUserStore} from '../utils/stores';
import RecentPlacesList from '../components/RecentPlaces';
import {useAxios, useAxiosSWR} from '../utils/useAxios';
import CreatedPlacesList from '../components/CreatedPlacesList';
import AddPlaceForm from '../components/AddPlaceForm';

const CreatedPlacesSection = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <h2 className="text-2xl font-bold font-secondary">Utworzone miejsca</h2>
          <button className="text-green-500 text-md flex items-center gap-1 hover:underline" onClick={onOpen} type="button">
            <PlusIcon className="h-5 w-5" />
            Dodaj nowe miejsce
          </button>
        </div>
        <CreatedPlacesList />
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor="gray.900" textColor="white" p={0}>
          <ModalBody p={0}>
            <AddPlaceForm onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function ProfileView() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const avatarUrl = useMemo(() => gravatarUrl(user?.email ?? 'AGH', {size: 256, default: 'identicon'}), [user?.email]);
  const {data: currentUser} = useAxiosSWR<User>('/user/me');
  const axios = useAxios();

  if (!user) {
    navigate('/login');
    return null;
  }

  const logout = () => {
    useUserStore.setState({user: undefined});
    useAuthStore.setState({token: undefined});
    navigate('/');
  };

  return (
    <div className="container mx-auto pt-6 md:pt-10 px-4 mb-10">
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
      <div className="flex sm:flex-row justify-center sm:gap-2 mt-8 mb-4">
        <div className="flex flex-col justify-center gap-2 flex-1">
          <UserCircleIcon className="h-10 w-10 text-indigo-200" />
          <h1 className="text-3xl font-bold font-secondary">Twój profil</h1>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded text-sm bg-red-600 text-indigo-100 hover:bg-red-700 self-end"
          onClick={logout}
          type="button"
        >
          Wyloguj się
        </button>
      </div>

      <div className="flex flex-col items-center mb-3 w-full">
        <div className="flex flex-col w-full sm:flex-row items-center gap-4 md:gap-10 p-6 md:p-8 rounded border border-indigo-600 backdrop-brightness-125">
          <img
            className="rounded-full w-32 h-32 object-cover border-indigo-500"
            src={avatarUrl}
            alt=""
          />
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-2xl font-bold font-secondary text-center">{`${user.first_name} ${user.last_name}`}</h4>
            <p className="text-sm">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-12 w-full">
        <div className="flex flex-col w-full sm:flex-row items-center gap-4 md:gap-10 p-6 md:p-8 rounded border border-indigo-600 backdrop-brightness-125">
          <ClockIcon className="h-10 w-10 text-indigo-200" />
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-2xl font-bold font-secondary text-center">Ostatnie logowanie</h4>
            <div className="text-sm mt-1">
              {
                currentUser?.lastly_logged ? (
                  <p>{new Date(currentUser?.lastly_logged).toLocaleString()}</p>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 opacity-50" />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      <CreatedPlacesSection />

      <div className="flex flex-col w-full mt-4">
        <h2 className="text-2xl font-bold font-secondary">Ostatnio odwiedzone miejsca</h2>
        <RecentPlacesList />
      </div>
    </div>
  );
}
