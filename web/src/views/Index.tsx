import {useEffect, useState} from 'react';
import axios from 'axios';
import {BuildingLibraryIcon} from '@heroicons/react/24/outline';
import PhotoCaptureInput from '../components/PhotoCaptureInput';
import {SearchResults} from '../types';
import SearchResultsDisplay from '../components/SearchResultsDisplay';
import styles from '../styles/hero.module.scss';
import Navbar from '../components/Navbar';

export default function IndexView() {
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
    <>
      <div className={`${styles.background} min-h-screen pt-4 border-b border-slate-400 rounded-b-xl`}>
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
      </div>
      <div className="container mt-2 mx-auto p-4">
        <h3 className="text-lg">Jak to działa?</h3>
        <p className="text-sm text-slate-300">
          Aplikacja wykorzystuje...
        </p>
      </div>
    </>
  );
}
