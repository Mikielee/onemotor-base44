import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';

export default function QuoteHeader({ step, totalSteps = 19 }) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const headerRef = useRef(null);
  const overallProgress = Math.round((step / totalSteps) * 100);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={headerRef} className="bg-gradient-to-br from-white via-white to-gray-50 border-b-2 border-gray-100 sticky top-0 z-40 shadow-md">
      {/* Row 1: Logo + Phone */}
      <div className="px-4 py-4 flex items-center justify-between gap-4">
        <div className="w-20 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-300">
          <span className="text-[11px] font-montserrat font-bold text-gray-600">Logo</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto px-3 py-2 bg-gray-50 rounded-lg">
          <Phone className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat font-semibold text-carbon">6221 0011</span>
        </div>
      </div>

      {/* Row 2: Progress Dots and Step Info */}
      <div className="px-4 pb-4">
        <div className="space-y-2">
          {/* Step dots for all pages */}
          <div className="flex gap-0.5 w-full">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNum = i + 1;
              const isStepCompleted = step > stepNum;
              const isStepCurrent = step === stepNum;
              const dotSize = isStepCurrent ? 'h-3' : 'h-2';
              const dotColor = isStepCompleted || isStepCurrent ? 'bg-bdred' : 'bg-gray-300';
              const dotFlex = isStepCurrent ? 'flex-grow' : 'flex-1';

              return (
                <div
                  key={stepNum}
                  className={`${dotSize} ${dotColor} rounded-full transition-all ${dotFlex} ${isStepCurrent ? 'shadow-md' : ''}`}
                />
              );
            })}
          </div>

          {/* Current Step Info */}
          <div className="pt-1">
            <p className="text-[11px] font-montserrat text-muted-foreground">
              Step <span className="font-bold text-carbon">{step}</span> of {totalSteps} · <span className="font-bold text-carbon">{overallProgress}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}