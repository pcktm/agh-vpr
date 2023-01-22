/* eslint-disable max-len */
import {MapPinIcon} from '@heroicons/react/24/outline';
import Balancer from 'react-wrap-balancer';
import {SearchResult as TSearchResult} from '../types';

export function SmallPlaceBox({result, children}: {result: TSearchResult, children?: React.ReactNode}) {
  return (
    <div className="flex-1 border border-slate-600 backdrop-blur-sm backdrop-brightness-110 rounded-md flex flex-col sm:flex-row gap-2 overflow-hidden">
      <img
        src={import.meta.env.VITE_API_URL + result.main_image}
        alt={result.name}
        className="w-full h-32 sm:h-64 sm:w-64 object-cover"
      />
      <div className="flex-1 p-2 flex flex-col">
        <div className="flex-1">
          <h3 className="text-2xl text-slate-200 font-secondary">
            <Balancer>
              {result.name}
            </Balancer>
          </h3>
          <h4 className="text-xl text-slate-300 font-secondary">
            {result.code}
          </h4>
          <p className="text-md text-slate-300">
            {result.description}
          </p>
        </div>
        <div className="flex gap-2  items-center">
          <MapPinIcon className="w-5 h-5 text-slate-400" />
          <p className="text-xs text-slate-400">
            {result.address}
          </p>
        </div>
      </div>
      <div className="flex p-2">
        {children}
      </div>
    </div>
  );
}

SmallPlaceBox.defaultProps = {
  children: null,
};

export function LargePlaceBox({result}: {result: TSearchResult}) {
  return (
    <div className="border border-indigo-600 backdrop-blur-sm backdrop-brightness-125 bg-indigo-700 bg-opacity-5 my-1.5 rounded-md flex flex-col md:flex-row gap-1 md:gap-3 overflow-hidden">
      <img
        src={import.meta.env.VITE_API_URL + result.main_image}
        className="w-full h-72 md:h-64 md:w-64 object-cover"
        alt={result.name}
      />
      <div className="flex-1 p-2 flex flex-col">
        <div className="flex-1 flex flex-col">
          <h3 className="text-3xl text-slate-200 font-secondary">
            <Balancer>
              {result.name}
            </Balancer>
          </h3>
          <h4 className="text-xl text-slate-300 font-secondary">
            {result.code}
          </h4>
          <p className="text-md text-slate-300 flex-1">
            {result.description}
          </p>
          <div className="flex gap-2  items-center">
            <MapPinIcon className="w-5 h-5 text-slate-400" />
            <p className="text-xs text-slate-400">
              {result.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
