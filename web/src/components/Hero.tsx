import {useState} from 'react';
import axios from 'axios';
import PhotoCaptureInput from './PhotoCaptureInput';
import {SearchResults} from '../types';
import SearchResultsDisplay from './SearchResultsDisplay';
import styles from '../styles/hero.module.scss';

export default function Hero() {
  const [isSearching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

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
    const formData = new FormData();
    formData.append('file', image);
    const {data} = await axios.post<SearchResults>(`${import.meta.env.VITE_API_URL}/place/find`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setSearching(false);
    setSearchResults(data ?? []);
  };

  return (
    <div className={`${styles.background} min-h-screen p-2 flex flex-row justify-center border-b border-slate-400 rounded-b-xl`}>
      <div className="flex flex-col mt-3 lg:mt-24 container mx-auto">
        <div className="m-1 overflow-hidden">
          <h1 className="text-5xl md:text-6xl font-black font-secondary leading-snug text-slate-100">
            Nie wiesz
            gdzie jesteś?
          </h1>
          <h2 className="text-2xl md:text-3xl mt-3 font-bold text-slate-300">
            Wyślij nam zdjęcie!
          </h2>
          <PhotoCaptureInput
            onSelect={(file) => {
              handleSearch(file);
            }}
            loading={isSearching}
          />
        </div>
        <div className="mt-8">
          <SearchResultsDisplay results={searchResults} />
        </div>
      </div>
    </div>
  );
}
