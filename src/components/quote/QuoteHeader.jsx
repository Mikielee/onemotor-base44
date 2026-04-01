import { useState, useRef, useEffect } from 'react';
import { Phone, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

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
  { step: 10, label: 'Your Quote', icon: '✓', color: 'text-emerald-600', bgColor: 'bg-emerald-50', percent: 52.6 },
  { step: 17, label: 'Payment', icon: '💳', color: 'text-bdred', bgColor: 'bg-red-50', percent: 89.5 },
];

export default function QuoteHeader({ step, totalSteps = 19 }) {
  const progress = Math.round((step / totalSteps) * 100);
  const [expandedStep, setExpandedStep] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const headerRef = useRef(null);

  const stepName = STEPS.find(s => s.id === step)?.name || `Step ${step}`;
  const currentMilestone = MILESTONES.find(m => m.step === step);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setExpandedStep(null);
        setActiveTooltip(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMilestoneClick = (milestone, e) => {
    e.stopPropagation();
    if (activeTooltip === milestone.step) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(milestone.step);
    }
  };

  const isMilestoneReached = (milestoneStep) => step >= milestoneStep;

  return (
    <div ref={headerRef} className="bg-gradient-to-br from-white via-white to-gray-50 border-b-2 border-gray-100 sticky top-0 z-40 shadow-md">
      {/* ROW 1: Logo + Phone */}
      <div className="px-4 py-4 flex items-center justify-between gap-4">
        <div className="w-20 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-300">
          <span className="text-[11px] font-montserrat font-bold text-gray-600">Logo</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto px-3 py-2 bg-gray-50 rounded-lg">
          <Phone className="w-4 h-4 text-bdred flex-shrink-0" />
          <span className="text-sm font-montserrat font-semibold text-carbon">6221 0011</span>
        </div>
      </div>

      {/* ROW 2: Progress Visualization with Milestones */}
      <div className="px-4 pb-5 space-y-4">
        {/* Progress % and Step Info */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-montserrat text-muted-foreground uppercase tracking-wide">Progress</p>
              <p className="text-3xl font-montserrat font-black text-bdred">{progress}%</p>
            </div>
            <div className="text-right pb-1">
              <p className="text-xs font-montserrat text-muted-foreground uppercase tracking-tight">Step {step}/{totalSteps}</p>
              <p className="text-[13px] font-montserrat font-bold text-carbon leading-tight">{stepName}</p>
            </div>
          </div>
        </div>

        {/* Large Circular Progress Bar */}
        <div className="flex justify-center py-2">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {/* Animated progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#DA291C"
                strokeWidth="8"
                strokeDasharray={`${Math.PI * 100} ${Math.PI * 100}`}
                strokeDashoffset={Math.PI * 100 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-montserrat font-black text-bdred">{progress}%</p>
                <p className="text-[10px] font-montserrat text-muted-foreground mt-0.5">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Badges Row */}
        <div className="flex gap-3 justify-center pt-2">
          {MILESTONES.map((milestone) => {
            const isReached = isMilestoneReached(milestone.step);
            const isActive = step === milestone.step;
            const isExpanded = activeTooltip === milestone.step;

            return (
              <div key={milestone.step} className="relative">
                <button
                  onClick={(e) => handleMilestoneClick(milestone, e)}
                  className={`relative px-4 py-3 rounded-xl font-montserrat font-bold text-sm transition-all duration-300 transform cursor-pointer border-2 ${
                    isReached
                      ? `${milestone.bgColor} border-bdred shadow-md hover:shadow-lg`
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  } ${isActive ? 'ring-2 ring-bdred ring-offset-2 scale-105' : ''} ${
                    isExpanded ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  <span className="text-lg mr-2">{milestone.icon}</span>
                  <span className={isReached ? milestone.color : ''}>{milestone.label}</span>
                  {isReached && <CheckCircle2 className="w-3.5 h-3.5 inline-block ml-1.5 opacity-60" />}
                </button>

                {/* Milestone Tooltip */}
                {isExpanded && (
                  <div className={`absolute -top-14 left-1/2 -translate-x-1/2 ${milestone.bgColor} border-2 border-bdred rounded-lg px-3 py-2 shadow-lg z-50 whitespace-nowrap animate-fade-in`}>
                    <p className="text-xs font-montserrat font-bold text-bdred">{milestone.label}</p>
                    <p className="text-[10px] font-montserrat text-carbon mt-0.5">
                      {milestone.step === 10 ? 'Review your personalized quote' : 'Secure your coverage'}
                    </p>
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 ${milestone.bgColor} border-r-2 border-b-2 border-bdred transform rotate-45 -ml-1`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Linear Progress Bar with Stage Indicators */}
        <div className="space-y-2 pt-3">
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            {/* Animated fill */}
            <div
              className="h-full bg-gradient-to-r from-bdred via-red-500 to-red-600 rounded-full shadow-lg transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Milestone markers on bar */}
            {MILESTONES.map((milestone) => (
              <div
                key={`marker-${milestone.step}`}
                className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all ${
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
            <span>Steps 10/17</span>
            <span>End</span>
          </div>
        </div>

        {/* Journey Stage Label */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-full">
            <p className="text-xs font-montserrat text-carbon">
              <span className="font-bold">{step <= 9 ? '📋 Your Details' : step <= 16 ? '🏠 Your Coverage' : '✅ Final Step'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}