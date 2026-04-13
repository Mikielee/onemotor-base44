import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ValidatedInput from './ValidatedInput';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import ChoiceButton from './ChoiceButton';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';
import { motion, AnimatePresence } from 'framer-motion';

const LICENCE_OPTIONS = ['Less than 1 yr', '1–2 yrs', '3–5 yrs', '6–10 yrs', 'More than 10 yrs'];
const CLAIMS_OPTIONS = ['0', '1', '2', '3', '4', '5', 'More than 5+'];
const AT_FAULT_VALUES = ['0', '1', '2', '3', '4', '5', 'More than 5+'];
const NCD_OPTIONS = [
  { value: '0',  label: '0%',  years: '0 claim-free years' },
  { value: '10', label: '10%', years: '1 claim-free year' },
  { value: '20', label: '20%', years: '2 claim-free years' },
  { value: '30', label: '30%', years: '3 claim-free years' },
  { value: '40', label: '40%', years: '4 claim-free years' },
  { value: '50', label: '50%', years: '5+ claim-free years' },
];
const ZERO_NCD_REASONS = ['New driver', 'No previous insurance', 'Claims in past year', 'I have NCD on another car'];
const OTHER_NCD_OPTIONS = [
  { value: '0',  label: '0%',  years: '0 claim-free years' },
  { value: '10', label: '10%', years: '1 claim-free year' },
  { value: '20', label: '20%', years: '2 claim-free years' },
  { value: '30', label: '30%', years: '3 claim-free years' },
  { value: '40', label: '40%', years: '4 claim-free years' },
  { value: '50', label: '50%', years: '5+ claim-free years' },
];
const FIFTY_NCD_YEARS = ['1 year', '2 years', '3 years or more'];

