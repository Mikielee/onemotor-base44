export default function ChoiceButton({ selected, onClick, children, disabled, subtitle }) {
  const base = 'w-full text-left px-4 py-3.5 rounded-lg font-montserrat transition-all duration-200 border-2 mb-2';
  const selectedClass = 'bg-bdred text-white border-bdred';
  const unselectedClass = 'bg-white text-carbon border-gray-200 hover:border-carbon/40';
  const disabledClass = 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400';

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`${base} ${disabled ? disabledClass : selected ? selectedClass : unselectedClass}`}
    >
      <span className="font-bold text-sm block">{children}</span>
      {subtitle && (
        <span className={`text-xs mt-1 block ${selected ? 'text-white/80' : disabled ? 'text-gray-400' : 'text-muted-foreground'}`}>
          {subtitle}
        </span>
      )}
    </button>
  );
}