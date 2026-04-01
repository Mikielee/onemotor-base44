import { ChevronLeft } from 'lucide-react';

export default function StepFooter({ onBack, onNext, disabled = false, label = 'Continue' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-gray-200 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white text-carbon hover:border-carbon/40 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="flex-1 py-3.5 px-6 rounded-pill font-montserrat font-bold text-base bg-bdred text-white transition-all hover:bg-carbon disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {label}
        </button>
      </div>
    </div>
  );
}