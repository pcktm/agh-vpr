import {useEffect, useState} from 'react';
import {BuildingLibraryIcon, PlusIcon} from '@heroicons/react/24/outline';
import {useNavigate} from 'react-router-dom';
import PhotoCaptureInput from '../components/PhotoCaptureInput';
import {SearchResults} from '../types';
import SearchResultsDisplay from '../components/SearchResultsDisplay';
import styles from '../styles/hero.module.scss';
import Navbar from '../components/Navbar';
import {useAxios} from '../utils/useAxios';
import {useUserStore} from '../utils/stores';
import GlowButton from '../components/GlowButton';

export default function IndexView() {
  const [isSearching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);
  const axios = useAxios();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleSearch = async (image: File) => {
    if (!image) {
      console.warn('No image');
      return;
    }
    if (isSearching) {
      console.warn('Already searching');
      return;
    }
    setSearching(true);
    setSearchResults([]);
    const formData = new FormData();
    formData.append('file', image);
    try {
      const {data} = await axios.post<SearchResults>('/place/find', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSearchResults(data.slice(0, 6) ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className={`${styles.background} min-h-screen pt-4 border-b border-teal-900 rounded-b-xl`}>
        <Navbar />
        <div className="p-2 flex flex-row justify-center">
          <div className="flex flex-col mt-3 lg:mt-24 container mx-auto">
            <div className="m-1 overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4">
                <BuildingLibraryIcon className="md:w-14 md:h-14 h-9 w-9 text-slate-100" />
                <h1 className="text-3xl md:text-5xl font-black font-secondary leading-snug text-slate-100">
                  Znajdź budynek
                </h1>
              </div>
              <h2 className="text-lg md:text-2xl mt-0 md:mt-2 font-bold text-slate-300">
                Nie wiesz gdzie jesteś? Zrób zdjęcie!
              </h2>
              <div className="flex md:flex-row flex-col-reverse mt-10 gap-2">
                <PhotoCaptureInput
                  onSelect={(file) => {
                    handleSearch(file);
                  }}
                  loading={isSearching}
                  className="flex-1"
                />
                {
                  false && (
                    <GlowButton
                      onClick={() => navigate('/add')}
                      className="border-teal-800 bg-teal-600 bg-opacity-10 hover:border-teal-600"
                    >
                      <PlusIcon className="w-7 h-7" />
                      Dodaj budynek
                    </GlowButton>
                  )
                }
              </div>
            </div>
            <div className="mt-8 transition-all">
              <SearchResultsDisplay results={searchResults} loading={isSearching} />
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-2 mx-auto p-4">
        <h3 className="text-lg">Jak to działa?</h3>
        <p className="text-sm text-slate-300">
          Najpierw filtrujemy budynki po lokalizacji, w której się znajdujesz.
          Następnie każde z tych wyszukanych prawdopodobnych par budynków zostanie porównane przez
          głęboką grafową sieć neuronową, która spróbuje znaleźć największe podobieństwo między twoim zdjęciem, a naszymi.
          Pokazujemy Ci tylko te budynki, które są najbardziej prawdopodobne.
        </p>
        <h3 className="text-lg mt-4">Czy zapisujecie zdjęcia?</h3>
        <p className="text-sm text-slate-300">
          Nie, nigdy nie zapisujemy przesłanych przez Ciebie zdjęć.
        </p>
      </div>
    </>
  );
}
