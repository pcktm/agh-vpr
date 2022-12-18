import {MapPinIcon} from '@heroicons/react/24/outline';
import {SearchResult as TSearchResult} from '../types';

export default function SearchResult({result}: {result: TSearchResult}) {
  return (
    <div className="border border-slate-600 bg-slate-800 my-3 rounded-md backdrop-blur flex gap-2 overflow-hidden">
      <img
        src={import.meta.env.VITE_API_URL + result.main_image}
        alt={result.name}
        className="w-32 h-32 object-cover"
      />
      <div className="flex-1 p-2 flex flex-col">
        <div className="flex-1">
          <h3 className="text-2xl text-slate-200 font-secondary">
            {result.name}
          </h3>
          <p className="text-md text-slate-300">
            {`${result.description}djfhksjdhfgkjsdhfskdjhfslkdjfhas;k qjdshf;aisj dq9 eujnd q[093uj 1jye 2wuieh 1jd 1[2j1;klwh`}
          </p>
        </div>
        <div className="flex gap-2  items-center">
          <MapPinIcon className="w-5 h-5 text-slate-400" />
          <p className="text-xs text-slate-400">
            {result.address}
          </p>
        </div>
      </div>
    </div>
  );
}