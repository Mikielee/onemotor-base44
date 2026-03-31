import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import PillButton from './PillButton';

export default function StepYearReg({ formData, onChange, onNext }) {
  const years = useMemo(() => {
    const result = [];
    for (let y = 2025; y >= 2008; y--) result.push(y);
    return result;
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        What year was your car registered?
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">
          Year of Registration
        </label>
        <div className="relative">
          <select
            value={formData.yearOfReg || ''}
            onChange={(e) => onChange('yearOfReg', e.target.value)}
            className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none cursor-pointer"
          >
            <option value="" disabled>Select year</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {formData.yearOfReg && (
        <p className="text-xs text-muted-foreground font-montserrat text-center">
          Vehicle age: {new Date().getFullYear() - parseInt(formData.yearOfReg)} years
        </p>
      )}

      <div className="pt-2">
        <PillButton onClick={onNext} disabled={!formData.yearOfReg}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}