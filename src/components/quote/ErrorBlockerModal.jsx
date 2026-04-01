import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ErrorBlockerModal({ title, message, onGoBack, icon: Icon = AlertTriangle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-96 p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-error" />
          </div>

          <h2 className="font-montserrat font-bold text-lg text-carbon mb-3">
            {title}
          </h2>

          <p className="font-montserrat text-sm text-muted-foreground mb-6 leading-relaxed">
            {message}
          </p>

          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={onGoBack}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 font-montserrat font-bold text-sm text-carbon hover:border-carbon/40 transition-colors"
            >
              ← Go Back
            </button>
            <button
              type="button"
              disabled
              className="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-400 font-montserrat font-bold text-sm cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}