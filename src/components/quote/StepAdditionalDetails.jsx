import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import StepFooter from './StepFooter';
import { HELP_TEXTS } from '../../lib/quoteData';

// Simulated postcode lookup data
const POSTCODE_DATA = {
  '570123': { blockNo: 'Blk 123', streetName: 'Bishan Street 12' },
  '310456': { blockNo: 'Blk 456', streetName: 'Ang Mo Kio Avenue 3' },
  '238839': { blockNo: '1', streetName: 'Orchard Road' },
};

export default function StepAdditionalDetails({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [singpassFilled, setSingpassFilled] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupDone, setLookupDone] = useState(false);

  const handleSingpass = () => {
    setSingpassFilled(true);
    onChange('fullName', formData.preferredName || 'John Tan Wei Ming');
    onChange('nric', 'S9012345A');
    onChange('postalCode', '570123');
    onChange('blockNo', 'Blk 123');
    onChange('streetName', 'Bishan Street 12');
    onChange('unitNo', '#05-678');
    setLookupDone(true);
  };

  const handlePostcodeLookup = () => {
    if (!formData.postalCode || formData.postalCode.length !== 6) return;
    setLookupLoading(true);
    setTimeout(() => {
      const data = POSTCODE_DATA[formData.postalCode] || { blockNo: 'Blk 1', streetName: 'Sample Street' };
      onChange('blockNo', data.blockNo);
      onChange('streetName', data.streetName);
      setLookupLoading(false);
      setLookupDone(true);
    }, 800);
  };

  const showClaimDate = formData.claimsInPast3Years === 'yes';
  const showOdometer = formData.driveLessOptIn;

  const inputClass = 'w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none';
  const canProceed = !!(formData.fullName && formData.nric && formData.postalCode && formData.blockNo && formData.streetName);

  return (
    <div className="space-y-1.5">
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
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Full name (as per NRIC)</label>
          <input type="text" value={formData.fullName || ''} onChange={(e) => onChange('fullName', e.target.value)} className={inputClass} placeholder={formData.preferredName || 'John Tan Wei Ming'} />
        </div>

        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">NRIC/FIN</label>
          <input type="text" value={formData.nric || ''} onChange={(e) => onChange('nric', e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. S9012345A" />
        </div>

        {/* Address section */}
        <div>
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Postal code</label>
          <div className="flex gap-2">
            <input
              type="text" maxLength={6} value={formData.postalCode || ''}
              onChange={(e) => { onChange('postalCode', e.target.value.replace(/\D/g, '')); setLookupDone(false); onChange('blockNo', ''); onChange('streetName', ''); }}
              className={`flex-1 ${inputClass}`} placeholder="e.g. 570123"
            />
            <button
              type="button"
              onClick={handlePostcodeLookup}
              disabled={!formData.postalCode || formData.postalCode.length !== 6 || lookupLoading}
              className="px-4 py-3 bg-bdred text-white rounded-lg font-montserrat font-bold text-sm disabled:bg-gray-200 disabled:text-gray-400 transition-all whitespace-nowrap"
            >
              {lookupLoading ? '...' : 'Lookup'}
            </button>
          </div>
        </div>

        {lookupDone && (
          <>
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Block / House number</label>
              <input type="text" value={formData.blockNo || ''} onChange={(e) => onChange('blockNo', e.target.value)} className={inputClass} placeholder="e.g. Blk 123" />
            </div>
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Street name</label>
              <input type="text" value={formData.streetName || ''} onChange={(e) => onChange('streetName', e.target.value)} className={inputClass} placeholder="e.g. Bishan Street 12" />
            </div>
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Unit number <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input type="text" value={formData.unitNo || ''} onChange={(e) => onChange('unitNo', e.target.value)} className={inputClass} placeholder="e.g. #05-678" />
            </div>
            <div>
              <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-1.5">Building name <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input type="text" value={formData.buildingName || ''} onChange={(e) => onChange('buildingName', e.target.value)} className={inputClass} placeholder="e.g. Bishan Park Condo" />
            </div>
          </>
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
      </div>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Singpass">
        {HELP_TEXTS.singpass}
      </HelpDrawer>
    </div>
  );
}