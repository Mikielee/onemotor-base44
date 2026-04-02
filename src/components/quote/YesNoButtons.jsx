import { Check } from 'lucide-react';

export default function YesNoButtons({ value, onChange, yesLabel = 'Yes', noLabel = 'No' }) {
  const base = 'flex-1 py-3 rounded-pill font-montserrat font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center gap-1.5';
  const selected = 'bg-bdred text-white border-bdred';
  const unselected = 'bg-white text-carbon border-carbon/30 hover:border-carbon/60';

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange('yes')}
        className={`${base} ${value === 'yes' ? selected : unselected}`}
      >
        {value === 'yes' && <Check className="w-3.5 h-3.5" />}
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange('no')}
        className={`${base} ${value === 'no' ? selected : unselected}`}
      >
        {value === 'no' && <Check className="w-3.5 h-3.5" />}
        {noLabel}
      </button>
    </div>
  );
}