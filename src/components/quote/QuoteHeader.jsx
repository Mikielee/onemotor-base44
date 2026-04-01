import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';

const GROUPS = [
  { name: 'Your Details', steps: 9, startStep: 1 },
  { name: 'Your Coverage', steps: 7, startStep: 10 },
  { name: 'Final Steps', steps: 3, startStep: 17 },
];

const MILESTONES = [
  { step: 10, label: 'Your Quote', percent: 52.6 },
  { step: 17, label: 'Payment', percent: 89.5 },
];

export default function QuoteHeader({ step, totalSteps = 19 }) {
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

  const currentGroup = GROUPS.find(g => step >= g.startStep && step < g.startStep + g.steps) || GROUPS[GROUPS.length - 1];
  const currentGroupProgress = Math.round(((step - currentGroup.startStep + 1) / currentGroup.steps) * 100);
  const overallProgress = Math.round((step / totalSteps) * 100);

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

      {/* Row 2: Grouped Progress Bar */}
      <div className="px-4 pb-5">
        <div className="space-y-3">
          {/* Overall Progress Bar with Milestones */}
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-bdred via-red-500 to-red-600 rounded-full shadow-lg transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
            {/* Milestone markers */}
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

          {/* Milestone Tooltips */}
          {MILESTONES.map((milestone) => (
            activeTooltip === milestone.step && (
              <div
                key={`tooltip-${milestone.step}`}
                className="bg-red-50 border-2 border-bdred rounded-lg px-3 py-2 shadow-lg animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs font-montserrat font-bold text-bdred">{milestone.label}</p>
                <p className="text-[10px] font-montserrat text-carbon mt-0.5">
                  {milestone.step === 10 ? 'Review your personalized quote' : 'Complete your purchase'}
                </p>
              </div>
            )
          ))}

          {/* Grouped Section Progress Bars */}
          <div className="space-y-2 pt-2">
            {GROUPS.map((group, idx) => {
              const isCurrentGroup = currentGroup.name === group.name;
              const groupProgress = isCurrentGroup 
                ? currentGroupProgress 
                : step > group.startStep + group.steps - 1 
                ? 100 
                : 0;

              return (
                <div key={group.name} className="space-y-1">
                  {/* Group header with progress */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-montserrat font-bold transition-all ${
                        isCurrentGroup ? 'text-bdred' : 'text-muted-foreground'
                      }`}>
                        {group.name}
                      </span>
                      <span className={`text-[10px] font-montserrat px-2 py-0.5 rounded-full transition-all ${
                        isCurrentGroup 
                          ? 'bg-red-100 text-bdred font-semibold' 
                          : 'bg-gray-100 text-muted-foreground'
                      }`}>
                        {isCurrentGroup ? `${currentGroupProgress}%` : groupProgress === 100 ? '✓' : '—'}
                      </span>
                    </div>
                    <span className="text-[10px] font-montserrat text-muted-foreground">
                      {group.steps} steps
                    </span>
                  </div>

                  {/* Group progress bar */}
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCurrentGroup
                          ? 'bg-gradient-to-r from-bdred via-red-500 to-red-600 shadow-lg'
                          : groupProgress === 100
                          ? 'bg-emerald-500 shadow-sm'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${groupProgress}%` }}
                    />
                  </div>

                  {/* Step dots within group */}
                  <div className="flex gap-1.5 ml-0">
                    {Array.from({ length: group.steps }).map((_, i) => {
                      const stepNum = group.startStep + i;
                      const isStepCompleted = step > stepNum;
                      const isStepCurrent = step === stepNum;

                      return (
                        <div
                          key={stepNum}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            isStepCurrent
                              ? 'bg-bdred scale-125 shadow-md'
                              : isStepCompleted
                              ? 'bg-emerald-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Step Info */}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <p className="text-[11px] font-montserrat text-muted-foreground">
              Currently in <span className="font-bold text-carbon">{currentGroup.name}</span> — Step {step} of {totalSteps}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}