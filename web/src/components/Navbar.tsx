import {Link} from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="mx-auto w-full container px-3 md:px-2">
      <div className="flex flex-row justify-end">
        <Link to="/login" className="text-sm text-indigo-200 font-semibold">
          Zaloguj się
        </Link>
      </div>
    </div>
  );
}
