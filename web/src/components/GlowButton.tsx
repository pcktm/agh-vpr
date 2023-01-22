import {ButtonHTMLAttributes} from 'react';

export default function GlowButton({children, className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = [
    'py-2 px-5 select-none backdrop-blur-sm border-2 transition-all duration-300',
    'border-indigo-600 cursor-pointer hover:border-indigo-400 backdrop-brightness-125 hover:backdrop-brightness-150',
    'h-16 rounded-lg text-sm text-indigo-200 font-semibold',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button
      className={classes}
      type="button"
      {...props}
    >
      <div className="flex flex-row items-center gap-2">
        {children}
      </div>
    </button>
  );
}
