import { ArrowLeft, Phone } from 'lucide-react';
import PriceBar from './PriceBar';

export default function QuoteLayout({ step, totalSteps, onBack, showPriceBar, price, formData, children }) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-grey100 flex justify-center">
      <div className="w-full max-w-[390px] bg-white min-h-screen flex flex-col relative shadow-xl">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 w-full">
          <div
            className="h-full bg-bdred transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sticky header */}
        <div className="sticky top-0 bg-white z-30 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={onBack}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-carbon" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-bdred rounded-lg flex items-center justify-center">
                  <span className="text-white font-montserrat font-bold text-xs">BD</span>
                </div>
                <span className="font-montserrat font-bold text-carbon text-sm hidden sm:block">Budget Direct</span>
              </div>
            </div>
            <a href="tel:+6562210011" className="flex items-center gap-1.5 text-cyan text-xs font-montserrat font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>6221 0011</span>
            </a>
          </div>
          <div className="px-4 pb-2">
            <p className="text-[11px] text-muted-foreground font-montserrat">Step {step} of {totalSteps}</p>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-6">
            {children}
          </div>
        </div>

        {/* Price bar */}
        {showPriceBar && <PriceBar price={price} formData={formData} />}
      </div>
    </div>
  );
}