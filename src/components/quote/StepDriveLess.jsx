import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';

export default function StepDriveLess({ formData, onChange, onNext }) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="font-montserrat font-bold text-xl text-carbon">
          You qualify for Drive Less Pay Less
        </h1>
        <HelpIcon onClick={() => setHelpOpen(true)} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-sm font-montserrat text-carbon leading-relaxed mb-3">
          Pay per km up to your selected limit. Save money if you drive less than 8,000 km per year.
        </p>
        <div className="bg-emerald-50 rounded-lg px-4 py-3 text-center mb-4">
          <p className="font-montserrat font-bold text-lg text-emerald-700">
            Estimated saving: $150/year
          </p>
        </div>
        <div className="flex items-start gap-2.5 bg-amber-50 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-montserrat text-amber-800 leading-relaxed">
            You will need to submit an odometer photo at policy start and renewal.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <PillButton
          variant="green"
          onClick={() => { onChange('driveLessOptIn', true); onChange('driveLessUpgrade', false); onNext(); }}
        >
          Opt in — Save $150/year
        </PillButton>

        <PillButton
          variant="outline"
          onClick={() => { onChange('driveLessOptIn', false); onChange('driveLessUpgrade', false); onNext(); }}
        >
          No thanks, keep standard plan
        </PillButton>

        <button
          type="button"
          onClick={() => { onChange('driveLessOptIn', false); onChange('driveLessUpgrade', true); onNext(); }}
          className="w-full text-center text-xs font-montserrat text-cyan hover:underline py-2"
        >
          Upgrade to unlimited km (+$80/year)
        </button>
      </div>

      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} title="Drive Less Pay Less">
        {HELP_TEXTS.driveLess}
      </HelpDrawer>
    </div>
  );
}