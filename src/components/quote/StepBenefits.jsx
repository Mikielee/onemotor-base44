import { useState } from 'react';
import { Shield, Car, ShieldCheck, Wind } from 'lucide-react';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import PillButton from './PillButton';
import { HELP_TEXTS } from '../../lib/quoteData';

const BENEFITS = [
  { key: 'benefitPA', icon: Shield, name: 'Personal Accident & Medical', desc: 'Cover for you and passengers for medical bills', price: '$78/year', helpKey: 'pa', hasLevels: true },
  { key: 'benefitNCD', icon: ShieldCheck, name: 'NCD Protection', desc: 'Protect your NCD if you make a claim', price: '$95/year', helpKey: 'ncdProtection' },
  { key: 'benefitLOU', icon: Car, name: 'Loss of Use (Hire Car)', desc: 'Hire car while yours is being repaired, up to 30 days', price: '$120/year', helpKey: 'lou' },
  { key: 'benefitWindscreen', icon: Wind, name: 'Excess-free Windscreen', desc: 'Repair or replace windscreen once/year with no excess', price: '$60/year', helpKey: 'windscreen' },
];

const PA_LEVELS = [50000, 100000, 200000];

export default function StepBenefits({ formData, onChange, onNext, onBack }) {
  const [helpOpen, setHelpOpen] = useState(null);

  return (
    <div className="space-y-4">
      <h1 className="font-montserrat font-bold text-xl text-carbon">
        Customise your cover
      </h1>

      <div className="space-y-3">
        {BENEFITS.map(b => {
          const Icon = b.icon;
          const isOn = !!formData[b.key];
          return (
            <div key={b.key} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isOn ? 'bg-bdred/10' : 'bg-grey100'}`}>
                  <Icon className={`w-5 h-5 ${isOn ? 'text-bdred' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-montserrat font-bold text-sm text-carbon">{b.name}</span>
                      <HelpIcon onClick={() => setHelpOpen(b.helpKey)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => onChange(b.key, !isOn)}
                      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-bdred' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-montserrat mt-1">{b.desc}</p>
                  <p className="text-xs font-montserrat font-bold text-bdred mt-1">{b.price}</p>
                </div>
              </div>

              {/* PA cover levels */}
              {b.hasLevels && isOn && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-montserrat text-muted-foreground mb-2">Cover level</p>
                  <div className="flex gap-2">
                    {PA_LEVELS.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onChange('paCoverLevel', level)}
                        className={`flex-1 py-2 rounded-pill text-xs font-montserrat font-bold border-2 transition-all ${
                          (formData.paCoverLevel || 50000) === level
                            ? 'bg-bdred text-white border-bdred'
                            : 'bg-white text-carbon border-gray-200'
                        }`}
                      >
                        ${(level / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter onBack={onBack} onNext={onNext} />

      <HelpDrawer open={!!helpOpen} onClose={() => setHelpOpen(null)} title={BENEFITS.find(b => b.helpKey === helpOpen)?.name || ''}>
        {helpOpen && HELP_TEXTS[helpOpen]}
      </HelpDrawer>
    </div>
  );
}