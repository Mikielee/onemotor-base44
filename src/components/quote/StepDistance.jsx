import { useState } from 'react';
import ChoiceButton from './ChoiceButton';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { Gauge, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DISTANCE_OPTIONS = [
  { id: 'lt8000', label: 'Less than 8,000 km' },
  { id: '8000-12000', label: '8,000 – 12,000 km' },
  { id: '12001-18000', label: '12,001 – 18,000 km' },
  { id: 'gt18000', label: 'Over 18,000 km' },
];

function DisclaimerSection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <p className="font-montserrat font-semibold text-xs text-amber-800 flex-1">Important conditions — tap to read</p>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-amber-600" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-600" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5 border-t border-amber-200 pt-2.5">
              <div className="flex gap-2">
                <span className="font-montserrat font-bold text-amber-700 text-xs flex-shrink-0">1.</span>
                <p className="font-montserrat text-xs text-amber-800 leading-relaxed">
                  This plan is for drivers who travel <strong>less than 150 km per week on average</strong> (8,000 km/year). No odometer reading is required at purchase.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-montserrat font-bold text-amber-700 text-xs flex-shrink-0">2.</span>
                <p className="font-montserrat text-xs text-amber-800 leading-relaxed">
                  If you make a claim and your mileage has exceeded 8,000 km, your premium will be <strong>bumped up</strong> to the standard unlimited rate, plus an <strong>additional excess top-up of S$300</strong> will apply. Your claim will not be rejected due to mileage.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="font-montserrat font-bold text-amber-700 text-xs flex-shrink-0">3.</span>
                <p className="font-montserrat text-xs text-amber-800 leading-relaxed">
                  If your driving increases and you expect to exceed 8,000 km, <strong>please call us in advance</strong> to top up your premium — this avoids the additional excess at the point of a claim.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StepDistance({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(false);

  const handleDistanceChange = (id) => {
    onChange('annualDistance', id);
    if (id !== 'lt8000') {
      onChange('driveLessOptIn', undefined);
      onChange('unlimitedKmUpgrade', undefined);
    }
  };

  const handleOptIn = (value) => {
    onChange('driveLessOptIn', value);
    if (value === false) onChange('unlimitedKmUpgrade', true); // "No thanks" = unlimited plan
    if (value === true) onChange('unlimitedKmUpgrade', false);
  };

  const canProceed = (() => {
    if (!formData.annualDistance) return false;
    if (formData.annualDistance === 'lt8000') {
      if (formData.driveLessOptIn === undefined || formData.driveLessOptIn === null) return false;
    }
    return true;
  })();

  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <h1 className="font-montserrat font-bold text-xl text-carbon flex-1">
          Approximately how many kilometres do you drive in this car each year?
        </h1>
        <HelpIcon onClick={() => setHelpOpen(true)} />
      </div>

      <div className="space-y-3">
        {DISTANCE_OPTIONS.map(opt => (
          <ChoiceButton
            key={opt.id}
            selected={formData.annualDistance === opt.id}
            onClick={() => handleDistanceChange(opt.id)}
          >
            {opt.label}
          </ChoiceButton>
        ))}
      </div>

      <AnimatePresence>
        {formData.annualDistance === 'lt8000' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-3"
          >
            {/* Opt-in card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <Gauge className="w-6 h-6 text-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat font-bold text-sm text-carbon mb-1">You're eligible for Drive Less, Pay Less!</p>
                  <p className="font-montserrat text-xs text-muted-foreground leading-relaxed">
                    Opt in to lock your cover to 8,000 km/year and save S$150 on your premium.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleOptIn(true)}
                  className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-xs border-2 transition-all ${
                    formData.driveLessOptIn === true
                      ? 'bg-bdred border-bdred text-white'
                      : 'bg-white border-gray-300 text-carbon hover:border-carbon/40'
                  }`}
                >
                  Yes, opt me in
                </button>
                <button
                  type="button"
                  onClick={() => handleOptIn(false)}
                  className={`flex-1 py-2.5 rounded-pill font-montserrat font-bold text-xs border-2 transition-all ${
                    formData.driveLessOptIn === false
                      ? 'bg-carbon border-carbon text-white'
                      : 'bg-white border-gray-300 text-carbon hover:border-carbon/40'
                  }`}
                >
                  No thanks
                </button>
              </div>

              {/* Disclaimer — shown once opted in */}
              <AnimatePresence>
                {formData.driveLessOptIn === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <DisclaimerSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


          </motion.div>
        )}
      </AnimatePresence>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Tips to calculate this">
        <p className="mb-3">There are different ways you can estimate how far you drive each year:</p>
        <ul className="space-y-3 list-none">
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>Estimate how many kilometres you drive in one week and multiply this by 52.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>See how far you drive on a full tank of fuel and then multiply this distance by how often you fill up your car each year.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>If you bought your car brand new, divide the number on your odometer by the car's age.</span></li>
          <li className="flex gap-2"><span className="text-bdred font-bold flex-shrink-0">•</span><span>Whatever way you choose to work out the distance, remember to add in a buffer for weekend and holiday driving.</span></li>
        </ul>
      </HelpDrawer>
    </div>
  );
}