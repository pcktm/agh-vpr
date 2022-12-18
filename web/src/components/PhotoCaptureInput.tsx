import {useState, ChangeEvent} from 'react';
import {CameraIcon, ArrowPathIcon} from '@heroicons/react/24/outline';

export default function PhotoCaptureInput({onSelect, loading}: {onSelect: (file: File) => void, loading?: boolean}) {
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
    onSelect(file as File);
  };

  return (
    <div>
      <div className="flex items-center justify-start w-full mt-5">
        <label
          htmlFor="dropzone-file"
          // eslint-disable-next-line max-len
          className="flex flex-col backdrop-blur items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer border-slate-600 hover:bg-slate-800"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {
              !loading ? (
                <CameraIcon className="w-8 h-8 my-3 text-slate-400" />
              ) : (
                <ArrowPathIcon className="w-8 h-8 my-3 text-slate-400 animate-spin" />
              )
            }

            <p className="mb-1 text-sm text-stone-400 font-semibold">
              {loading ? 'Szukanie...' : `Prześlij${photo ? ' kolejne ' : ' '}zdjęcie`}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
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
};
