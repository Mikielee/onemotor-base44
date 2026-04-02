import { useState } from 'react';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import ErrorBlockerModal from './ErrorBlockerModal';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { HELP_TEXTS } from '../../lib/quoteData';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase } from 'lucide-react';

const USAGE_OPTIONS = [
  { id: 'private', label: 'Private only', desc: 'Social, domestic and pleasure purposes only', icon: Heart },
  { id: 'business', label: 'Private and Business', desc: 'Personal use plus business activities', icon: Briefcase },
];

export default function StepCarUsage({ formData, onChange, onNext, onBack }) {
  const [showBlocker, setShowBlocker] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleUsageSelect = (id) => {
    onChange('carUsage', id);
    onChange('isDeliveryDriver', '');
    onChange('isOffPeakCar', '');
  };

  const handleDeliverySelection = (value) => {
    onChange('isDeliveryDriver', value);
    if (value === 'yes') setShowBlocker(true);
  };

  const handleGoBack = () => {
    setShowBlocker(false);
    onChange('carUsage', '');
    onChange('isDeliveryDriver', '');
  };

  const showFollowUp = !!formData.carUsage;
  const showOPC = !!formData.carUsage;
  const opcAnswered = !!formData.isOffPeakCar;
  const showDelivery = opcAnswered;
  const canProceed = !!formData.carUsage && !!formData.isDeliveryDriver && opcAnswered;

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How do you use your car?
      </h1>

      <div className="space-y-3">
        {USAGE_OPTIONS.map(({ id, label, desc, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleUsageSelect(id)}
            className={`w-full text-left p-4 rounded-lg border-2 min-h-20 flex items-center gap-3 transition-all duration-200 ${
              formData.carUsage === id ? 'bg-red-50 border-bdred' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              formData.carUsage === id ? 'bg-bdred' : 'bg-grey100'
            }`}>
              <Icon className={`w-6 h-6 ${formData.carUsage === id ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-montserrat font-bold text-sm ${formData.carUsage === id ? 'text-bdred' : 'text-carbon'}`}>{label}</p>
              <p className="font-montserrat text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showFollowUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            {/* OPC question */}
            <div className="bg-grey100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <p className="font-montserrat font-bold text-sm text-carbon">
                  Is this an off-peak car (OPC)?
                </p>
                <HelpIcon onClick={() => setHelpOpen(true)} />
              </div>
              <YesNoButtons
                value={formData.isOffPeakCar}
                onChange={(v) => onChange('isOffPeakCar', v)}
              />
            </div>

            {/* Delivery question — only after OPC answered */}
            <AnimatePresence>
              {showDelivery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-grey100 rounded-lg p-4">
                    <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                      Do you use this car for delivery services (e.g. Grab, Gojek)?
                    </p>
                    <YesNoButtons
                      value={formData.isDeliveryDriver}
                      onChange={handleDeliverySelection}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!showBlocker && <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />}

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Off-Peak Car (OPC)">
        {HELP_TEXTS.offPeak}
      </HelpDrawer>

      <AnimatePresence>
        {showBlocker && (
          <ErrorBlockerModal
            title="We Cannot Quote You"
            message="Unfortunately, we're unable to provide quotes for delivery services at this time. Please contact our support team for assistance."
            onGoBack={handleGoBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}