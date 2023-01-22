/* eslint-disable max-len */
import autoAnimate from '@formkit/auto-animate';
import {useRef, useEffect, useState} from 'react';
import {polishPlurals} from 'polish-plurals';
import {QuestionMarkCircleIcon, ArrowPathIcon} from '@heroicons/react/24/outline';
import {SearchResults} from '../types';
import {SmallPlaceBox, LargePlaceBox} from './PlaceBox';

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
      <div ref={parent} className="pt-3 flex flex-col gap-2">
        {
          results.length > 0 && (
            <>
              <LargePlaceBox result={results[0]} />
              {results.length > 1 && (
                <div className="flex mt-3 flex-col justify-center items-center gap-1 p-4 text-slate-400">
                  <p className="text-center text-sm">
                    pozostałe wyniki
                  </p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                  </svg>
                </div>
              )}
              {
                results.slice(1).map((result) => (
                  <div key={result.id}>
                    <SmallPlaceBox result={result} />
                  </div>
                ))
              }
            </>
          )
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
