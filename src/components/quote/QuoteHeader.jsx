import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';

const MILESTONES = [
  { step: 10, label: 'Your Quote', percent: 52.6 },
  { step: 17, label: 'Payment', percent: 89.5 },
];

export default function QuoteHeader({ step, totalSteps = 19 }) {
  const progress = (step / totalSteps) * 100;
  const [activeTooltip, setActiveTooltip] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isMilestoneReached = (milestoneStep) => step >= milestoneStep;

  return (
    <div ref={headerRef} className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      {/* Row 1: Logo + Phone */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="w-20 h-7 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-montserrat font-medium text-muted-foreground">Logo</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-montserrat text-muted-foreground">6221 0011</span>
        </div>
      </div>

      {/* Row 2: Progress Bar */}
      <div className="px-4 pb-4">
        <div className="relative h-1.5 bg-gray-200 rounded-full overflow-visible">
          {/* Filled bar */}
          <div
            className="h-full bg-bdred rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          {/* Milestone markers */}
          {MILESTONES.map((milestone) => {
            const isReached = isMilestoneReached(milestone.step);
            const isExpanded = activeTooltip === milestone.step;

            return (
              <div
                key={milestone.step}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                style={{ left: `${milestone.percent}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(isExpanded ? null : milestone.step);
                }}
              >
                {/* Diamond marker */}
                <div
                  className={`w-3.5 h-3.5 mb-1.5 transition-all ${
                    isReached ? 'bg-bdred' : 'bg-white border-2 border-gray-300'
                  }`}
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />

                {/* Label */}
                <div
                  className={`absolute -top-7 left-1/2 -translate-x-1/2 transition-all duration-200 whitespace-nowrap ${
                    isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <span
                    className={`text-[10px] font-montserrat font-semibold px-2 py-1 rounded bg-white border ${
                      isReached ? 'text-bdred border-bdred/30' : 'text-carbon border-gray-200'
                    }`}
                  >
                    {milestone.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}