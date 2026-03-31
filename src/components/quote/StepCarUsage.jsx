import ChoiceButton from './ChoiceButton';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import { motion, AnimatePresence } from 'framer-motion';

export default function StepCarUsage({ formData, onChange, onNext, onBack }) {
  const canProceed = formData.carUsage && (formData.carUsage === 'business' || formData.commuteToWork);

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How do you use your car?
      </h1>

      <div className="space-y-3">
        <ChoiceButton
          selected={formData.carUsage === 'private'}
          onClick={() => { onChange('carUsage', 'private'); onChange('commuteToWork', ''); }}
          subtitle="Social, domestic and pleasure purposes only"
        >
          Private and Leisure only
        </ChoiceButton>

        <ChoiceButton
          selected={formData.carUsage === 'business'}
          onClick={() => { onChange('carUsage', 'business'); onChange('commuteToWork', ''); }}
          subtitle="Commuting plus business use by Main Driver or Named Driver"
        >
          Private and Business Use
        </ChoiceButton>
      </div>

      <AnimatePresence>
        {formData.carUsage === 'private' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-grey100 rounded-lg p-4 mt-2">
              <p className="font-montserrat font-bold text-sm text-carbon mb-3">
                Do you use the car to commute to work?
              </p>
              <YesNoButtons
                value={formData.commuteToWork}
                onChange={(v) => onChange('commuteToWork', v)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StepFooter onBack={onBack} onNext={onNext} disabled={!canProceed} />
    </div>
  );
}