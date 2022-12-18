import autoAnimate from '@formkit/auto-animate';
import {useRef, useEffect} from 'react';
import {SearchResults} from '../types';
import SearchResult from './SearchResult';

export default function SearchResultsDisplay({results}: {results: SearchResults}) {
  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parent.current) autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (parent.current && results.length > 0) {
      // if mobile
      if (window.innerWidth < 768) {
        setTimeout(() => {
          parent.current?.scrollIntoView({behavior: 'smooth'});
        }, 200);
      }
    }
  }, [parent, results]);

  return (
    <div className="mt-2 xl:mt-0 p-4 overflow-x-scroll">
      <h3 className="text-xl text-slate-200 font-secondary">Wyniki wyszukiwania</h3>
      <p className="text-sm text-slate-300">
        {results.length}
        {' '}
        wyników
      </p>
      <div ref={parent}>
        {
        results.map((result) => (
          <div key={result.id}>
            <SearchResult result={result} />
          </div>
        ))
      }
      </div>
    </div>
  );
}
