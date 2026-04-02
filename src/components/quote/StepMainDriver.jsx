import { useState } from 'react';
import StepFooter from './StepFooter';
import MyinfoButton from './MyinfoButton';
import ValidatedInput from './ValidatedInput';
import { Check } from 'lucide-react';

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

  const handleDobNative = (e) => {
    const val = e.target.value; // yyyy-mm-dd from date input
    if (!val) return;
    const [y, m, d] = val.split('-');
    setDobRaw(`${d}/${m}/${y}`);
    onChange('dobDay', d);
    onChange('dobMonth', m);
    onChange('dobYear', y);
  };

  const canProceed = formData.dobDay && formData.dobMonth && formData.dobYear && formData.gender;

  const handleMyinfo = (data) => {
    if (data.dobDay) { setDobRaw(`${data.dobDay}/${data.dobMonth}/${data.dobYear}`); }
    Object.entries(data).forEach(([k, v]) => onChange(k, v));
  };

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        About the main driver
      </h1>

      <MyinfoButton onDataRetrieved={handleMyinfo} />

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
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
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}