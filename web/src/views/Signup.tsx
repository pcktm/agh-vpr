/* eslint-disable max-len */
import {ArrowLeftIcon, ArrowPathIcon, UserPlusIcon} from '@heroicons/react/24/outline';
import {Link, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {useState} from 'react';
import styles from '../styles/hero.module.scss';
import {useAuthStore} from '../utils/stores';

export default function SignupView() {
  const {register, handleSubmit, formState: {errors}} = useForm();
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);

  const onSubmit = (data: any) => {
    setIsBusy(true);
    axios.post(`${import.meta.env.VITE_API_URL}/user/register`, data)
      .then((res) => {
        if (res.data.access_token) {
          authStore.setToken(res.data.access_token);
          navigate('/');
        }
      })
      .catch((e) => {
        console.log(e);
      }).finally(() => setIsBusy(false));
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center ${styles.background}`}>
      <div className="container h-full mx-auto p-2">
        <div className="flex mb-6 select-none ml-1 md:ml-0">
          <Link to="/" className="flex flex-row items-center gap-2 underline">
            <ArrowLeftIcon className="w-5 h-5 text-slate-300" />
            <h1 className="text-md font-secondary leading-snug text-slate-300">
              Wróć
            </h1>
          </Link>
        </div>
        <div className="flex overflow-hidden justify-center h-full flex-col mb-12">
          <div className="rounded-xl backdrop-blur-sm backdrop-brightness-150 shadow-2xl md:max-w-sm px-4 pt-6 pb-4">
            <h1 className="text-5xl font-bold font-secondary">Załóż konto</h1>
            <h2 className="text-md font-regular mt-2">
              Masz już konto?
              {' '}
              <Link to="/login" className="text-indigo-400 font-semibold">Zaloguj się</Link>
            </h2>
            <form className="flex flex-col gap-2 mt-4 md:max-w-sm" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                placeholder="Imię"
                className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.first_name ? 'border-red-800 focus:border-red-500' : ''}`}
                {...register('first_name', {required: true})}
                aria-invalid={errors.first_name ? 'true' : 'false'}
              />
              {
              errors.first_name && (
                <p className="text-red-500 text-sm font-semibold">
                  Imię jest wymagane
                </p>
              )
            }
              <input
                type="text"
                placeholder="Nazwisko"
                className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.last_name ? 'border-red-800 focus:border-red-500' : ''}`}
                {...register('last_name', {required: true})}
                aria-invalid={errors.last_name ? 'true' : 'false'}
              />
              {
                errors.last_name && (
                  <p className="text-red-500 text-sm font-semibold">
                    Nazwisko jest wymagane
                  </p>
                )
              }
              <input
                type="text"
                placeholder="Email"
                className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.email ? 'border-red-800 focus:border-red-500' : ''}`}
                {...register('email', {
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Podaj poprawny adres email',
                  },
                  required: {
                    value: true,
                    message: 'Email jest wymagany',
                  },
                })}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {
                errors?.email?.message && (
                  <p className="text-red-500 text-sm font-semibold">
                    {String(errors.email.message)}
                  </p>
                )
              }
              <input
                type="password"
                placeholder="Hasło"
                className={`p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500 ${errors.password ? 'border-red-800 focus:border-red-500' : ''}`}
                {...register('password', {required: true})}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {
                errors.password && (
                  <p className="text-red-500 text-sm font-semibold">
                    Hasło jest wymagane
                  </p>
                )
              }
              <button
                type="submit"
                disabled={isBusy}
                className={`p-2 rounded-md bg-indigo-800 text-white font-semibold flex flex-row justify-center items-center gap-2 ${isBusy ? 'animate-pulse' : ''}`}
              >
                {
                  isBusy ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" />
                      Zarejestruj się!
                    </>
                  )
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
