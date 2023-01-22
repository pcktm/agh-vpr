import {useToast} from '@chakra-ui/react';
import {ArrowUpIcon, PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Place} from '../utils/stores';
import {useAxios, useAxiosSWR, useMutate} from '../utils/useAxios';
import GlowButton from './GlowButton';
import {SmallPlaceBox} from './PlaceBox';

export default function CreatedPlacesList() {
  const {data: places, error, isLoading} = useAxiosSWR<Place[]>('/user/places');
  const axios = useAxios();
  const mutate = useMutate();
  const toast = useToast();

  const deletePlace = async (place: Place) => {
    try {
      await axios.delete(`/user/places/${place.id}`);
      await mutate('/user/places');
      toast({
        title: 'Usunięto miejsce',
        description: `Pomyślnie usunięto ${place.name}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć miejsca',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {
            (places && places?.length === 0) && (
              <p className="text-sm text-slate-500">Nie utworzyłeś jeszcze żadnych miejsc.</p>
            )
          }
        {
            isLoading && (
              <div className="animate-pulse flex flex-row gap-2">
                <div className="h-4 w-4 bg-slate-500 rounded-full" />
                <div className="h-4 w-20 bg-slate-500 rounded-full" />
              </div>
            )
          }
        {
            places && places?.length > 0 && (
              <div className="flex flex-col gap-2">
                {
                  places.map((place) => (
                    <div className="flex-1 flex flex-col" key={place.id}>
                      <SmallPlaceBox result={place}>
                        <button
                          className="rounded mt-2 flex gap-2 items-center text-sm font-bold text-red-500 hover:text-red-600 self-end hover:underline"
                          onClick={() => deletePlace(place)}
                          type="button"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Usuń
                        </button>
                      </SmallPlaceBox>
                    </div>
                  ))
                }
              </div>
            )
          }
      </div>
    </div>

  );
}
