import {Place} from '../utils/stores';
import {useAxiosSWR} from '../utils/useAxios';
import SearchResult from './SearchResult';

export default function RecentPlacesList() {
  const {data: places, error, isLoading} = useAxiosSWR<Place[]>('/history/');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {
            (places && places?.length === 0) && (
              <p className="text-sm text-slate-500">Nie odwiedziłeś jeszcze żadnych miejsc.</p>
            )
          }
        {
            isLoading && (
              // some skeleton loading indicator
              <div className="animate-pulse flex flex-row gap-2">
                <div className="h-4 w-4 bg-slate-500 rounded-full" />
                <div className="h-4 w-20 bg-slate-500 rounded-full" />
              </div>
            )
          }
        {
            places && places?.length > 0 && (
              <div className="flex flex-col gap-0">
                {
                  places.map((place) => (
                    <SearchResult key={place.id} result={place} />
                  ))
                }
              </div>
            )
          }
      </div>
    </div>

  );
}
