import ChoiceButton from './ChoiceButton';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import BlockerScreen from './BlockerScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase } from 'lucide-react';

export default function StepCarUsage({ formData, onChange, onNext, onBack, onBlock }) {
  const isDeliveryDriver = formData.carUsage === 'business' && formData.isDeliveryDriver === 'yes';
  const canProceed = formData.carUsage && (formData.carUsage === 'business' || (formData.commuteToWork && formData.isOffPeakCar));

  // Trigger blocker if delivery driver selected business use
  if (isDeliveryDriver && onBlock) {
    onBlock();
    return null;
  }

  return (
    <div className="space-y-1.5">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How do you use your car?
      </h1>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => { onChange('carUsage', 'private'); onChange('commuteToWork', ''); }}
          className={`w-full text-left p-4 rounded-lg border-2 min-h-20 flex items-center gap-3 transition-all duration-200 ${
            formData.carUsage === 'private'
              ? 'bg-red-50 border-bdred'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            formData.carUsage === 'private' ? 'bg-bdred' : 'bg-grey100'
          }`}>
            <Heart className={`w-6 h-6 ${
              formData.carUsage === 'private' ? 'text-white' : 'text-muted-foreground'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-montserrat font-bold text-sm ${
              formData.carUsage === 'private' ? 'text-bdred' : 'text-carbon'
            }`}>Private and Leisure only</p>
            <p className="font-montserrat text-xs text-muted-foreground mt-1">Social, domestic and pleasure purposes only</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { onChange('carUsage', 'business'); onChange('commuteToWork', ''); onChange('isDeliveryDriver', ''); onChange('isOffPeakCar', ''); }}
          className={`w-full text-left p-4 rounded-lg border-2 min-h-20 flex items-center gap-3 transition-all duration-200 ${
            formData.carUsage === 'business'
              ? 'bg-red-50 border-bdred'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            formData.carUsage === 'business' ? 'bg-bdred' : 'bg-grey100'
          }`}>
            <Briefcase className={`w-6 h-6 ${
              formData.carUsage === 'business' ? 'text-white' : 'text-muted-foreground'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-montserrat font-bold text-sm ${
              formData.carUsage === 'business' ? 'text-bdred' : 'text-carbon'
            }`}>Private and Business Use</p>
            <p className="font-montserrat text-xs text-muted-foreground mt-1">Commuting plus business use by Main Driver or Named Driver</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {formData.carUsage === 'private' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-3"
          >
            <div className="bg-grey100 rounded-lg p-4 mt-2">
              <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                Do you use the car to commute to work?
              </p>
              <YesNoButtons
                value={formData.commuteToWork}
                onChange={(v) => { onChange('commuteToWork', v); onChange('isOffPeakCar', ''); }}
              />
            </div>

            {formData.commuteToWork && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-grey100 rounded-lg p-4">
                  <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                    Is this an off-peak car?
                  </p>
                  <YesNoButtons
                    value={formData.isOffPeakCar}
                    onChange={(v) => onChange('isOffPeakCar', v)}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formData.carUsage === 'business' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-grey100 rounded-lg p-4 mt-2">
              <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                Do you use this car for delivery services (Grab, Gojek, etc.)?
              </p>
              <YesNoButtons
                value={formData.isDeliveryDriver}
                onChange={(v) => onChange('isDeliveryDriver', v)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDeliveryDriver && <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />}
    </div>
  );
}