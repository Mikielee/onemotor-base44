import { useState } from 'react';
import ChoiceButton from './ChoiceButton';
import StepFooter from './StepFooter';
import YesNoButtons from './YesNoButtons';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';

const DISTANCE_OPTIONS = [
  { id: 'lt8000', label: 'Less than 8,000 km' },
  { id: '8000-12000', label: '8,000 – 12,000 km' },
  { id: '12001-18000', label: '12,001 – 18,000 km' },
  { id: 'gt18000', label: 'Over 18,000 km' },
];

export default function StepDistance({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const canProceed = formData.annualDistance && formData.offPeak;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How much do you drive each year?
      </h1>

      <div className="space-y-3">
        {DISTANCE_OPTIONS.map(opt => (
          <ChoiceButton
            key={opt.id}
            selected={formData.annualDistance === opt.id}
            onClick={() => onChange('annualDistance', opt.id)}
          >
            {opt.label}
          </ChoiceButton>
        ))}
      </div>

      {formData.annualDistance && (
       <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
         <div className="flex items-center gap-2 mb-3">
           <p className="text-xs font-montserrat font-medium text-muted-foreground">
             Is your vehicle an off-peak car?
           </p>
            <HelpIcon onClick={() => setHelpOpen(true)} />
          </div>
          <YesNoButtons
            value={formData.offPeak}
            onChange={(v) => onChange('offPeak', v)}
          />
        </div>
      )}

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Off-Peak Car">
        {HELP_TEXTS.offPeak}
      </HelpDrawer>
    </div>
  );
}