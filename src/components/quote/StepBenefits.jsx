import { useState } from 'react';
import { Shield, Car, ShieldCheck, Wind, Wrench, Phone, Heart, Globe, Plane, Umbrella, Star, Battery, Zap, Wifi, Baby, ShoppingBag } from 'lucide-react';
import StepFooter from './StepFooter';
import HelpIcon from './HelpIcon';
import HelpDrawer from './HelpDrawer';
import { HELP_TEXTS } from '../../lib/quoteData';

const PA_LEVELS = [20000, 50000, 100000, 200000, 500000];
const PA_PRICES = { 20000: 48, 50000: 78, 100000: 110, 200000: 158, 500000: 220 };

const BENEFITS = [
  { key: 'benefitWorkshop', icon: Wrench, name: 'Workshop Option', desc: 'Choose your preferred workshop for repairs' },
  { key: 'benefitRoadside', icon: Phone, name: '24 Hours Roadside Assistance', desc: 'Round-the-clock help for breakdowns and emergencies' },
  { key: 'benefitMedical', icon: Heart, name: 'Medical Expenses', desc: 'Cover for medical costs arising from an accident' },
  { key: 'benefitOverseas', icon: Globe, name: 'Overseas Emergency Allowance/Repatriation', desc: 'Emergency support and repatriation if stranded overseas' },
  { key: 'benefitPA', icon: Shield, name: 'Personal Accident', desc: 'Cover for you and passengers for injuries', hasLevels: true },
  { key: 'benefitLOU', icon: Car, name: 'Transport Allowance/Loss of Use', desc: 'Hire car while yours is being repaired, up to 30 days', helpKey: 'lou' },
  { key: 'benefitWindscreen', icon: Wind, name: 'Windscreen Cover Add-On', desc: 'Repair or replace windscreen once/year with no excess', helpKey: 'windscreen' },
  { key: 'benefitModifications', icon: Star, name: 'Car Modifications & Accessories', desc: 'Cover for approved modifications and accessories' },
  { key: 'benefitNCD', icon: ShieldCheck, name: 'NCD Protector', desc: 'Protect your NCD if you make a claim', helpKey: 'ncdProtection' },
  { key: 'benefitSGOnly', icon: Umbrella, name: 'Singapore Only', desc: 'Coverage limited to Singapore roads only' },
  { key: 'benefitNewForOld', icon: ShoppingBag, name: 'New for Old Replacement', desc: 'Replace your car with a brand-new equivalent if written off' },
  { key: 'benefitPersonalEffects', icon: Plane, name: 'Personal Effects/Valuable Cover', desc: 'Cover for personal belongings in the car' },
  { key: 'benefitBattery', icon: Battery, name: 'Battery Cover', desc: 'Cover for EV/hybrid battery replacement' },
  { key: 'benefitChargingDamage', icon: Zap, name: 'Damage to Charging Station', desc: 'Cover for damage caused to charging stations' },
  { key: 'benefitPrivateCharging', icon: Zap, name: 'Private Charging Station Cover', desc: 'Cover for your home/private charging equipment' },
  { key: 'benefitCyber', icon: Wifi, name: 'Cyber Attack Cover', desc: 'Protection against cyber threats to your connected car' },
  { key: 'benefitChildSeat', icon: Baby, name: 'Child Car Seat Cover', desc: 'Replacement cover for child car seats after an accident' },
];

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
          const displayPrice = b.hasLevels && isOn
            ? `$${PA_PRICES[formData.paCoverLevel || 50000]}/year` : null;

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
                      {b.helpKey && <HelpIcon onClick={() => setHelpOpen(b.helpKey)} />}
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
                  {displayPrice && <p className="text-xs font-montserrat font-bold text-bdred mt-1">{displayPrice}</p>}
                </div>
              </div>

              {b.hasLevels && isOn && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-montserrat text-muted-foreground mb-2">Cover level</p>
                  <div className="flex flex-wrap gap-2">
                    {PA_LEVELS.map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onChange('paCoverLevel', level)}
                        className={`flex-1 min-w-[60px] py-2 rounded-pill text-xs font-montserrat font-bold border-2 transition-all ${
                          (formData.paCoverLevel || 50000) === level
                            ? 'bg-bdred text-white border-bdred'
                            : 'bg-white text-carbon border-gray-200'
                        }`}
                      >
                        ${level >= 1000 ? `${level / 1000}k` : level}
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