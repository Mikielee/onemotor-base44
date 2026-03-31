import { useState, useMemo } from 'react';
import { ChevronDown, Search, AlertTriangle } from 'lucide-react';
import { CAR_MAKES, CAR_MODELS, SUB_MODELS, COVER_TYPES } from '../../lib/quoteData';
import PillButton from './PillButton';

function SearchDropdown({ label, value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  return (
    <div className="relative">
      <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">{label}</label>
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(''); }}
        className="w-full flex items-center justify-between px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-left hover:border-carbon/40 transition-colors"
      >
        <span className={value ? 'text-carbon font-medium' : 'text-muted-foreground'}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-grey100 rounded-md px-2.5 py-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-xs font-montserrat outline-none text-carbon placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-36 overflow-y-auto">
            {filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm font-montserrat hover:bg-grey100 transition-colors ${
                  opt === value ? 'bg-bdred/5 text-bdred font-bold' : 'text-carbon'
                }`}
              >
                {opt}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2.5 text-xs text-muted-foreground font-montserrat">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const YEARS = (() => {
  const result = [];
  for (let y = 2025; y >= 2000; y--) result.push(y);
  return result;
})();

export default function StepMakeModel({ formData, onChange, onNext, goToStep }) {
  const vehicleAge = formData.yearOfReg ? new Date().getFullYear() - parseInt(formData.yearOfReg) : null;

  const coverConflict = useMemo(() => {
    if (!formData.coverType || vehicleAge === null) return null;
    const cover = COVER_TYPES.find(c => c.id === formData.coverType);
    if (cover?.maxAge && vehicleAge > cover.maxAge) return cover.name;
    return null;
  }, [formData.coverType, vehicleAge]);

  const models = formData.carMake ? (CAR_MODELS[formData.carMake] || ['Sedan', 'SUV', 'Hatchback']) : [];
  const subModels = formData.carModel ? (SUB_MODELS[formData.carModel] || ['1.6 Auto', '2.0 Auto']) : [];

  const canProceed = formData.yearOfReg && formData.carMake && formData.carModel && !coverConflict;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Tell us about your car
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Year first */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Year of Registration</label>
          <div className="relative">
            <select
              value={formData.yearOfReg || ''}
              onChange={(e) => {
                onChange('yearOfReg', e.target.value);
                onChange('carMake', '');
                onChange('carModel', '');
                onChange('subModel', '');
              }}
              className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Select year</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {vehicleAge !== null && !coverConflict && (
            <p className="text-xs text-muted-foreground font-montserrat mt-1.5">Vehicle age: {vehicleAge} years</p>
          )}
        </div>

        {/* Cover conflict warning */}
        {coverConflict && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-montserrat text-amber-800 leading-relaxed">
                Based on your vehicle age, <span className="font-bold">{coverConflict}</span> is not available. Please go back to Step 1 to update your cover selection.
              </p>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="mt-2 text-xs font-montserrat font-bold text-amber-700 underline"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Car Make — only after year selected */}
        {formData.yearOfReg && !coverConflict && (
          <SearchDropdown
            label="Car Make"
            value={formData.carMake}
            options={CAR_MAKES}
            onChange={(v) => { onChange('carMake', v); onChange('carModel', ''); onChange('subModel', ''); }}
            placeholder="Select make"
          />
        )}

        {formData.carMake && (
          <SearchDropdown
            label="Car Model"
            value={formData.carModel}
            options={models}
            onChange={(v) => { onChange('carModel', v); onChange('subModel', ''); }}
            placeholder="Select model"
          />
        )}

        {formData.carModel && (
          <SearchDropdown
            label="Sub-model (optional)"
            value={formData.subModel}
            options={subModels}
            onChange={(v) => onChange('subModel', v)}
            placeholder="Select sub-model"
          />
        )}
      </div>

      <div className="pt-2">
        <PillButton onClick={onNext} disabled={!canProceed}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}