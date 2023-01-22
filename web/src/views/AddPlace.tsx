/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {ArrowLeftIcon} from '@heroicons/react/24/outline';
import {Link, useNavigate} from 'react-router-dom';
import AddPlaceForm from '../components/AddPlaceForm';

export default function AddPlaceView() {
  const navigate = useNavigate();
  const handleSubmit = async () => {
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
      <h1 className="text-3xl font-bold font-secondary">Dodaj miejsce</h1>
      <p className="text-lg font-secondary">Wypełnij poniższy formularz, aby dodać nowe miejsce</p>
      <AddPlaceForm onSubmit={handleSubmit} />
    </div>
  );
}
