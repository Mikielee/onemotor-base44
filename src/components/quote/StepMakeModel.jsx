import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { CAR_MAKES, CAR_MODELS, SUB_MODELS } from '../../lib/quoteData';
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

export default function StepMakeModel({ formData, onChange, onNext }) {
  const models = formData.carMake ? (CAR_MODELS[formData.carMake] || ['Sedan', 'SUV', 'Hatchback']) : [];
  const subModels = formData.carModel ? (SUB_MODELS[formData.carModel] || ['1.6 Auto', '2.0 Auto']) : [];

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Tell us about your car
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <SearchDropdown
          label="Car Make"
          value={formData.carMake}
          options={CAR_MAKES}
          onChange={(v) => { onChange('carMake', v); onChange('carModel', ''); onChange('subModel', ''); }}
          placeholder="Select make"
        />

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
        <PillButton onClick={onNext} disabled={!formData.carMake || !formData.carModel}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}