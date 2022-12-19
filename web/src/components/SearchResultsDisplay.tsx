import autoAnimate from '@formkit/auto-animate';
import {useRef, useEffect} from 'react';
import {polishPlurals} from 'polish-plurals';
import {MagnifyingGlassIcon, ArrowPathIcon} from '@heroicons/react/24/outline';
import {SearchResults} from '../types';
import SearchResult from './SearchResult';

export default function SearchResultsDisplay({results, loading}: {results: SearchResults, loading?: boolean}) {
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parent.current) autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (parent.current && results.length > 0) {
      setTimeout(() => {
        parent.current?.scrollIntoView({behavior: 'smooth'});
      }, 200);
    }
  }, [parent, results]);

  return (
    <div className="mt-2 p-2">
      <h3 className="text-xl text-slate-200 font-secondary">Wyniki wyszukiwania</h3>
      <p className="text-sm text-slate-300">
        {results.length > 0 ? `${results.length} ${polishPlurals('wynik', 'wyniki', 'wyników', results.length)}` : ' '}
      </p>
      <div ref={parent}>
        {
        results.map((result) => (
          <div key={result.id}>
            <SearchResult result={result} />
          </div>
        ))
      }
        {
        (results.length === 0 && !loading) && (
          <div className="flex mt-10 flex-row justify-center items-center gap-2 p-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-slate-400" />
            <p className="text-sm text-slate-300">Brak wyników</p>
          </div>
        )
      }
        {
        loading && (
          <div className="flex mt-10 flex-row justify-center items-center gap-2 p-4">
            <ArrowPathIcon className="w-6 h-6 text-slate-400 animate-spin" />
            <p className="text-sm text-slate-300">Szukanie...</p>
          </div>
        )
      }
      </div>
    </div>
  );
}

SearchResultsDisplay.defaultProps = {
  loading: false,
};
