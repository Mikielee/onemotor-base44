import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HelpDrawer({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-white px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
              <h3 className="font-montserrat font-bold text-carbon text-lg">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-grey100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-carbon" />
              </button>
            </div>
            <div className="px-5 py-4 text-carbon text-sm leading-relaxed font-montserrat">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}