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

      {/* Row 2: Linear Progress Bar with Milestone Markers */}
      <div className="px-4 pb-5">
        <div className="space-y-2">
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Animated gradient fill */}
            <div
              className="h-full bg-gradient-to-r from-bdred via-red-500 to-red-600 rounded-full shadow-lg transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Milestone markers on bar */}
            {MILESTONES.map((milestone) => (
              <button
                key={`marker-${milestone.step}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(activeTooltip === milestone.step ? null : milestone.step);
                }}
                className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all cursor-pointer hover:scale-125 ${
                  isMilestoneReached(milestone.step)
                    ? 'bg-bdred border-white shadow-md'
                    : 'bg-white border-gray-300'
                }`}
                style={{ left: `${milestone.percent}%`, transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </div>
          {/* Step markers below bar */}
          <div className="flex justify-between px-1 text-[10px] font-montserrat text-muted-foreground">
            <span>Start</span>
            <span>Milestones</span>
            <span>End</span>
          </div>
        </div>

        {/* Milestone Tooltips */}
        {MILESTONES.map((milestone) => (
          activeTooltip === milestone.step && (
            <div
              key={`tooltip-${milestone.step}`}
              className="absolute left-4 right-4 top-full mt-2 bg-red-50 border-2 border-bdred rounded-lg px-3 py-2 shadow-lg z-50 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs font-montserrat font-bold text-bdred">{milestone.label}</p>
              <p className="text-[10px] font-montserrat text-carbon mt-0.5">
                {milestone.step === 10 ? 'Review your personalized quote' : 'Complete your purchase'}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}