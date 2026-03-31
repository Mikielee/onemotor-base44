import { useState } from 'react';
import { COVER_TYPES, HELP_TEXTS } from '../../lib/quoteData';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';

export default function StepCoverType({ formData, onChange, onNext }) {
  const [helpOpen, setHelpOpen] = useState(null);

  const currentYear = new Date().getFullYear();
  const regYear = formData.yearOfReg ? parseInt(formData.yearOfReg) : null;
  const vehicleAge = regYear ? currentYear - regYear : 0;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        What type of cover do you need?
      </h1>
      <div className="space-y-3">
        {COVER_TYPES.map((ct) => {
          const disabled = ct.maxAge !== null && vehicleAge > ct.maxAge;
          const selected = formData.coverType === ct.id;

          return (
            <button
              key={ct.id}
              type="button"
              onClick={disabled ? undefined : () => onChange('coverType', ct.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                  : selected
                  ? 'bg-bdred border-bdred text-white'
                  : 'bg-white border-gray-200 hover:border-carbon/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className={`font-montserrat font-bold text-sm block ${selected ? 'text-white' : disabled ? 'text-gray-400' : 'text-carbon'}`}>
                    {ct.name}
                  </span>
                  <span className={`text-xs mt-1 block leading-relaxed ${selected ? 'text-white/80' : disabled ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    {ct.desc}
                  </span>
                  {disabled && (
                    <span className="text-[10px] mt-2 block text-red-400 font-medium">
                      Not available for vehicles over {ct.maxAge} years old
                    </span>
                  )}
                </div>
                {!disabled && (
                  <HelpIcon onClick={() => setHelpOpen(ct.id)} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <PillButton onClick={onNext} disabled={!formData.coverType}>
          Continue
        </PillButton>
      </div>

      <HelpDrawer
        open={!!helpOpen}
        onClose={() => setHelpOpen(null)}
        title={COVER_TYPES.find(c => c.id === helpOpen)?.name || ''}
      >
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}