import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { INSURERS, FINANCE_COMPANIES } from '../../lib/quoteData';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';

export default function StepVehicleDetails({ formData, onChange, onNext, onBack }) {
  const inputClass = 'w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none';

  const canProceed = !!formData.vehicleReg;

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        More details about your vehicle
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Vehicle registration number</label>
          <input
            type="text"
            value={formData.vehicleReg || ''}
            onChange={(e) => onChange('vehicleReg', e.target.value.toUpperCase())}
            className={inputClass}
            placeholder="e.g. SBA1234A"
          />
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Current insurer</label>
          <div className="relative">
            <select
              value={formData.currentInsurer || ''}
              onChange={(e) => onChange('currentInsurer', e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Select insurer</option>
              {INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div>
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">Is your car under financing?</p>
          <YesNoButtons value={formData.carFinanced} onChange={(v) => onChange('carFinanced', v)} />
        </div>

        {formData.carFinanced === 'yes' && (
          <div>
            <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Finance company</label>
            <div className="relative">
              <select
                value={formData.financeCompany || ''}
                onChange={(e) => onChange('financeCompany', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" disabled>Select</option>
                {FINANCE_COMPANIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">Is your car privately or company owned?</p>
          <div className="flex gap-3">
            {['Private', 'Company'].map(o => (
              <button
                key={o}
                type="button"
                onClick={() => onChange('carOwnership', o.toLowerCase())}
                className={`flex-1 py-3 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.carOwnership === o.toLowerCase()
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-carbon/30 hover:border-carbon/60'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}