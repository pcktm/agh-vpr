import {useState} from 'react';
import axios from 'axios';
import PhotoCaptureInput from './PhotoCaptureInput';
import {SearchResults} from '../types';
import SearchResultsDisplay from './SearchResultsDisplay';

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
    <div className="min-h-screen p-2 flex flex-col md:justify-center border-b border-stone-400 rounded-b-xl backdrop-blur">
      <div className="flex flex-col xl:flex-row">
        <div className="m-1 overflow-hidden p-4 xl:w-2/5">
          <h1 className="text-5xl md:text-6xl font-black font-secondary text-stone-100">
            Nie wiesz
            gdzie jesteś?
          </h1>
          <h2 className="text-2xl md:text-3xl mt-1 font-bold text-stone-300">
            Wyślij nam zdjęcie!
          </h2>
          <PhotoCaptureInput
            onSelect={(file) => {
              handleSearch(file);
            }}
            loading={isSearching}
          />
        </div>
        <div className="flex-1">
          <SearchResultsDisplay results={searchResults} />
        </div>
      </div>
    </div>
  );
}
