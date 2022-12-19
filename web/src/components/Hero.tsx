import {useEffect, useState} from 'react';
import axios from 'axios';
import {BuildingLibraryIcon} from '@heroicons/react/24/outline';
import PhotoCaptureInput from './PhotoCaptureInput';
import {SearchResults} from '../types';
import SearchResultsDisplay from './SearchResultsDisplay';
import styles from '../styles/hero.module.scss';

export default function Hero() {
  const [isSearching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>([]);
  const [isFirstSearch, setFirstSearch] = useState(true);

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
    setFirstSearch(false);
    setSearchResults([]);
    const formData = new FormData();
    formData.append('file', image);
    try {
      const {data} = await axios.post<SearchResults>(`${import.meta.env.VITE_API_URL}/place/find`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSearchResults(data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className={`${styles.background} min-h-screen p-2 flex flex-row justify-center border-b border-slate-400 rounded-b-xl`}>
      <div className="flex flex-col mt-4 lg:mt-24 container mx-auto">
        <div className="m-1 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4">
            <BuildingLibraryIcon className="w-14 h-14 text-slate-100" />
            <h1 className="text-5xl md:text-6xl font-black font-secondary leading-snug text-slate-100">
              Znajdź budynek
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl mt-3 font-bold text-slate-300">
            Nie wiesz gdzie jesteś? Zrób zdjęcie!
          </h2>
          <PhotoCaptureInput
            onSelect={(file) => {
              handleSearch(file);
            }}
            loading={isSearching}
          />
        </div>
        <div className="mt-8 transition-all">
          <SearchResultsDisplay results={searchResults} loading={isSearching} />
        </div>
      </div>
    </div>
  );
}
