/* eslint-disable max-len */
import autoAnimate from '@formkit/auto-animate';
import {useRef, useEffect, useState} from 'react';
import {polishPlurals} from 'polish-plurals';
import {QuestionMarkCircleIcon, ArrowPathIcon} from '@heroicons/react/24/outline';
import {SearchResults} from '../types';
import SearchResult from './SearchResult';

export default function SearchResultsDisplay({results, loading}: {results: SearchResults, loading?: boolean}) {
  const parent = useRef<HTMLDivElement>(null);
  const [wasEverChanged, setEverChanged] = useState(false);

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

  useEffect(() => {
    if (results.length > 0 || loading) setEverChanged(true);
  }, [results, loading]);

  return (
    <div className="mt-2 p-2">
      <h3 className={`text-xl text-slate-200 font-secondary transition-all duration-300 ${!wasEverChanged ? 'opacity-0' : 'opacity-100'}`}>Wyniki wyszukiwania</h3>
      <p className={`text-sm text-slate-300 transition-all duration-500 ${results?.length ? 'opacity-100' : 'opacity-0'}`}>
        {results?.length ? `${results.length} ${polishPlurals('wynik', 'wyniki', 'wyników', results.length)}` : ' '}
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
        (results.length === 0 && !loading && wasEverChanged) && (
          <div className="flex mt-12 flex-col justify-center items-center gap-1 p-4">
            <QuestionMarkCircleIcon className="w-7 h-7 text-slate-400" />
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
