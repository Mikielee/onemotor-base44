import { useState } from 'react';
import ChoiceButton from './ChoiceButton';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { Gauge } from 'lucide-react';

const DISTANCE_OPTIONS = [
  { id: 'lt8000', label: 'Less than 8,000 km' },
  { id: '8000-12000', label: '8,000 – 12,000 km' },
  { id: '12001-18000', label: '12,001 – 18,000 km' },
  { id: 'gt18000', label: 'Over 18,000 km' },
];

export default function StepDistance({ formData, onChange, onNext, onBack }) {
  const handleDistanceChange = (id) => {
    onChange('annualDistance', id);
    onChange('driveLessOptIn', id === 'lt8000');
  };
  const [helpOpen, setHelpOpen] = useState(false);
  const canProceed = !!formData.annualDistance;

  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <h1 className="font-montserrat font-bold text-xl text-carbon flex-1">
          Approximately how many kilometres do you drive in this car each year?
        </h1>
        <HelpIcon onClick={() => setHelpOpen(true)} />
      </div>

      <div className="space-y-3">
        {DISTANCE_OPTIONS.map(opt => (
          <ChoiceButton
            key={opt.id}
            selected={formData.annualDistance === opt.id}
            onClick={() => handleDistanceChange(opt.id)}
          >
            {opt.label}
          </ChoiceButton>
        ))}
      </div>

      {formData.annualDistance === 'lt8000' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3">
          <Gauge className="w-6 h-6 text-cyan flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-montserrat font-bold text-sm text-carbon mb-1">You're eligible for Drive Less Pay Less Plan!</p>
            <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
              A S$150 discount has been automatically applied to your premium.
            </p>
          </div>
        </div>
      )}

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Tips to calculate this">
        <p className="mb-3">There are different ways you can estimate how far you drive each year:</p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>Estimate how many kilometres you drive in one week and multiply this by 52.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>See how far you drive on a full tank of fuel and then multiply this distance by how often you fill up your car each year.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>If you bought your car brand new, divide the number on your odometer by the car's age.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>Whatever way you choose to work out the distance, remember to add in a buffer for weekend and holiday driving.</span></li>
        </ul>
      </HelpDrawer>
    </div>
  );
}