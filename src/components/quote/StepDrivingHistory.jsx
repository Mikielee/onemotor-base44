import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import ChoiceButton from './ChoiceButton';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';
import { motion, AnimatePresence } from 'framer-motion';

const LICENCE_OPTIONS = ['Less than 1 yr', '1–2 yrs', '3–5 yrs', '6–10 yrs', 'More than 10 yrs'];
const AT_FAULT_VALUES = ['0', '1', '2', '3', '4', '5', 'More than 5'];
const NCD_OPTIONS = ['0', '10', '20', '30', '40', '50'];
const ZERO_NCD_REASONS = ['New driver', 'No previous insurance', 'I have NCD on another car', 'Claims in past year'];
const OTHER_NCD_OPTIONS = ['10', '20', '30', '40', '50'];
const FIFTY_NCD_YEARS = ['1 year', '2 years', '3 years or more'];

function FadeIn({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function StepDrivingHistory({ formData, onChange, onNext, onBack, onBlock }) {
  const [helpOpen, setHelpOpen] = useState(null);

  const canProceed = () => {
    if (!formData.licenceYears) return false;
    if (!formData.claimsInPast3Years) return false;
    if (formData.claimsInPast3Years === 'yes' && !formData.atFaultTimes) return false;
    if (!formData.certificateOfMerit) return false;
    if (!formData.ncdEntitlement) return false;
    if (formData.ncdEntitlement === '0' && !formData.zeroNcdReason) return false;
    if (formData.zeroNcdReason === 'I have NCD on another car' && !formData.otherCarNcd) return false;
    if (formData.ncdEntitlement === '50' && !formData.fiftyNcdYears) return false;
    // ncdTransferFrom only required for 10-50% NCD or I have NCD on another car
    const needsTransfer = (formData.ncdEntitlement !== '0') || formData.zeroNcdReason === 'I have NCD on another car';
    if (needsTransfer && !formData.ncdTransferFrom) return false;
    return true;
  };

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Your driving history
      </h1>

      {/* Licence years */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
          Years holding licence
        </label>
        <div className="relative">
          <select
            value={formData.licenceYears || ''}
            onChange={(e) => onChange('licenceYears', e.target.value)}
            className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
          >
            <option value="" disabled>Select</option>
            {LICENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Claims */}
      <FadeIn show={!!formData.licenceYears}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <p className="font-montserrat font-bold text-sm text-carbon mb-3">
            Any accidents or claims in past 3 years?
          </p>
          <YesNoButtons value={formData.claimsInPast3Years} onChange={(v) => onChange('claimsInPast3Years', v)} />
        </div>
      </FadeIn>

      {/* How many times at fault */}
      <FadeIn show={formData.claimsInPast3Years === 'yes'}>
        <div className="bg-grey100 rounded-lg p-4 mt-3">
          <p className="font-montserrat font-bold text-sm text-carbon mb-3">How many times were you at fault?</p>
          <div className="grid grid-cols-4 gap-2">
            {AT_FAULT_VALUES.map(v => (
              <button
                key={v}
                type="button"
                onClick={() => onChange('atFaultTimes', v)}
                className={`py-2.5 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.atFaultTimes === v
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-gray-200 hover:border-carbon/40'
                }`}
              >
                {v === 'More than 5' ? '5+' : v}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* COM */}
      <FadeIn show={!!formData.claimsInPast3Years}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <div className="flex items-center gap-2 mb-3">
            <p className="font-montserrat font-bold text-sm text-carbon">Certificate of Merit (COM)?</p>
            <HelpIcon onClick={() => setHelpOpen('com')} />
          </div>
          <YesNoButtons value={formData.certificateOfMerit} onChange={(v) => onChange('certificateOfMerit', v)} />
        </div>
      </FadeIn>

      {/* NCD */}
      <FadeIn show={!!formData.certificateOfMerit}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <div className="flex items-center gap-2 mb-3">
            <p className="font-montserrat font-bold text-sm text-carbon">What is your NCD entitlement?</p>
            <HelpIcon onClick={() => setHelpOpen('ncd')} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {NCD_OPTIONS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => { onChange('ncdEntitlement', n); onChange('zeroNcdReason', ''); onChange('otherCarNcd', ''); onChange('fiftyNcdYears', ''); }}
                className={`py-2.5 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.ncdEntitlement === n
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-gray-200 hover:border-carbon/40'
                }`}
              >
                {n}%
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* 0% NCD reason */}
      <FadeIn show={formData.ncdEntitlement === '0'}>
        <div className="bg-grey100 rounded-lg p-4 mt-3 space-y-2">
          <p className="font-montserrat font-bold text-sm text-carbon mb-2">Reason for 0% NCD</p>
          {ZERO_NCD_REASONS.map(r => (
            <ChoiceButton key={r} selected={formData.zeroNcdReason === r} onClick={() => onChange('zeroNcdReason', r)}>
              {r}
            </ChoiceButton>
          ))}
        </div>
      </FadeIn>

      {/* NCD on another car */}
      <FadeIn show={formData.zeroNcdReason === 'I have NCD on another car'}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <p className="font-montserrat font-bold text-sm text-carbon mb-3">NCD% on your other car?</p>
          <div className="flex flex-wrap gap-2">
            {OTHER_NCD_OPTIONS.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onChange('otherCarNcd', n)}
                className={`px-4 py-2 rounded-pill font-montserrat font-bold text-sm border-2 transition-all ${
                  formData.otherCarNcd === n
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-gray-200 hover:border-carbon/40'
                }`}
              >
                {n}%
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* 50% NCD years */}
      <FadeIn show={formData.ncdEntitlement === '50'}>
        <div className="bg-grey100 rounded-lg p-4 mt-3 space-y-2">
          <p className="font-montserrat font-bold text-sm text-carbon mb-2">How many years at 50% NCD?</p>
          {FIFTY_NCD_YEARS.map(y => (
            <ChoiceButton key={y} selected={formData.fiftyNcdYears === y} onClick={() => onChange('fiftyNcdYears', y)}>
              {y}
            </ChoiceButton>
          ))}
        </div>
      </FadeIn>

      {/* NCD transfer from — only for 10-50% NCD or 'I have NCD on another car' reason */}
      <FadeIn show={formData.ncdEntitlement > '0' || formData.zeroNcdReason === 'I have NCD on another car'}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            NCD transferred from
          </label>
          <div className="relative">
            <select
              value={formData.ncdTransferFrom || ''}
              onChange={(e) => onChange('ncdTransferFrom', e.target.value)}
              className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
            >
              <option value="" disabled>Select</option>
              <option value="current">Current insurer</option>
              <option value="previous">Previous insurer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </FadeIn>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed()} />

      <HelpDrawer open={!!helpOpen} onClose={() => setHelpOpen(null)} title={helpOpen === 'com' ? 'Certificate of Merit' : 'No Claim Discount'}>
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}