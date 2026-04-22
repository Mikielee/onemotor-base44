import { useState } from 'react';
import StepFooter from './StepFooter';
import ValidatedInput from './ValidatedInput';
import { Check, ChevronDown } from 'lucide-react';

const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const OCCUPATION_OPTIONS = [
  'Employed (Full-time)', 'Employed (Part-time)', 'Self-employed',
  'Student', 'Homemaker', 'Retired', 'Unemployed', 'Others'
];

export default function StepMainDriver({ formData, onChange, onNext, onBack }) {
  const [dobRaw, setDobRaw] = useState(
    formData.dobDay && formData.dobMonth && formData.dobYear
      ? `${formData.dobDay}/${formData.dobMonth}/${formData.dobYear}`
      : ''
  );

  const handleDobChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let val = digits;
    if (digits.length > 4) val = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) val = digits.slice(0, 2) + '/' + digits.slice(2);
    setDobRaw(val);
    const parts = val.split('/');
    onChange('dobDay', parts[0] || '');
    onChange('dobMonth', parts[1] || '');
    onChange('dobYear', parts[2] || '');
  };

  const canProceed = formData.fullName && formData.nric && formData.dobDay && formData.dobMonth && formData.dobYear && formData.gender && formData.maritalStatus && formData.occupation;

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        About the main driver
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">

        {/* Full name */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Full name
          </label>
          <ValidatedInput value={formData.fullName}>
            <input
              type="text"
              placeholder="As per NRIC/passport"
              value={formData.fullName || ''}
              onChange={(e) => onChange('fullName', e.target.value)}
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
          </ValidatedInput>
        </div>

        {/* NRIC/FIN */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            NRIC/FIN
          </label>
          <ValidatedInput value={formData.nric}>
            <input
              type="text"
              placeholder="e.g. S1234567A"
              value={formData.nric || ''}
              onChange={(e) => onChange('nric', e.target.value.toUpperCase())}
              maxLength={9}
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
          </ValidatedInput>
        </div>

        {/* Date of birth */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Date of birth
          </label>
          <ValidatedInput value={formData.dobYear}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/YYYY"
              maxLength={10}
              value={dobRaw}
              onChange={handleDobChange}
              autoComplete="bday"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            />
          </ValidatedInput>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Gender
          </label>
          <div className="flex gap-3">
            {['Male', 'Female'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => onChange('gender', g.toLowerCase())}
                className={`flex-1 py-3 rounded-pill font-montserrat font-bold text-sm border-2 transition-all flex items-center justify-center gap-1.5 ${
                  formData.gender === g.toLowerCase()
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-carbon/30 hover:border-carbon/60'
                }`}
              >
                {formData.gender === g.toLowerCase() && <Check className="w-3.5 h-3.5" />}
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Marital status */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Marital status
          </label>
          <ValidatedInput value={formData.maritalStatus}>
            <div className="relative">
              <select
                value={formData.maritalStatus || ''}
                onChange={(e) => onChange('maritalStatus', e.target.value)}
                className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
              >
                <option value="" disabled>Select</option>
                {MARITAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </ValidatedInput>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            Occupation
          </label>
          <ValidatedInput value={formData.occupation}>
            <div className="relative">
              <select
                value={formData.occupation || ''}
                onChange={(e) => onChange('occupation', e.target.value)}
                className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
              >
                <option value="" disabled>Select</option>
                {OCCUPATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </ValidatedInput>
        </div>

      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}