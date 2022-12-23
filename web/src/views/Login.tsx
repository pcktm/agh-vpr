import {ArrowLeftIcon, ArrowRightOnRectangleIcon} from '@heroicons/react/24/outline';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import styles from '../styles/hero.module.scss';

export default function LoginView() {
  const {register, handleSubmit} = useForm();

  const onSubmit = (data: any) => {
    const params = new URLSearchParams(data);
    axios.post(`${import.meta.env.VITE_API_URL}/user/token`, params)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className={`min-h-screen pt-2 md:pt-20 ${styles.background}`}>
      <div className="container mx-auto p-2">
        <div className="flex mb-10 select-none ml-1 md:ml-0">
          <Link to="/" className="flex flex-row items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5 text-slate-300" />
            <h1 className="text-md font-secondary leading-snug text-slate-300">
              Wróć
            </h1>
          </Link>
        </div>
        <div className="flex flex-col mt-20">
          <h1 className="text-5xl font-bold font-secondary">Zaloguj się</h1>
          <h2 className="text-lg font-regular mt-2">
            Nie masz konta?
            {' '}
            <Link to="/signup" className="text-indigo-400 font-semibold">Zarejestruj się!</Link>
          </h2>
          <form className="flex flex-col gap-2 mt-4 max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Email"
              className="p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              {...register('username')}
            />
            <input
              type="password"
              placeholder="Hasło"
              className="p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500"
              required
              {...register('password')}
            />
            <button
              type="submit"
              className="p-2 rounded-md bg-indigo-800 text-white font-semibold flex flex-row justify-center items-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Zaloguj się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