function getAtFaultOptions(claimsValue) {
  if (!claimsValue || claimsValue === '0') return [];
  if (claimsValue === 'More than 5+') return AT_FAULT_VALUES;
  const max = parseInt(claimsValue);
  const opts = [];
  for (let i = 0; i <= max; i++) opts.push(String(i));
  return opts;
}

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
    if (formData.claimsInPast3Years !== '0' && !formData.atFaultTimes) return false;
    if (!formData.certificateOfMerit) return false;
    if (!formData.ncdEntitlement) return false;
    if (formData.ncdEntitlement === '0' && !formData.zeroNcdReason) return false;
    if (formData.zeroNcdReason === 'I have NCD on another car' && !formData.otherCarNcd) return false;
    if (formData.ncdEntitlement === '50' && !formData.fiftyNcdYears) return false;
    if (formData.zeroNcdReason === 'I have NCD on another car' && !formData.ncdTransferFrom) return false;
    return true;
  };

  return (
    <div className="space-y-1.5 pb-24">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Your driving history
      </h1>

      {/* Licence years */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
          Years holding licence
        </label>
        <ValidatedInput value={formData.licenceYears}>
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
        </ValidatedInput>
      </div>

      {/* Claims count */}
      <FadeIn show={!!formData.licenceYears}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            How many accidents and/or claims in the past 3 years?
          </label>
          <ValidatedInput value={formData.claimsInPast3Years}>
            <div className="relative">
              <select
                value={formData.claimsInPast3Years || ''}
                onChange={(e) => { onChange('claimsInPast3Years', e.target.value); onChange('atFaultTimes', ''); }}
                className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
              >
                <option value="" disabled>Select</option>
                {CLAIMS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </ValidatedInput>

          <FadeIn show={!!formData.claimsInPast3Years && formData.claimsInPast3Years !== '0'}>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-montserrat font-medium text-xs text-carbon mb-2">
                How many of those accidents or claims were you or any driver at-fault?
              </p>
              <ValidatedInput value={formData.atFaultTimes}>
                <div className="relative">
                  <select
                    value={formData.atFaultTimes || ''}
                    onChange={(e) => onChange('atFaultTimes', e.target.value)}
                    className="w-full appearance-none px-3 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-montserrat text-carbon focus:border-bdred focus:outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {getAtFaultOptions(formData.claimsInPast3Years).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </ValidatedInput>
            </div>
          </FadeIn>
        </div>
      </FadeIn>

      {/* COM */}
      <FadeIn show={!!formData.claimsInPast3Years}>
       <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3">
         <div className="flex items-center gap-2 mb-3">
           <p className="text-xs font-montserrat font-medium text-muted-foreground">Certificate of Merit (COM)?</p>
            <HelpIcon onClick={() => setHelpOpen('com')} />
          </div>
          <YesNoButtons value={formData.certificateOfMerit} onChange={(v) => onChange('certificateOfMerit', v)} />
        </div>
      </FadeIn>

      {/* NCD */}
      <FadeIn show={!!formData.certificateOfMerit}>
       <div className="bg-white rounded-lg border border-gray-200 p-4 mt-3 space-y-3">
         <div className="flex items-center gap-2 mb-3">
           <p className="text-xs font-montserrat font-medium text-muted-foreground">What is your NCD entitlement?</p>
            <HelpIcon onClick={() => setHelpOpen('ncd')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {NCD_OPTIONS.map(n => (
              <button
                key={n.value}
                type="button"
                onClick={() => { onChange('ncdEntitlement', n.value); onChange('zeroNcdReason', ''); onChange('otherCarNcd', ''); onChange('fiftyNcdYears', ''); }}
                className={`py-3 px-3 rounded-lg font-montserrat border-2 transition-all text-left ${
                  formData.ncdEntitlement === n.value
                    ? 'bg-bdred text-white border-bdred'
                    : 'bg-white text-carbon border-gray-200 hover:border-carbon/40'
                }`}
              >
                <p className="font-bold text-sm">{n.label}</p>
                <p className={`text-[11px] mt-0.5 ${formData.ncdEntitlement === n.value ? 'text-white/80' : 'text-muted-foreground'}`}>{n.years}</p>
              </button>
            ))}
          </div>

          {/* 0% NCD reason — nested subsection */}
          {formData.ncdEntitlement === '0' && (
            <div className="border-t border-gray-300 pt-3 mt-3">
              <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">Reason for 0% NCD</p>
               {ZERO_NCD_REASONS.map(r => (
                 <ChoiceButton key={r} selected={formData.zeroNcdReason === r} onClick={() => onChange('zeroNcdReason', r)}>
                   {r}
                 </ChoiceButton>
               ))}

              {/* NCD on another car — nested under reason */}
              {formData.zeroNcdReason === 'I have NCD on another car' && (
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">NCD% on your other car?</p>
                  <p className="text-[11px] text-muted-foreground font-montserrat mb-3">The NCD from your other car may be transferable to this policy.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {OTHER_NCD_OPTIONS.map(n => (
                      <button
                        key={n.value}
                        type="button"
                        onClick={() => onChange('otherCarNcd', n.value)}
                        className={`py-3 px-3 rounded-lg font-montserrat border-2 transition-all text-left ${
                          formData.otherCarNcd === n.value
                            ? 'bg-bdred text-white border-bdred'
                            : 'bg-white text-carbon border-gray-200 hover:border-carbon/40'
                        }`}
                      >
                        <p className="font-bold text-sm">{n.label}</p>
                        <p className={`text-[11px] mt-0.5 ${formData.otherCarNcd === n.value ? 'text-white/80' : 'text-muted-foreground'}`}>{n.years}</p>
                      </button>
                    ))}
                  </div>
                  </div>
                  )}
                  </div>
                  )}
                  </div>
      </FadeIn>

      {/* 50% NCD years */}
      <FadeIn show={formData.ncdEntitlement === '50'}>
       <div className="bg-grey100 rounded-lg p-4 mt-3 space-y-2">
         <p className="text-xs font-montserrat font-medium text-muted-foreground mb-2">How many years at 50% NCD?</p>
          {FIFTY_NCD_YEARS.map(y => (
            <ChoiceButton key={y} selected={formData.fiftyNcdYears === y} onClick={() => onChange('fiftyNcdYears', y)}>
              {y}
            </ChoiceButton>
          ))}
        </div>
      </FadeIn>

      {/* NCD transfer from — subsection within 0% NCD */}
      <FadeIn show={formData.zeroNcdReason === 'I have NCD on another car'}>
        <div className="bg-grey100 rounded-lg p-4 mt-3 border-t-2 border-gray-300">
          <label className="block text-xs font-montserrat font-medium text-muted-foreground mb-2">
            NCD transferred from
          </label>
          <ValidatedInput value={formData.ncdTransferFrom}>
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
          </ValidatedInput>
        </div>
      </FadeIn>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed()} />

      <HelpDrawer open={!!helpOpen} onClose={() => setHelpOpen(null)} title={helpOpen === 'com' ? 'Certificate of Merit' : 'No Claim Discount'}>
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}