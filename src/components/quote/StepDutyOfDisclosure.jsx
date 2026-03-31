export default function StepDutyOfDisclosure({ onNext, onBack, goToStep }) {
  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Duty of Disclosure
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <p className="font-montserrat font-bold text-sm text-carbon">
          Before you proceed
        </p>
        <p className="text-sm font-montserrat text-muted-foreground leading-relaxed">
          [Duty of disclosure and underwriting declaration — copy to be provided by Legal/Compliance]
        </p>
        <div className="bg-grey100 rounded-lg px-4 py-3">
          <p className="text-xs font-montserrat text-muted-foreground italic">
            Placeholder: This section will include the full duty of disclosure, material facts requirements, and policy declarations as required under the Insurance Act (Singapore).
          </p>
        </div>
      </div>

      {/* 3-button pinned footer — replaces standard StepFooter */}
      <div className="sticky bottom-0 bg-white pt-3 pb-5 mt-6 -mx-5 px-5 border-t border-gray-100 shadow-[0_-4px_8px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-3 rounded-pill font-montserrat font-medium text-sm text-carbon bg-white border-2 border-[#CBD5E0] hover:bg-grey100 whitespace-nowrap"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="flex-1 py-3 rounded-pill font-montserrat font-bold text-sm bg-white border-2 border-carbon/30 text-carbon hover:bg-grey100 transition-all"
          >
            No, I disagree
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 py-3 rounded-pill font-montserrat font-bold text-xs bg-bdred text-white hover:bg-[#c2200d] transition-all leading-tight px-2"
          >
            Yes, I agree &amp; confirm all info is true
          </button>
        </div>
      </div>
    </div>
  );
}