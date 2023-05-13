import {useState, ChangeEvent} from 'react';
import {CameraIcon} from '@heroicons/react/24/outline';

export default function PhotoCaptureInput({onSelect, loading, className}: {onSelect: (file: File) => void, loading?: boolean, className?: string}) {
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
    onSelect(file as File);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-start w-full">
        <label
          htmlFor="dropzone-file"
          // eslint-disable-next-line max-len
          className={`flex flex-col text-ellipsis overflow-clip py-2 px-5 transition-all hover:shadow-xl shadow-lg duration-300 select-none backdrop-blur-sm border-2 ${loading ? 'border-indigo-800 animate-pulse backdrop-brightness-75' : 'border-indigo-600 cursor-pointer hover:border-indigo-400 backdrop-brightness-125 hover:backdrop-brightness-150'} items-start justify-center w-full h-16 rounded-lg`}
        >
          <div className="flex flex-row items-center gap-3">
            <CameraIcon className="w-8 h-8 text-indigo-200" />
            <p className="text-sm text-indigo-200 font-semibold">
              {`Prześlij${photo ? ' kolejne ' : ' '}zdjęcie`}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            // capture="environment"
            onChange={handlePhotoChange}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}

PhotoCaptureInput.defaultProps = {
  loading: false,
  className: '',
};
