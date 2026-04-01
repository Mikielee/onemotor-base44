import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { COVER_TYPES, HELP_TEXTS } from '../../lib/quoteData';
import HelpIcon from './HelpIcon';
import StepFooter from './StepFooter';
import HelpDrawer from './HelpDrawer';

export default function StepCoverType({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(null);

  const currentYear = new Date().getFullYear();
  const regYear = formData.yearOfReg ? parseInt(formData.yearOfReg) : null;
  const vehicleAge = regYear ? currentYear - regYear : 0;

  useEffect(() => {
    if (!formData.coverType) {
      onChange('coverType', 'COMP');
    }
  }, []);

  return (
    <div className="space-y-1.5">
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
              className={`w-full text-left p-4 rounded-lg border-2 min-h-24 flex items-center gap-3 transition-all duration-200 ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                  : selected
                  ? 'bg-red-50 border-bdred'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Left: Shield icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                disabled
                  ? 'bg-gray-200'
                  : selected
                  ? 'bg-bdred'
                  : 'bg-gray-200'
              }`}>
                {ct.id === 'COMP' ? (
                  <ShieldCheck className={`w-6 h-6 ${
                    disabled
                      ? 'text-gray-400'
                      : selected
                      ? 'text-white'
                      : 'text-muted-foreground'
                  }`} />
                ) : ct.id === 'TPFT' ? (
                  <Shield className={`w-6 h-6 ${
                    disabled
                      ? 'text-gray-400'
                      : selected
                      ? 'text-white'
                      : 'text-muted-foreground'
                  }`} />
                ) : (
                  <ShieldAlert className={`w-6 h-6 ${
                    disabled
                      ? 'text-gray-400'
                      : selected
                      ? 'text-white'
                      : 'text-muted-foreground'
                  }`} />
                )}
              </div>

              {/* Centre: Title & Description */}
              <div className="flex-1">
                <span className={`font-montserrat font-bold text-sm block ${
                  disabled ? 'text-gray-400' : selected ? 'text-bdred' : 'text-carbon'
                }`}>
                  {ct.name}
                </span>
                <span className={`text-xs mt-0.5 block leading-relaxed ${
                  disabled ? 'text-gray-400' : selected ? 'text-carbon' : 'text-muted-foreground'
                }`}>
                  {ct.desc}
                </span>
                {disabled && (
                  <span className="text-[10px] mt-1 block text-red-400 font-medium">
                    Not available for vehicles over {ct.maxAge} years old
                  </span>
                )}
              </div>

              {/* Right: Help icon */}
              {!disabled && (
                <div onClick={(e) => { e.stopPropagation(); setHelpOpen(ct.id); }} className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    helpOpen === ct.id
                      ? 'bg-white border-gray-300'
                      : 'border-gray-300 bg-transparent'
                  }`}>
                    <span className={`text-xs font-bold ${
                      helpOpen === ct.id ? 'text-gray-600' : 'text-muted-foreground'
                    }`}>
                      ?
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <StepFooter onNext={onNext} disabled={!formData.coverType} />

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