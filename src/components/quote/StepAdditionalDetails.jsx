import { useState } from 'react';
import { ChevronDown, Fingerprint } from 'lucide-react';
import { INSURERS, FINANCE_COMPANIES } from '../../lib/quoteData';
import YesNoButtons from './YesNoButtons';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';

export default function StepAdditionalDetails({ formData, onChange, onNext }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [singpassFilled, setSingpassFilled] = useState(false);

  const handleSingpass = () => {
    setSingpassFilled(true);
    onChange('fullName', formData.preferredName || 'John Tan Wei Ming');
    onChange('nric', 'S9012345A');
    onChange('address', `Blk 123 Bishan St 12 #05-678 Singapore ${formData.postcode || '570123'}`);
  };

  const inputClass = 'w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none';

  const showClaimDate = formData.claimsInPast3Years === 'yes';
  const showOdometer = formData.driveLessOptIn;

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        A few more details to issue your policy
      </h1>

      {/* Singpass */}
      <button
        type="button"
        onClick={handleSingpass}
        className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-pill border-2 font-montserrat font-bold text-sm transition-all ${
          singpassFilled
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-white border-bdred text-bdred hover:bg-bdred hover:text-white'
        }`}
      >
        <Fingerprint className="w-5 h-5" />
        {singpassFilled ? 'Pre-filled with Singpass' : 'Login with Singpass to pre-fill'}
      </button>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Vehicle registration number</label>
          <input type="text" value={formData.vehicleReg || ''} onChange={(e) => onChange('vehicleReg', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. SBA1234A" />
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Current insurer</label>
          <div className="relative">
            <select value={formData.currentInsurer || ''} onChange={(e) => onChange('currentInsurer', e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}>
              <option value="" disabled>Select insurer</option>
              {INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Full name</label>
          <input type="text" value={formData.fullName || ''} onChange={(e) => onChange('fullName', e.target.value)} className={inputClass} placeholder="As per NRIC" />
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">NRIC/FIN</label>
          <input type="text" value={formData.nric || ''} onChange={(e) => onChange('nric', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. S9012345A" />
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Address</label>
          <input type="text" value={formData.address || ''} onChange={(e) => onChange('address', e.target.value)} className={inputClass} placeholder="Full address" />
        </div>

        <div>
          <p className="font-montserrat font-bold text-sm text-carbon mb-2">Is your car under financing?</p>
          <YesNoButtons value={formData.carFinanced} onChange={(v) => onChange('carFinanced', v)} />
        </div>

        {formData.carFinanced === 'yes' && (
          <div>
            <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Finance company</label>
            <div className="relative">
              <select value={formData.financeCompany || ''} onChange={(e) => onChange('financeCompany', e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="" disabled>Select</option>
                {FINANCE_COMPANIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}

        {showClaimDate && (
          <div>
            <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Date of accident/claim</label>
            <div className="flex gap-2">
              <input type="text" placeholder="MM" maxLength={2} value={formData.claimMonth || ''} onChange={(e) => onChange('claimMonth', e.target.value.replace(/\D/g, ''))}
                className="w-16 text-center px-2 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
              <input type="text" placeholder="YYYY" maxLength={4} value={formData.claimYear || ''} onChange={(e) => onChange('claimYear', e.target.value.replace(/\D/g, ''))}
                className="flex-1 text-center px-2 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat" />
            </div>
          </div>
        )}

        {showOdometer && (
          <div>
            <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Odometer reading (km)</label>
            <input type="number" value={formData.odometer || ''} onChange={(e) => onChange('odometer', e.target.value)} className={inputClass} placeholder="e.g. 25000" />
          </div>
        )}

        <div>
          <p className="font-montserrat font-bold text-sm text-carbon mb-2">Is your car privately or company owned?</p>
          <div className="flex gap-3">
            {['Private', 'Company'].map(o => (
              <button key={o} type="button" onClick={() => onChange('carOwnership', o.toLowerCase())}
                className={`flex-1 py-3 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.carOwnership === o.toLowerCase() ? 'bg-bdred text-white border-bdred' : 'bg-white text-carbon border-carbon/30 hover:border-carbon/60'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <PillButton onClick={onNext} disabled={!formData.vehicleReg || !formData.fullName || !formData.nric}>
          Continue
        </PillButton>
      </div>

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Singpass">
        {HELP_TEXTS.singpass}
      </HelpDrawer>
    </div>
  );
}