/* eslint-disable jsx-a11y/label-has-associated-control */
import {InputHTMLAttributes} from 'react';
import {UseFormRegister, UseFormRegisterReturn} from 'react-hook-form';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
};

export default function TextInput({
  className, label, register, ...props
}: Props) {
  const classes = [
    'p-2 rounded-md bg-slate-800 border border-indigo-800 focus:outline-none focus:border-indigo-500',
    props.error && 'border-red-800 focus:border-red-500',
    className,
  ].filter(Boolean).join(' ');
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-md">{label}</label>
      <input
        className={classes}
        id={props.id}
        type={props.type || 'text'}
        {...register}
        {...props}
      />
      {props.error && (
        <div className="text-red-500 text-sm">{props.error}</div>
      )}
    </div>
  );
}

TextInput.defaultProps = {
  error: undefined,
};
