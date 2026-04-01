import ChoiceButton from './ChoiceButton';
import YesNoButtons from './YesNoButtons';
import StepFooter from './StepFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase } from 'lucide-react';

export default function StepCarUsage({ formData, onChange, onNext, onBack }) {
  const canProceed = formData.carUsage && (formData.carUsage === 'business' || formData.commuteToWork);

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        How do you use your car?
      </h1>

      <div className="space-y-3">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => { onChange('carUsage', 'private'); onChange('commuteToWork', ''); }}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              formData.carUsage === 'private' ? 'bg-purple-100' : 'bg-grey100'
            }`}>
              <Heart className={`w-5 h-5 ${
                formData.carUsage === 'private' ? 'text-purple-600' : 'text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1">
              <p className="font-montserrat font-bold text-sm text-carbon">Private and Leisure only</p>
              <p className="font-montserrat text-xs text-muted-foreground mt-1">Social, domestic and pleasure purposes only</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              formData.carUsage === 'private' ? 'border-bdred bg-bdred' : 'border-gray-300'
            }`}>
              {formData.carUsage === 'private' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => { onChange('carUsage', 'business'); onChange('commuteToWork', ''); }}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              formData.carUsage === 'business' ? 'bg-blue-100' : 'bg-grey100'
            }`}>
              <Briefcase className={`w-5 h-5 ${
                formData.carUsage === 'business' ? 'text-blue-600' : 'text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1">
              <p className="font-montserrat font-bold text-sm text-carbon">Private and Business Use</p>
              <p className="font-montserrat text-xs text-muted-foreground mt-1">Commuting plus business use by Main Driver or Named Driver</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              formData.carUsage === 'business' ? 'border-bdred bg-bdred' : 'border-gray-300'
            }`}>
              {formData.carUsage === 'business' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        </div>
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