import { Info, CheckCircle, Gauge } from 'lucide-react';
import { useState } from 'react';
import StepFooter from './StepFooter';
import { HELP_TEXTS } from '../../lib/quoteData';

export default function StepDriveLess({ formData, onChange, onNext, onBack }) {
  const handleOptIn = () => {
    onChange('driveLessOptIn', true);
    onChange('driveLessUpgrade', false);
    onNext();
  };

  const handleDecline = () => {
    onChange('driveLessOptIn', false);
    onChange('driveLessUpgrade', false);
    onNext();
  };

  const handleUpgrade = () => {
    onChange('driveLessOptIn', false);
    onChange('driveLessUpgrade', true);
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

      {/* Savings Card */}
      <div className="bg-gradient-to-br from-bdred to-[#b91c0c] rounded-xl px-6 py-6 text-center">
        <div className="flex justify-center mb-3">
          <Gauge className="w-6 h-6 text-white" />
        </div>
        <p className="font-montserrat font-bold text-2xl text-white mb-2">
          Save up to S$150/year
        </p>
        <p className="text-xs font-montserrat text-white/90">
          Pay per kilometre up to your selected limit. If you drive less, you save more.
        </p>
      </div>

      {/* Opt-In Card */}
      <button
        type="button"
        onClick={handleOptIn}
        className="w-full text-left border-2 border-emerald-400 bg-white rounded-xl px-5 py-4 hover:bg-emerald-50/30 transition-all"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-montserrat font-bold text-sm text-carbon">Yes, I want to save</p>
            <p className="font-montserrat text-xs text-muted-foreground mt-1">
              Opt in to Drive Less, Pay Less — save up to S$150/year
            </p>
          </div>
        </div>
      </button>

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

      {/* Odometer Info Note */}
      <div className="flex items-start gap-2.5 bg-blue-50/60 border border-blue-100/50 rounded-lg px-4 py-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-montserrat text-blue-900 leading-relaxed">
          Note: If you opt in, you'll need to submit an odometer photo when your policy starts and at each renewal.
        </p>
      </div>

      {/* Upgrade Option */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleUpgrade}
          className="text-xs font-montserrat text-cyan hover:underline"
        >
          Upgrade to unlimited km (+S$80/year)
        </button>
      </div>

      {/* Footer */}
      <StepFooter onBack={onBack} onNext={() => {}} disabled={true} hideNext={true} />
    </div>
  );
}