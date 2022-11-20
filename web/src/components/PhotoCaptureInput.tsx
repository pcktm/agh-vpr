import {useState, ChangeEvent} from 'react';
import {CameraIcon} from '@heroicons/react/24/outline';

export default function PhotoCaptureInput() {
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center w-full mt-5">
        <label
          htmlFor="dropzone-file"
          // eslint-disable-next-line max-len
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-stone-700 border-stone-600 hover:bg-stone-800"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CameraIcon className="w-8 h-8 my-3 text-stone-400" />
            <p className="mb-1 text-sm text-stone-400 font-semibold">
              Click to capture
            </p>
            <p className="text-xs text-stone-400">
              {photo ? photo.name : 'No file chosen'}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
          />
        </label>
      </div>
    </div>
  );
}
