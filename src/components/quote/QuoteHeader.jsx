import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Cover Type' },
  { id: 2, name: 'Year Registration' },
  { id: 3, name: 'Make & Model' },
  { id: 4, name: 'Car Usage' },
  { id: 5, name: 'Cover Selection' },
  { id: 6, name: 'Annual Distance' },
  { id: 7, name: 'Excess' },
  { id: 8, name: 'Vehicle Details' },
  { id: 9, name: 'Driving History' },
  { id: 10, name: 'Your Quote', isMilestone: true },
  { id: 11, name: 'Main Driver' },
  { id: 12, name: 'Additional Drivers' },
  { id: 13, name: 'Contact Info' },
  { id: 14, name: 'Additional Details' },
  { id: 15, name: 'Start Date' },
  { id: 16, name: 'Benefits' },
  { id: 17, name: 'Payment', isMilestone: true },
  { id: 18, name: 'Summary' },
  { id: 19, name: 'Confirmation' },
];

const MILESTONES = [
  { step: 10, label: 'Your Quote', percent: 52.6 },
  { step: 17, label: 'Payment', percent: 89.5 },
];

export default function QuoteHeader({ step, totalSteps = 19 }) {
  const progress = Math.round((step / totalSteps) * 100);
  const [expandedStep, setExpandedStep] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const progressBarRef = useRef(null);
  const headerRef = useRef(null);

  const stepName = STEPS.find(s => s.id === step)?.name || `Step ${step}`;

  // Tap on progress bar to show step tooltip
  const handleProgressBarClick = (e) => {
    e.stopPropagation();
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));

    const closestStep = Math.round((clickPercent / 100) * totalSteps);
    const targetStep = Math.max(1, Math.min(totalSteps, closestStep));

    // Toggle: if tapping same step again, close it; otherwise open new one
    if (expandedStep === targetStep) {
      setExpandedStep(null);
    } else {
      setExpandedStep(targetStep);
      setTooltipPos(clickPercent);
    }
  };

  // Tap on milestone marker
  const handleMilestoneClick = (milestone, e) => {
    e.stopPropagation();
    if (expandedStep === milestone.step) {
      setExpandedStep(null);
    } else {
      setExpandedStep(milestone.step);
      setTooltipPos(milestone.percent);
    }
  };

  // Close tooltip when tapping outside header
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setExpandedStep(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isMilestoneReached = (milestoneStep) => step >= milestoneStep;

  return (
    <div ref={headerRef} className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      {/* ROW 1: Logo + Phone */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo placeholder */}
        <div className="w-20 h-7 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-montserrat font-medium text-muted-foreground">Logo</span>
        </div>

        {/* Phone number */}
        <div className="flex items-center gap-1.5 ml-auto">
          <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-montserrat text-muted-foreground">6221 0011</span>
        </div>
      </div>

      {/* ROW 2: Progress Bar */}
      <div className="px-4 pb-3">
        {/* % Completion label row */}
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[12px] font-montserrat text-muted-foreground">
            Step {step} of {totalSteps} — <span className="font-medium text-carbon">{stepName}</span>
          </span>
          <span className="text-[13px] font-montserrat font-bold text-carbon">
            {progress}% Complete
          </span>
        </div>

        {/* Progress bar with milestones */}
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          className="relative h-1.5 bg-gray-200 rounded-full overflow-visible cursor-pointer group"
        >
          {/* Filled progress bar */}
          <div
            className="h-full bg-bdred rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />

          {/* Milestone markers */}
          {MILESTONES.map((milestone) => {
            const isReached = isMilestoneReached(milestone.step);
            const isExpanded = expandedStep === milestone.step;

            return (
              <div
                key={milestone.step}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                style={{ left: `${milestone.percent}%`, transform: 'translate(-50%, -50%)' }}
                onClick={(e) => handleMilestoneClick(milestone, e)}
              >
                {/* Diamond marker */}
                <div
                  className={`w-4 h-4 mb-2 transition-all transform ${
                    isReached
                      ? 'bg-bdred scale-100'
                      : 'bg-white border-2 border-gray-300 scale-90'
                  }`}
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />

                {/* Milestone label - always visible on medium+ screens, tap-to-show on mobile */}
                <div
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-200 ${
                    isExpanded || window.innerWidth >= 768
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <span
                    className={`text-[10px] font-montserrat font-semibold px-1.5 py-0.5 rounded bg-white border transition-all ${
                      isReached
                        ? 'text-bdred border-bdred/30'
                        : 'text-carbon border-gray-200'
                    }`}
                  >
                    {milestone.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded step tooltip */}
        {expandedStep && !MILESTONES.find(m => m.step === expandedStep) && (
          <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-50 animate-fade-in">
            <p className="text-[12px] font-montserrat font-semibold text-carbon">
              {STEPS.find(s => s.id === expandedStep)?.name || `Step ${expandedStep}`}
            </p>
            <p className="text-[11px] font-montserrat text-muted-foreground mt-1">
              Step {expandedStep} of {totalSteps}
            </p>
          </div>
        )}

        {/* Expanded milestone tooltip */}
        {expandedStep && MILESTONES.find(m => m.step === expandedStep) && (
          <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-bdred/30 rounded-lg p-3 shadow-lg z-50 animate-fade-in bg-red-50">
            <p className="text-[12px] font-montserrat font-bold text-bdred">
              {MILESTONES.find(m => m.step === expandedStep)?.label}
            </p>
            <p className="text-[11px] font-montserrat text-muted-foreground mt-1">
              Key milestone — {expandedStep === 10 ? 'Review your personalized quote' : 'Complete your purchase'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}