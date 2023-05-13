import {MapPinIcon} from '@heroicons/react/24/outline';
import {useState} from 'react';

export default function LocationPrompt({onLocationChange}: {onLocationChange: (location: GeolocationCoordinates) => void}) {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);

  const handleLocation = async () => {
    const getPosition = () => new Promise<GeolocationCoordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({coords}) => resolve(coords), reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
    const coords = await getPosition().catch((e) => {
      console.error(e);
      return {latitude: 50.06565, longitude: 19.91969} as GeolocationCoordinates;
    });
    console.log(coords);
    setLocation(coords);
    onLocationChange(coords);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <button
        type="button"
        // eslint-disable-next-line max-len
        className={`flex flex-col text-ellipsis overflow-clip py-2 px-5 transition-all duration-200 hover:shadow-xl shadow-lg select-none backdrop-blur-sm border-2 ${location ? 'bg-green-900 bg-opacity-50 border-green-600 hover:border-green-400' : 'border-indigo-600 hover:border-indigo-400'} cursor-pointer backdrop-brightness-125 hover:backdrop-brightness-150 items-start justify-center w-full h-16 rounded-lg`}
        onClick={handleLocation}
      >
        <div className="flex flex-row items-center gap-3">
          <MapPinIcon className={`w-8 h-8 ${location ? 'text-green-200' : 'text-indigo-200'}`} />
          <p className={`text-sm ${location ? 'text-green-200' : 'text-indigo-200'} font-semibold`}>
            {location ? 'Zmień' : 'Ustaw'}
            {' '}
            lokalizację
          </p>
        </div>
      </button>
    </div>
  );
}
