import { useState } from 'react';
import { EXCESS_OPTIONS, EXCESS_DELTA } from '../../lib/quoteData';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';

export default function StepExcess({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const selected = formData.excess || 1000;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="font-montserrat font-bold text-xl text-carbon">
          Choose your excess
        </h1>
        <HelpIcon onClick={() => setHelpOpen(true)} />
      </div>
      <p className="text-sm font-montserrat text-muted-foreground">
        Your excess is the amount you pay towards a claim
      </p>

      <div className="space-y-2">
        {EXCESS_OPTIONS.map(amt => {
          const delta = EXCESS_DELTA[amt];
          const isSelected = selected === amt;
          return (
            <button
              key={amt}
              type="button"
              onClick={() => onChange('excess', amt)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border-2 font-montserrat transition-all ${
                isSelected
                  ? 'bg-bdred border-bdred text-white'
                  : 'bg-white border-gray-200 hover:border-carbon/40 text-carbon'
              }`}
            >
              <span className="font-bold text-sm">${amt.toLocaleString()}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : delta > 0 ? 'text-bdred' : delta < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {delta > 0 ? `+$${delta}/yr` : delta < 0 ? `-$${Math.abs(delta)}/yr` : 'Default'}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground font-montserrat text-center">
        Higher excess = lower premium
      </p>

      <StepFooter onBack={onBack} onNext={onNext} />

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Excess">
        {HELP_TEXTS.excess}
      </HelpDrawer>
    </div>
  );
}