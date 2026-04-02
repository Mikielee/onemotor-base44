import ChoiceButton from './ChoiceButton';
import StepFooter from './StepFooter';

const DISTANCE_OPTIONS = [
  { id: 'lt8000', label: 'Less than 8,000 km' },
  { id: '8000-12000', label: '8,000 – 12,000 km' },
  { id: '12001-18000', label: '12,001 – 18,000 km' },
  { id: 'gt18000', label: 'Over 18,000 km' },
];

export default function StepDistance({ formData, onChange, onNext, onBack }) {
  const canProceed = !!formData.annualDistance;

  return (
    <div className="space-y-1.5">
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

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}