import { Info, CheckCircle, Gauge, TrendingDown, Zap } from 'lucide-react';
import { useState } from 'react';
import StepFooter from './StepFooter';
import { HELP_TEXTS } from '../../lib/quoteData';

export default function StepDriveLess({ formData, onChange, onNext, onBack }) {
  const [selectedOption, setSelectedOption] = useState(formData.driveLessOptIn ? 'save' : formData.driveLessUpgrade ? 'upgrade' : null);

  const handleOptIn = () => {
    setSelectedOption('save');
    onChange('driveLessOptIn', true);
    onChange('driveLessUpgrade', false);
  };

  const handleUpgrade = () => {
    setSelectedOption('upgrade');
    onChange('driveLessOptIn', false);
    onChange('driveLessUpgrade', true);
  };

  const handleDecline = () => {
    onChange('driveLessOptIn', false);
    onChange('driveLessUpgrade', false);
    onNext();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header / Intro */}
      <div>
        <p className="text-[10px] font-montserrat font-semibold tracking-widest text-cyan uppercase mb-2">
          Great news — you qualify
        </p>
        <h1 className="font-montserrat font-bold text-3xl text-carbon mb-3">
          Drive Less, Pay Less
        </h1>
        <p className="text-sm font-montserrat text-carbon leading-relaxed">
          Because you told us you drive less than 8,000 km per year, you're eligible for our Drive Less, Pay Less programme.
        </p>
      </div>

      {/* Grouped Card Container */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Savings Card */}
        <div className="bg-gradient-to-br from-bdred to-[#b91c0c] px-6 py-6 text-center">
          <div className="flex justify-center mb-3">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <p className="font-montserrat font-bold text-2xl text-white mb-2">
            Save up to S$150/year
          </p>
          <p className="text-xs font-montserrat text-white/90 mb-4">
            Pay per kilometre up to your selected limit. If you drive less, you save more.
          </p>
          
          {/* Odometer Info Note Inside Savings Card */}
          <div className="flex items-start gap-2.5 bg-white/20 rounded-lg px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-white flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-montserrat text-white/90 leading-relaxed">
              You'll need to submit an odometer photo when your policy starts and at renewal.
            </p>
          </div>
        </div>

        {/* Option Buttons */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          {/* Option A: Save */}
          <button
            type="button"
            onClick={handleOptIn}
            className={`w-full text-left border-2 rounded-lg px-4 py-4 transition-all ${
              selectedOption === 'save'
                ? 'border-bdred bg-red-50/30'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedOption === 'save' ? 'bg-emerald-100' : 'bg-grey100'}`}>
                <TrendingDown className={`w-5 h-5 ${selectedOption === 'save' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-montserrat font-bold text-sm text-carbon">Yes, I want to save</p>
                  <span className="text-sm font-montserrat font-bold text-emerald-600">−S$150/year</span>
                </div>
                <p className="font-montserrat text-xs text-muted-foreground">
                  Opt in to Drive Less, Pay Less
                </p>
              </div>
            </div>
          </button>

          {/* Option B: Upgrade */}
          <button
            type="button"
            onClick={handleUpgrade}
            className={`w-full text-left border-2 rounded-lg px-4 py-4 transition-all ${
              selectedOption === 'upgrade'
                ? 'border-bdred bg-red-50/30'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedOption === 'upgrade' ? 'bg-blue-100' : 'bg-grey100'}`}>
                <Zap className={`w-5 h-5 ${selectedOption === 'upgrade' ? 'text-blue-600' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-montserrat font-bold text-sm text-carbon">Upgrade to unlimited km</p>
                  <span className="text-sm font-montserrat font-bold text-bdred">+S$80/year</span>
                </div>
                <p className="font-montserrat text-xs text-muted-foreground">
                  Drive as much as you want
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Decline Text Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleDecline}
          className="text-xs font-montserrat text-muted-foreground hover:text-carbon transition-colors"
        >
          No thanks, keep my standard plan
        </button>
      </div>

      {/* Footer */}
      <StepFooter onBack={onBack} onNext={onNext} disabled={selectedOption === null} />
    </div>
  );
}