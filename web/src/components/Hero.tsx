import PhotoCaptureInput from './PhotoCaptureInput';

export default function Hero() {
  return (
    <div className="min-h-screen p-2 flex flex-col md:justify-center border-b border-stone-400 rounded-b-xl backdrop-blur">
      <div className="flex">
        <div className="m-1 overflow-hidden p-4">
          <h1 className="text-7xl md:text-8xl font-bold text-stone-100">
            Gdzie jesteś?
          </h1>
          <h2 className="text-2xl md:text-3xl mt-1 font-bold text-stone-300">
            Nie wiesz? Zrób zdjęcie!
          </h2>
          <PhotoCaptureInput />
        </div>
      </div>
    </div>
  );
}
