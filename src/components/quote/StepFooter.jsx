export default function StepFooter({ onBack, onNext, disabled, label = 'Continue' }) {
  return (
    <div className="sticky bottom-0 bg-white pt-3 pb-5 mt-6 -mx-5 px-5 border-t border-gray-100 shadow-[0_-4px_8px_rgba(0,0,0,0.05)]">
      <div className="flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3.5 rounded-pill font-montserrat font-medium text-sm text-carbon bg-white border-2 border-[#CBD5E0] hover:bg-grey100 transition-colors whitespace-nowrap"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className={`flex-1 py-3.5 rounded-pill font-montserrat font-bold text-sm text-white transition-all ${
            disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-bdred hover:bg-[#c2200d]'
          }`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}