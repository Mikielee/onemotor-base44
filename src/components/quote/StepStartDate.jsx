import { useState, useEffect } from 'react';
import StepFooter from './StepFooter';
import { addDays, addMonths, isBefore, isAfter, format } from 'date-fns';

function DateInput({ label, value, onSelect, minDate, maxDate }) {
  const [raw, setRaw] = useState(value ? format(value, 'dd/MM/yyyy') : '');

  useEffect(() => {
    setRaw(value ? format(value, 'dd/MM/yyyy') : '');
  }, [value]);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let val = digits;
    if (digits.length > 4) val = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    else if (digits.length > 2) val = digits.slice(0, 2) + '/' + digits.slice(2);
    setRaw(val);
    if (digits.length === 8) {
      const d = digits.slice(0, 2), m = digits.slice(2, 4), y = digits.slice(4);
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed)) {
        const tooEarly = minDate && isBefore(parsed, minDate);
        const tooLate = maxDate && isAfter(parsed, maxDate);
        if (!tooEarly && !tooLate) onSelect(parsed);
      }
    }
  };

  return (
    <div>
      <label className="block text-xs font-montserrat font-semibold text-carbon mb-1.5">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/YYYY"
        maxLength={10}
        value={raw}
        onChange={handleChange}
        className="w-full px-3 py-3 border-2 border-bdred rounded-lg font-montserrat text-sm text-carbon focus:outline-none"
      />
    </div>
  );
}

export default function StepStartDate({ formData, onChange, onNext, onBack }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = formData.coverStartDate ? new Date(formData.coverStartDate) : null;
  const endDate = formData.coverEndDate ? new Date(formData.coverEndDate) : null;

  const startMin = today;
  const startMax = addDays(today, 60);
  const endMin = startDate ? addMonths(startDate, 7) : null;
  const endMax = startDate ? addMonths(startDate, 12) : null;

  const handleStartSelect = (day) => {
    onChange('coverStartDate', day.toISOString());
    onChange('coverEndDate', addDays(day, 365).toISOString());
  };

  const canProceed = !!startDate && !!endDate;

  return (
    <div className="space-y-3 pb-24">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        When would you like your cover?
      </h1>

      <DateInput
        label="Cover Start Date"
        value={startDate}
        onSelect={handleStartSelect}
        minDate={startMin}
        maxDate={startMax}
      />

      <DateInput
        label="Cover End Date"
        value={endDate}
        onSelect={(day) => onChange('coverEndDate', day.toISOString())}
        minDate={endMin}
        maxDate={endMax}
      />

      {startDate && !endDate && (
        <p className="text-xs font-montserrat text-muted-foreground text-center">
          End date auto-set to 1 year. You can adjust it above (min 7 months, max 12 months).
        </p>
      )}

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}