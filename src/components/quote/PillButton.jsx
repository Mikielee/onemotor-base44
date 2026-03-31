export default function PillButton({ children, onClick, variant = 'primary', disabled, className = '', type = 'button' }) {
  const base = 'w-full py-3.5 px-6 rounded-pill font-montserrat font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-bdred text-white hover:bg-carbon active:scale-[0.98]',
    outline: 'bg-white text-carbon border-2 border-carbon hover:bg-grey100 active:scale-[0.98]',
    ghost: 'bg-transparent text-cyan hover:bg-cyan/5',
    green: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}