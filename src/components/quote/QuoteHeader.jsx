import { useState, useRef, useEffect } from 'react';

const STEPS = [
  { id: 1, name: 'Start' },
  { id: 2, name: 'Year Registration' },
  { id: 3, name: 'Make & Model' },
  { id: 4, name: 'Car Usage' },
  { id: 5, name: 'Cover Type' },
  { id: 6, name: 'Annual Distance' },
  { id: 7, name: 'Excess' },
  { id: 8, name: 'Vehicle Details' },
  { id: 9, name: 'Driving History' },
  { id: 10, name: 'Your Quote', milestone: true, description: 'See your personalised premium' },
  { id: 11, name: 'Main Driver' },
  { id: 12, name: 'Additional Drivers' },
  { id: 13, name: 'Contact Info' },
  { id: 14, name: 'Additional Details' },
  { id: 15, name: 'Start Date' },
  { id: 16, name: 'Benefits' },
  { id: 17, name: 'Payment', milestone: true, description: 'Complete your purchase' },
  { id: 18, name: 'Summary' },
  { id: 19, name: 'Confirmation' },
];

const MILESTONES = [
  { step: 10, name: 'Your Quote', description: 'See your personalised premium', percent: 52.6 },
  { step: 17, name: 'Payment', description: 'Complete your purchase', percent: 89.5 },
];

export default function QuoteHeader({ step, totalSteps }) {
  const progress = Math.round((step / totalSteps) * 100);
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const progressBarRef = useRef(null);

  const stepName = STEPS.find(s => s.id === step)?.name || `Step ${step}`;

  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    
    // Find closest step
    const closestStep = Math.round((percent / 100) * totalSteps);
    const targetStep = Math.max(1, Math.min(totalSteps, closestStep));
    
    setTooltipPos(percent);
    setTooltipOpen(targetStep);
  };

  const handleMilestoneClick = (milestone, e) => {
    e.stopPropagation();
    if (tooltipOpen === milestone.step) {
      setTooltipOpen(null);
    } else {
      setTooltipOpen(milestone.step);
      setTooltipPos(milestone.percent);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setTooltipOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isMilestoneReached = (milestoneStep) => step >= milestoneStep;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      {/* Logo + Phone row */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="w-20 h-8 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-montserrat text-muted-foreground">Logo</span>
        </div>
        <span className="text-[11px] font-montserrat text-muted-foreground">+65 1234 5678</span>
      </div>

      {/* Progress bar row */}
      <div className="px-4 py-3">
        {/* % Complete label */}
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[11px] font-montserrat text-muted-foreground">
            Step {step} of {totalSteps} — {stepName}
          </span>
          <span className="text-[12px] font-montserrat font-bold text-carbon">
            {progress}% Complete
          </span>
        </div>

        {/* Progress bar with milestones */}
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-visible" onClick={handleProgressBarClick} ref={progressBarRef}>
          {/* Filled progress */}
          <div
            className="h-full bg-bdred rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          {/* Milestone markers */}
          {MILESTONES.map((milestone) => (
            <div
              key={milestone.step}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center -translate-x-1/2 cursor-pointer"
              style={{ left: `${milestone.percent}%` }}
              onClick={(e) => handleMilestoneClick(milestone, e)}
            >
              {/* Diamond marker */}
              <div
                className={`w-3 h-3 rounded-full mb-1 transition-all ${
                  isMilestoneReached(milestone.step)
                    ? 'bg-bdred'
                    : 'bg-white border-2 border-gray-300'
                }`}
              />

              {/* Milestone label (visible on tap or always on larger screens) */}
              {tooltipOpen === milestone.step && (
                <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-md px-2 py-1.5 shadow-md whitespace-nowrap text-center animate-fade-in">
                  <p className="text-[10px] font-montserrat font-medium text-carbon">{milestone.name}</p>
                  <p className="text-[9px] font-montserrat text-muted-foreground">{milestone.description}</p>
                </div>
              )}

              {/* Hidden label text for mobile (shown only on hover via tooltip) */}
              {!tooltipOpen && (
                <span className="text-[9px] font-montserrat text-muted-foreground absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                  {milestone.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Tap tooltip (generic bar position) */}
        {tooltipOpen && !MILESTONES.find(m => m.step === tooltipOpen) && tooltipPos !== null && (
          <div
            className="absolute mt-1 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-md text-[10px] font-montserrat text-muted-foreground animate-fade-in"
            style={{ left: `calc(${tooltipPos}% + 1rem)` }}
          >
            {STEPS.find(s => s.id === tooltipOpen)?.name || `Step ${tooltipOpen}`}
          </div>
        )}
      </div>
    </div>
  );
}